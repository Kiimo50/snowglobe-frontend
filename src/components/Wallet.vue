<template>
  <section id="wallet">
    <h2>Wallet</h2>

    <div>
      <div
        v-for="token in snowglobeTokens"
        :key="token.tokenId"
        class="snowglobeToken"
      >
        <img
          :src="`/assets/images/${token.tokenId}.jpg`"
          width="150"
          :class="{ 'grayscale': !tokenOwned(token.tokenId) }"
        />
        <div>
          <h3>{{ token.name }}</h3>
          <div v-if="isConnected">
            <h4 v-if="totalSupply[token.tokenId] !== 0">{{ claim.specials[token.tokenId] }} / {{ totalSupply[token.tokenId] }} left</h4>
            <h4 v-else>∞</h4>
          </div>
          <div v-else>
            <h4 v-if="totalSupply[token.tokenId] !== 0">{{ totalSupply[token.tokenId] }}x</h4>
            <h4 v-else>∞</h4>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
const Meta = require('../data/meta.json');

export default {
  props: {
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
    }
  },

  methods: {
    tokenOwned(tokenId) {
      return this.balances[tokenId] !== 0;
    },
  },

}
</script>