<template>
  <section class="wallet__wrapper" id="wallet">
    <!-- <h2>Wallet</h2> -->
    <div class="card__wrapper">
      <figure
        v-for="token in snowglobeTokens"
        :key="token.tokenId"
        class="card snowglobeToken"
      >
        <img
          :src="`/assets/images/${token.tokenId}.jpg`"
          width="150"
          :class="{ 'grayscale': tokenOwned(token.tokenId) === 0}"
          class="card__img"
        />
        <p class="card__cell card__cell--name">{{ token.name }}</p>
        <div class="card__cell card__cell--supply" v-if="isConnected">
          <h4 v-if="totalSupply[token.tokenId] !== 0">{{ claim.specials[token.tokenId] }} / {{ totalSupply[token.tokenId] }} left</h4>
          <h4 v-else>UNLIMITED</h4>
        </div>
        <div class="card__cell card__cell--supply" v-else>
          <h4 v-if="totalSupply[token.tokenId] !== 0">{{ totalSupply[token.tokenId] }}x</h4>
          <h4 v-else>∞</h4>
        </div>
        <div class="card__cell card__cell--owned">
          <h4 v-if="(tokenOwned(token.tokenId) > 0)">{{ tokenOwned(token.tokenId) }} collected</h4>
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
  
  @media only screen and (min-width: 768px) {
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
      return this.balances[tokenId];
    },
  },

}
</script>