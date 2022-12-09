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
            grayscale:
              !validateBundleRequirements(token.tokens) &&
              tokenOwned(token.tokenId) === 0,
          }"
          class="card__img"
        />
        <div class="card__cell card__cell--name">
          <h3>{{ token.name }} Bundle</h3>
        </div>
        <div class="card__cell card__cell--owned">
          <div v-if="selectedBundle === token.tokenId">
            <h4 class="text__black">Selected</h4>
          </div>
          <div v-else-if="balances[token.tokenId] > 0">
            <h4 class="text__blue">{{ balances[token.tokenId] }} Collected</h4>
          </div>
          <div
            class="center"
            v-else-if="validateBundleRequirements(token.tokens)"
          >
            <div class="status__dot status__dot--active"></div>
            <h4 class="text__blue" v-if="isConnected">Eligible</h4>
            <h4 class="text__blue" v-else>{{ formatRequirementsString(token.tokenId) }}</h4>
          </div>
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
      //return this.meta.filter((token) => token.bundle);

      // custom order: full set, story, then ascending by tokenId
      return [
        this.meta.find(t => t.tokenId === 39),
        this.meta.find(t => t.tokenId === 35),
        this.meta.find(t => t.tokenId === 32),
        this.meta.find(t => t.tokenId === 37),
        this.meta.find(t => t.tokenId === 33),
        this.meta.find(t => t.tokenId === 38),
        this.meta.find(t => t.tokenId === 34),
        this.meta.find(t => t.tokenId === 36),
      ];
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
    formatRequirementsString(tokenId) {
      if (tokenId === 32) {
        return "11, 12, 13";
      } else if (tokenId === 33) {
        return "17, 18, 19, 17b";
      } else if (tokenId === 34) {
        return "24, 25, 26";
      } else if (tokenId === 35) {
        return "1-30";
      } else if (tokenId === 36) {
        return "27, 28, 29";
      } else if (tokenId === 37) {
        return "14, 15, 16";
      } else if (tokenId === 38) {
        return "21, 22, 23";
      } else if (tokenId === 39) {
        return "1-10";
      }
    },
    selectBundle(tokenId) {
      if (this.isConnected) {
        this.$emit("selectBundle", tokenId);
      }
    },
    cardZoom(tokenId) {
      this.$emit("cardZoom", tokenId);
    },
  },
};
</script>
