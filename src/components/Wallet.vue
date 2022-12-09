<template>
  <section class="wallet__wrapper" id="wallet">
    <div class="card__wrapper">
      <figure
        v-for="token in snowglobeTokens"
        :key="token.tokenId"
        class="card snowglobeToken"
        :class="{
          selected:
            selectedCards.includes(token.tokenId) ||
            (isConnected && claim.isAvailable && token.tokenId === 0),
          hidden:
            isConnected &&
            selectedBundle != null &&
            !selectedBundleRequirements.includes(token.tokenId),
        }"
        @click="selectCard(token.tokenId)"
      >
        <div class="card__zoom" @click="cardZoom(token.tokenId)">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1350_9251)">
              <path
                d="M15.5 14.0713H14.71L14.43 13.8013C15.41 12.6613 16 11.1813 16 9.57129C16 5.98129 13.09 3.07129 9.5 3.07129C5.91 3.07129 3 5.98129 3 9.57129C3 13.1613 5.91 16.0713 9.5 16.0713C11.11 16.0713 12.59 15.4813 13.73 14.5013L14 14.7813V15.5713L19 20.5613L20.49 19.0713L15.5 14.0713ZM9.5 14.0713C7.01 14.0713 5 12.0613 5 9.57129C5 7.08129 7.01 5.07129 9.5 5.07129C11.99 5.07129 14 7.08129 14 9.57129C14 12.0613 11.99 14.0713 9.5 14.0713Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_1350_9251">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0 0.0712891)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <img
          :src="`/assets/images/${token.tokenId}.jpg`"
          width="150"
          :class="{
            grayscale: tokenOwned(token.tokenId) === 0,
            hidden:
              isConnected &&
              selectedBundle != null &&
              !selectedBundleRequirements.includes(token.tokenId),
          }"
          class="card__img"
        />
        <p class="card__cell card__cell--name">{{ token.name }}</p>
        <div class="card__cell card__cell--supply" v-if="isConnected">
          <h4 v-if="totalSupply[token.tokenId] !== 0">
            {{ claim.specials[token.tokenId] }} /
            {{ totalSupply[token.tokenId] }} left
          </h4>
          <h4 v-else>UNLIMITED</h4>
        </div>
        <div class="card__cell card__cell--supply" v-else>
          <h4 v-if="totalSupply[token.tokenId] !== 0">
            {{ totalSupply[token.tokenId] }}x
          </h4>
          <h4 v-else>∞</h4>
        </div>
        <div class="card__cell card__cell--owned">
          <h4
            v-if="
              selectedCards.includes(token.tokenId) &&
              selectedBundle != null &&
              selectedBundleRequirements.includes(token.tokenId) &&
              tokenOwned(token.tokenId) === 0
            "
            class="selected"
          >
            Not in wallet
          </h4>
          <h4
            v-else-if="selectedCards.includes(token.tokenId)"
            class="selected"
          >
            Selected
          </h4>
          <h4 v-else-if="tokenOwned(token.tokenId) > 0">
            {{ tokenOwned(token.tokenId) }} collected
          </h4>
          <h4 v-else>Not in wallet</h4>
        </div>
      </figure>
    </div>
  </section>
</template>

<style>
.wallet__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding-top: 32px;
  padding-bottom: 32px;
  border-bottom: var(--border);
}

.card__wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  grid-gap: 8px;
  max-width: 284px;
}

.snowglobeToken {
  width: 130px;
}

.bundle__status {
  width: 100%;
  position: sticky;
  bottom: 0;
  height: 32px;
}

@media only screen and (min-width: 768px) {
  .bundle__status {
    width: 33.333%;
    position: absolute;
    text-align: center;
    font-weight: 700;
  }

  .wallet__wrapper {
    overflow: scroll;
    border-left: var(--border);
    border-right: var(--border);
    padding-top: 64px;
    padding-bottom: 32px;
    height: calc(100vh - 96px);
    align-content: flex-start;
    align-items: center;
    justify-content: flex-start;
  }
}

@media only screen and (min-width: 1280px) {
  .card__wrapper {
    grid-template-columns: 1fr 1fr 1fr;
    max-width: 438px;
  }
}
</style>

<script>
const Meta = require("../data/meta.json");

export default {
  props: {
    balances: {
      type: Array,
      default: () => [],
    },
    selectedCards: {
      type: Array,
      default: () => [],
    },
    selectedBundle: {
      type: Number,
      default: null,
    },
    selectedBundleRequirements: {
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
        };
      },
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      meta: Meta,
    };
  },

  computed: {
    snowglobeTokens() {
      return this.meta.filter((token) => !token.bundle);
    },
    totalSupply() {
      return this.meta.slice(0, 32).map((token) => token.totalSupply);
    },
  },

  methods: {
    tokenOwned(tokenId) {
      return this.balances[tokenId];
    },
    selectCard(tokenId) {
      if (this.isConnected && this.claim.isAvailable) {
        if (tokenId === 0) {
          return;
        }
        if (this.claim.specials[tokenId] === 0) {
          return;
        }

        this.$emit("selectCard", tokenId);
      }
    },
    cardZoom(tokenId) {
      this.$emit("cardZoom", tokenId);
    },
  },
};
</script>