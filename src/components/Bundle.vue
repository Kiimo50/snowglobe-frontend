<template>
  <section id="bundle">
    <h2>Bundles</h2>

    <h3>model</h3>

    <div>
      <div
        v-for="token in bundleTokens"
        :key="token.tokenId"
        class="bundleToken"
      >
        <img
          :src="`/assets/images/${token.tokenId}.jpg`"
          width="150"
          :class="{ 'grayscale': !validateBundle(token.tokenId) }"
        />
        <div>
          <h3>{{ token.name }}</h3>
          <p>This bundle requires tokens {{ token.tokens }}.</p>
          <button v-if="validateBundle(token.tokens)" @click="bundleNow(token)">
            Bundle
          </button>
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
    validateBundle(requirements) {
      for (let i in requirements) {
        if (this.balances[requirements[i]] === 0) return false;
      }
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
