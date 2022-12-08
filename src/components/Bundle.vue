<template>
  <section class="bundle__wrapper" id="bundle">
    <div class="card__wrapper--bundle">
      <div
        v-for="token in bundleTokens"
        :key="token.tokenId"
        class="card bundleToken"
        :class="{ selected: selectedBundle === token.tokenId }"
        @click="selectBundle(token.tokenId)"
      >
        <img
          :src="`/assets/images/${token.tokenId}.jpg`"
          width="150"
          :class="{
            grayscale:
              !validateBundleRequirements(token.tokens) &&
              tokenOwned(token.tokenId) === 0,
          }"
          class="card__img"
        />
        <div class="card__cell card__cell--name">
          <h3>{{ token.name }}</h3>
        </div>
        <div class="card__cell card__cell--owned">
          <h4 v-if="balances[token.tokenId] > 0"
            style="color: skyblue !important"
            >
          <!-- FIXME fix style -->
            {{ balances[token.tokenId] }} Collected
          </h4>
          <h4
            v-else-if="validateBundleRequirements(token.tokens)"
            style="color: white"
          >
          <!-- FIXME fix style -->
            Eligible
          </h4>
          <h4 v-else>Ineligible</h4>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.card__wrapper--bundle {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  grid-gap: 16px;
}

.bundle__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding-top: 32px;
  padding-bottom: 32px;
}

.bundleToken {
  width: 200px;
}

@media only screen and (min-width: 768px) {
  .bundle__wrapper {
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
  .card__wrapper--bundle {
    grid-template-columns: 1fr 1fr;
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
    selectedBundle: {
      type: Number,
      default: null,
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
    bundleTokens() {
      return this.meta.filter((token) => token.bundle);
    },
    tokensToBundleDisplay() {
      let tokens = [...this.bundle.tokens];
      let lastTokenId = tokens.pop();
      return (
        tokens.map((tokenId) => "#" + tokenId).join(", ") + " & " + lastTokenId
      );
    },
  },

  methods: {
    tokenOwned(tokenId) {
      return this.balances[tokenId];
    },
    validateBundleRequirements(requirements) {
      for (let i in requirements) {
        if (this.balances[requirements[i]] === 0) return false;
      }
      return true;
    },
    selectBundle(tokenId) {
      if (this.isConnected) {
        this.$emit("selectBundle", tokenId);
      }
    },
  },
};
</script>
