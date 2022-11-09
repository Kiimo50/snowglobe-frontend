<template>
  <section id="claim" v-if="hasClaim && claim.isAvailable">
    <h2>Claim</h2>
    <div v-if="totalSpecialsAvailable > 0">
      You are eligible to claim a Raccoon +
      <select id="specialTokenId" v-model="special">
        <option
          v-for="special in specialTokens"
          :key="special.tokenId"
          :value="special.tokenId"
        >
          {{ special.name }}
        </option>
      </select>
    </div>
    <p v-else>You are eligible to claim a Raccoon</p>
    <button @click="claimNow">Claim Now</button>
  </section>
</template>
<script>
const Meta = require('../data/meta.json');

export default {
  props: {
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
  },

  data() {
    return {
      meta: Meta,
      special: 0,
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
          typeof this.claim.specials[token.tokenId] !== 'undefined' &&
          this.claim.specials[token.tokenId] > 1
      );
    },
  },

  methods: {
    claimNow() {
      this.$emit('claim', {
        tokenId: this.totalSpecialsAvailable > 0 ? this.special : 0,
        nonce: this.claim.nonce,
        claim: this.claim.message,
      });
    },
  },
};
</script>
