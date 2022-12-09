<template>
  <section id="status-bar">
    <div v-if="isConnected" class="status__wrapper">
      <div
        class="status__dot status__dot--active"
        @click="disconnectCallback"
        style="cursor: pointer"
        title="Click to disconnect wallet"
      ></div>
      <p>Connected as {{ address }}</p>
    </div>
    <div v-else class="status__wrapper">
      <div class="status__dot status__dot--inactive"></div>
      <p>Not Connected</p>
    </div>
  </section>
</template>

<style scoped>
.status__wrapper {
  width: 100%;
  height: var(--statusHeight);
  display: flex;
  align-content: center;
  justify-content: center;
  justify-items: center;
  align-items: center;
  border-bottom: var(--border);
  position: fixed;
  top: 0;
  background-color: var(--black);
  z-index: 5;
}

.status__dot {
  height: 13px;
  width: 13px;
  border-radius: 100%;
  margin-right: 8px;
}

.status__dot--active {
  background: radial-gradient(50% 50% at 50% 50%, #7398dc 0%, #1c326c 100%);
}

.status__dot--inactive {
  background: radial-gradient(50% 50% at 50% 50%, #f57040 37.5%, #7c492d 100%);
}

@media only screen and (min-width: 768px) {
  .status__wrapper {
    /* position: relative; */
  }
}
</style>

<script>
export default {
  props: {
    isConnected: {
      type: Boolean,
      default: false,
    },
    walletAddress: {
      type: String,
      default: "",
    },
  },
  computed: {
    address() {
      return (
        this.walletAddress.slice(0, 5) + "..." + this.walletAddress.slice(-3)
      );
    },
  },
  methods: {
    disconnectCallback() {
      this.$emit("disconnect");
    },
  }
};
</script>