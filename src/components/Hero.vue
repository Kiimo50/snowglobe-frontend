<template>
  <section class="hero__wrapper" id="">
    <h1>Curio Snowglobes</h1>

    <div class="button__wrapper" v-if="!isConnected">
      <h2 class="txt__subhead">
        Exclusive collectibles for Curio Card holders
      </h2>

      <button class="button__single button__white" @click="connectCallback">
        Connect Wallet
      </button>

      <button class="button__single button__black" href="Buy on OpenSea">
        Buy on OpenSea
      </button>
    </div>

    <div class="button__wrapper" v-else-if="paused">
      <h2 class="txt__subhead">
        <strong>Contract is paused!</strong> <br />Waiting to begin...
      </h2>
      <button disabled class="button__disabled button__single">
        Claim Snowglobe
      </button>
    </div>

    <div class="button__wrapper" v-else-if="(claim.isAvailable && !(claimPostponed && hasAnyTokens))">
      <h2 class="txt__subhead">You are eligible to claim:</h2>
      <div class="claim__wrapper">
        <figure class="card snowglobeToken selected">
          <img :src="`/assets/images/0.jpg`" width="150" class="card__img" />
          <p class="card__cell card__cell--name">Raccoon</p>
          <div class="card__cell card__cell--supply">
            <h4>{{ claim.remaining }} / 4980 left</h4>
          </div>
          <div class="card__cell card__cell--owned">
            <h4 class="selected">Selected</h4>
          </div>
        </figure>

        <figure
          class="card snowglobeToken selected"
          v-if="!this.fullyClaimed && this.selectedToken != null"
        >
          <img
            :src="`/assets/images/${this.selectedToken.tokenId}.jpg`"
            width="150"
            class="card__img"
          />
          <p class="card__cell card__cell--name">
            {{ this.selectedToken.name }}
          </p>
          <div class="card__cell card__cell--supply">
            <h4>
              {{ claim.specials[this.selectedToken.tokenId] }} /
              {{ totalSupply[this.selectedToken.tokenId] }} left
            </h4>
          </div>
          <div class="card__cell card__cell--owned">
            <h4 class="selected">Selected</h4>
          </div>
        </figure>

        <figure
          class="card snowglobeToken card__empty"
          v-else-if="!this.fullyClaimed"
        >
          <p class="card__img">PICK <br />ANOTHER <br />SNOWGLOBE</p>
          <p class="card__cell card__cell--name"></p>
          <div class="card__cell card__cell--supply">
            <h4></h4>
          </div>
          <div class="card__cell card__cell--owned">
            <h4></h4>
          </div>
        </figure>
      </div>

      <button
        class="button__single"
        :disabled="!allowClaiming"
        :class="{
          button__disabled: !allowClaiming,
          button__white: allowClaiming,
        }"
        @click="claimCallback"
      >
        Claim Selection
      </button>
      <button v-if="(hasAnyTokens)" class="button__single button__black" @click="{claimPostponed = true}">Claim Later</button>
      <button class="button__single button__black" href="Buy on OpenSea">
        Buy on OpenSea
      </button>
    </div>

    <div class="button__wrapper" v-else-if="hasAnyTokens">
      <h2 class="txt__subhead">Select a bundle</h2>
      <div class="button__double--wrapper">
        <button
          class="button__double button__double--left"
          :disabled="!allowBundle"
          :class="{
            button__disabled: !allowBundle,
            button__white: allowBundle,
          }"
          @click="bundleCallback"
        >
          Bundle</button
        ><button
          class="button__double button__double--right"
          :disabled="!allowUnbundle"
          :class="{
            button__disabled: !allowUnbundle,
            button__white: allowUnbundle,
          }"
          @click="unbundleCallback"
        >
          Unbundle
        </button>
      </div>
      <button class="button__single button__black" href="Buy on OpenSea">
        Buy on OpenSea
      </button>
    </div>

    <div class="button__wrapper" v-else>
      <h2 class="txt__subhead">
        You are not eligible to claim any snowglobes.
      </h2>
      <button class="button__single button__black" href="Buy on OpenSea">
        Buy on OpenSea
      </button>
    </div>

    <!-- Scroll Down arrow -->
    <svg
      class="icon__arrows"
      width="24"
      height="38"
      viewBox="0 0 24 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1407_9464)">
        <path
          d="M16.59 8L12 12.58L7.41 8L6 9.41L12 15.41L18 9.41L16.59 8Z"
          fill="#2E2E2E"
        />
      </g>
      <g clip-path="url(#clip1_1407_9464)">
        <path
          d="M16.59 15L12 19.58L7.41 15L6 16.41L12 22.41L18 16.41L16.59 15Z"
          fill="#2E2E2E"
        />
      </g>
      <g clip-path="url(#clip2_1407_9464)">
        <path
          d="M16.59 22L12 26.58L7.41 22L6 23.41L12 29.41L18 23.41L16.59 22Z"
          fill="#2E2E2E"
        />
      </g>
      <defs>
        <clipPath id="clip0_1407_9464">
          <rect width="24" height="24" fill="white" />
        </clipPath>
        <clipPath id="clip1_1407_9464">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 7)"
          />
        </clipPath>
        <clipPath id="clip2_1407_9464">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 14)"
          />
        </clipPath>
      </defs>
    </svg>
  </section>
</template>

<style scoped>
.claim__wrapper {
  display: flex;
  justify-content: center;
  width: 280px;
  margin-bottom: 24px;
  column-gap: 22px;
}

.hero__wrapper {
  height: 100vh;
  border-bottom: var(--border);
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  padding-left: 10vw;
  padding-right: 10vw;
}

.txt__subhead {
  margin-top: 6px;
  margin-bottom: 16px;
  max-width: 280px;
}

.txt__body {
  text-align: center;
}

.icon__arrows {
  position: absolute;
  bottom: 16px;
  animation: hideshow 1s ease infinite;
}

.card__empty {
  border: var(--borderWhite);
  box-shadow: var(--glowButton);
}

@keyframes hideshow {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@media only screen and (min-width: 768px) {
  .hero__wrapper {
    padding-left: 16px;
    padding-right: 16px;
  }

  .icon__arrows {
    display: none;
  }
}
</style>

<script>
const Meta = require("../data/meta.json");

export default {
  name: "Hero",
  props: {
    allowBundle: {
      type: Boolean,
      default: false,
    },
    allowUnbundle: {
      type: Boolean,
      default: false,
    },
    paused: {
      type: Boolean,
      default: false,
    },
    balances: {
      type: Array,
      default: () => [],
    },
    claim: {
      type: Object,
      default: () => {
        return {
          isAvailable: false,
          nonce: null,
          message: null,
          specials: [],
          remaining: 0,
        };
      },
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    selectedTokenId: {
      type: Number,
      default: null,
    },
    selectedBundle: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      meta: Meta,
      claimPostponed: false,
    };
  },
  computed: {
    selectedToken: {
      get() {
        return this.meta.find(
          (token) => token.tokenId === this.selectedTokenId
        );
      },
      set(tokenId) {
        this.selectedTokenId = tokenId;
      },
    },
    hasAnyTokens() {
      // return true if any of the balances are greater than 0
      return this.balances.some((balance) => balance > 0);
    },
    totalSupply() {
      return this.meta.slice(0, 32).map((token) => token.totalSupply);
    },
    fullyClaimed() {
      return this.claim.specials.every((special) => special === 0);
    },
    allowClaiming() {
      // if user has no claim, return false
      if (!this.claim.isAvailable)
        return false;

      // if user has a claim but everything has been claimed, return true- they can get the Raccoon, at least
      if (this.fullyClaimed)
        return true;
      
      // if user has a claim and there are still cards available, return true if they've made a selection
      return this.selectedToken != null;
    },
  },
  methods: {
    getToken(tokenId) {
      return this.meta.find((token) => token.tokenId === tokenId);
    },
    connectCallback() {
      this.$emit("connect");
    },
    claimCallback() {
      this.$emit("claim");
    },
    bundleCallback() {
      this.$emit("bundle");
    },
    unbundleCallback() {
      this.$emit("unbundle");
    },
  },
};
</script>