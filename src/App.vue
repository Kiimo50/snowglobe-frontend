<template>
  <div class="container mx-auto">
    <status :isConnected="isConnected" :walletAddress="walletAddress" />
    <main>
      <hero
        :isConnected="isConnected"
        :balances="balances"
        :claim="claim"
        :selectedTokenId="selectedTokenId"
        :allowBundle="(selectedBundle && validateBundleRequirements(meta[selectedBundle].tokens))"
        :allowUnbundle="(selectedBundle && balances[selectedBundle] > 0)"
        @connect="connect"
        @disconnect="disconnect"
        @claim="initClaim"
        @bundle="initBundle"
        @unbundle="initUnbundle"
      />

      <wallet
        :isConnected="isConnected"
        :balances="balances"
        :claim="claim"
        :selectedCards="selectedCards"
        @selectCard="selectSingleCard"
      />

      <bundle
        :isConnected="isConnected"
        :balances="balances"
        :claim="claim"
        :selectedBundle="selectedBundle"
        @selectBundle="selectBundle"
      />
    </main>

    <div class="modal" v-if="transaction.processing">
      <div class="backdrop"></div>
      <div class="modalContainer">
        <div>
          <div>
            <p>Processing...</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" v-if="transaction.error.state">
      <div class="backdrop"></div>
      <div class="modalContainer">
        <div>
          <div>
            <p>There was an error.</p>
            <pre>{{ transaction.error.message }} </pre>
            <button class="cancel" @click="resetTransaction">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" v-if="modal">
      <div class="backdrop"></div>
      <div class="modalContainer">
        <div>
          <div>
            <p>
              You are about to bundle tokens {{ tokensToBundleDisplay }} into a
              new token #{{ this.bundle.tokenId }}. Do you wish to continue?
            </p>
            <div>
              <button @click="cancel" class="cancel">Cancel</button>
              <button @click="confirm">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
main {
  display: grid;
}

@media only screen and (min-width: 768px) {
  main {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>

<script>
const ethers = require("ethers");
const WalletConnectProvider = require("./lib/walletconnect.bundle").default;
const Web3Modal = require("web3modal").default;

const Claims = require("./data/claims.json");
const Meta = require("./data/meta.json");

let CURIO_ADDR = env.CURIO_ADDR;
const CurioABI = [
  "function totalTokenTypes () public view returns (uint256)",
  "function balanceOfBatch (address[],uint256[]) external view returns (uint256[])",
  "function uri (uint256) public view returns (string)",
  "function safeTransferFrom (address,address,uint256) public",
  "function isStillAvailable (uint256) public view returns (bool)",
  "function getClaimableSupplies () public view returns (uint8[32])",
  "function claim (uint256,uint16,bytes) public",
  "function bundle (uint256[]) public",
  "function unbundle (uint256) public",
];
let web3Modal, Provider, Signer, CURIO;

import ClaimComponent from "./components/Claim.vue";
import WalletComponent from "./components/Wallet.vue";
import BundleComponent from "./components/Bundle.vue";
import StatusBarComponent from "./components/StatusBar.vue";
import HeroComponent from "./components/Hero.vue";

export default {
  components: {
    claim: ClaimComponent,
    wallet: WalletComponent,
    bundle: BundleComponent,
    status: StatusBarComponent,
    hero: HeroComponent,
  },

  data() {
    return {
      modal: false,
      isConnected: false,
      walletAddress: null,
      balances: [],
      tokensOwned: [],
      selectedCards: [],
      selectedBundle: null,
      meta: Meta,
      claim: {
        isAvailable: false,
        nonce: null,
        message: null,
        specials: [],
      },
      transaction: {
        processing: false,
        success: false,
        error: {
          state: false,
          message: "",
        },
      },
    };
  },

  computed: {
    hasClaim() {
      return this.claim.nonce !== null;
    },
    totalSpecialsAvailable() {
      return this.claim.specials.reduce((sum, tokenId) => (sum += tokenId), 0);
    },
    specialTokens() {
      return this.meta.filter(
        (token) =>
          typeof this.claim.specials[token.tokenId] !== "undefined" &&
          this.claim.specials[token.tokenId] > 0
      );
    },
    selectedTokenId() {
      return this.selectedCards.length === 1 ? this.selectedCards[0] : null;
    },
  },

  created() {
    try {
      web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: env.INFURA_ID,
            },
          },
        }, // required
      });

      console.log(
        "web3Modal not undefined: ",
        typeof web3Modal !== "undefined"
      );
      console.log("web3Modal.cashedProvider: ", web3Modal.cachedProvider);
      if (typeof web3Modal !== "undefined" && web3Modal.cachedProvider)
        this.connect();
    } catch (err) {
      console.log(err);
    }
  },

  methods: {
    async connect() {
      try {
        const instance = await web3Modal.connect();

        Provider = new ethers.providers.Web3Provider(instance);

        Provider.provider.on("accountsChanged", (accounts) =>
          this.fetchAccount()
        );
        this.fetchAccount();
      } catch (err) {
        console.log(err);
      }
    },
    async disconnect() {
      try {
        if (Provider !== null && typeof Provider.close === "function") {
          await Provider.close();
        }

        await web3Modal.clearCachedProvider();

        this.isConnected = false;
        this.walletAddress = null;
        Provider = null;
        Signer = null;
      } catch (err) {
        console.log(err);
      }
    },
    async selectSingleCard(tokenId) {
      if (this.selectedCards.includes(tokenId)) {
        this.selectedCards = this.selectedCards.filter((id) => id !== tokenId);
      } else {
        this.selectedCards = [tokenId];
      }
    },
    async selectBundle(bundleTokenId) {
      // if targeted bundle already selected, deselect it
      if (this.selectedBundle === bundleTokenId) {
        this.selectedCards = [];
        this.selectedBundle = null;
        return;
      }
      // else, select the bundle and its dependencies
      this.selectedBundle = bundleTokenId;
      this.selectedCards = this.meta
        .filter((token) => token.tokenId === bundleTokenId)
        .map((token) => token.tokens)
        .flat();
    },
    async fetchAccount() {
      let accounts;
      try {
        accounts = await Provider.send("eth_requestAccounts", []);
      } catch (e) {
        console.log("Failed to Get Address");

        this.isConnected = false;
        this.walletAddress = null;
        return;
      }
      if (accounts && accounts[0]) {
        Signer = await Provider.getSigner();
        CURIO = new ethers.Contract(CURIO_ADDR, CurioABI, Signer);

        this.walletAddress = await Signer.getAddress();
        this.isConnected = true;

        this.getClaimData();
        this.getTokensOwned();
      }
    },
    async getClaimData() {
      if (typeof Claims[this.walletAddress] !== "undefined") {
        this.claim = {
          isAvailable: await CURIO.isStillAvailable(
            Claims[this.walletAddress].nonce
          ),
          nonce: Claims[this.walletAddress].nonce,
          message: Claims[this.walletAddress].claim,
          specials: await CURIO.getClaimableSupplies(),
        };
      } else {
        this.claim = {
          isAvailable: false,
          nonce: null,
          message: null,
          specials: [],
        };
      }
    },
    async getTokensOwned() {
      if (this.isConnected) {
        const totalTokenTypes = (await CURIO.totalTokenTypes()).toNumber();
        const balances = (
          await CURIO.balanceOfBatch(
            Array(totalTokenTypes).fill(this.walletAddress),
            Object.keys(Array(totalTokenTypes).fill(0)).map((i) => Number(i))
          )
        ).map((balance) => balance.toNumber());
        console.log(balances);

        this.balances = balances;
        this.tokensOwned = balances.reduce((owned, balance, tokenId) => {
          if (balance > 0) {
            owned.push({ tokenId, balance });
          }
          return owned;
        }, []);
      }
    },
    async initClaim() {
      const tokenId =
        this.totalSpecialsAvailable > 0 ? this.selectedTokenId : 0;

      if (this.isConnected) {
        this.resetTransaction();
        this.transaction.processing = true;
        let tx;
        try {
          console.log(
            "claiming: ",
            tokenId,
            this.claim.nonce,
            this.claim.message
          );
          tx = await CURIO.claim(tokenId, this.claim.nonce, this.claim.message);
        } catch (err) {
          tx = err;
        }
        this.processingTransaction(tx, (receipt) => {
          this.getClaimData();
          this.getTokensOwned();
          this.resetSelection();
        }).catch((err) => console.error(err));
      }
    },
    async initBundle() {
      const bundle = this.meta.find(
        (token) => token.tokenId === this.selectedBundle
      );

      if (this.isConnected) {
        this.resetTransaction();
        this.transaction.processing = true;
        let tx;
        try {
          tx = await CURIO.bundle(bundle.tokens);
        } catch (err) {
          tx = err;
        }
        this.processingTransaction(tx, (receipt) => {
          this.getClaimData();
          this.getTokensOwned();
          this.resetSelection();
        }).catch((err) => console.error(err));
      }
    },
    async initUnbundle() {
      console.log("unbundle: ", this.selectedBundle)
      if (this.isConnected) {
        this.resetTransaction();
        this.transaction.processing = true;
        let tx;
        try {
          tx = await CURIO.unbundle(this.selectedBundle);
        } catch (err) {
          tx = err;
        }
        this.processingTransaction(tx, (receipt) => {
          this.getClaimData();
          this.getTokensOwned();
          this.resetSelection();
        }).catch((err) => console.error(err));
      }
    },
    resetSelection() {
      this.selectedCards = [];
      this.selectedBundle = null;
    },
    resetTransaction() {
      this.transaction = {
        processing: false,
        success: false,
        error: {
          state: false,
          message: "",
        },
      };
    },
    async processingTransaction(tx, cb) {
      if (typeof tx.wait === "function") {
        const receipt = await tx.wait();
        this.transaction.success = true;
        if (typeof cb === "function") cb(receipt);
      } else {
        let err = typeof tx.error !== "undefined" ? tx.error : tx;

        if (
          typeof err.data !== "undefined" &&
          typeof err.data.message !== "undefined"
        )
          this.transaction.error.message = err.data.message.replace(
            "Error: VM Exception while processing transaction: ",
            ""
          );
        else this.transaction.error.message = err.message;

        this.transaction.error.state = true;
      }

      this.transaction.processing = false;

      if (this.transaction.error.state === true)
        throw new Error(this.transaction.error.message);
    },
    validateBundleRequirements(requirements) {
      for (let i in requirements) {
        if (this.balances[requirements[i]] === 0) return false;
      }
      return true;
    },
  },
};
</script>