<template>
    <section id="status-bar">
        <p v-if="isConnected">Connected: {{ walletAddress }}</p>
        <p v-else>Not Connected</p>
    </section>
</template>

<script>
export default {
    props: {
        isConnected: {
            type: Boolean,
            default: false,
        },
        walletAddress: {
            type: String,
            default: '',
        },
    },
};
</script>