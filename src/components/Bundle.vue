<template>
  <section class="bundle__wrapper" id="bundle">
    <div class="card__wrapper--bundle">
      <div
        v-for="token in bundleTokens"
        :key="token.tokenId"
        class="card bundleToken"
      >
        <img
          :src="`/assets/images/${token.tokenId}.jpg`"
          width="150"
          :class="{ 'grayscale': !validateBundleRequirements(token.tokens) && tokenOwned(token.tokenId) === 0 }"
          class="card__img"
        />
        <div class="card__cell card__cell--name">
          <h3>{{ token.name }}</h3>
          <!-- <p>This bundle requires tokens {{ token.tokens }}.</p> -->
          <!-- <button v-if="validateBundleRequirements(token.tokens)" @click="bundleNow(token)">
            Bundle
          </button> -->
        </div>
        <div class="card__cell card__cell--owned">
          <h4 v-if="validateBundleRequirements(token.tokens)">Eligible</h4>
          <h4 v-else>Ineligible</h4>
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

  .bundleToken{
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
const Meta = require('../data/meta.json');

export default {
  props: {
    balances: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      meta: Meta,
      modal: false,
      bundle: null,
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
        tokens.map((tokenId) => '#' + tokenId).join(', ') + ' & ' + lastTokenId
      );
    },
  },

  methods: {
    tokenOwned(tokenId) {
      return this.balances[tokenId];
    },
    validateBundleRequirements(requirements) {
      //console.log("validating bundle ", requirements);
      for (let i in requirements) {
        //if (this.balances[requirements[i]] === 0) console.log("false");
        if (this.balances[requirements[i]] === 0) return false;
      }
      //console.log("true");
      return true;
    },
    bundleNow(token) {
      if (token.bundle) {
        this.bundle = token;
        this.modal = true;
      }
    },
    cancel() {
      this.modal = false;
      this.bundle = null;
    },
    confirm() {
      this.$emit('confirm', this.bundle);
      this.cancel();
    },
  },
};
</script>
