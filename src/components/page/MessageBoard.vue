<template>
    <div class="">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
    </div>
</template>

<script>
    import vHead from '../common/Header.vue';
    import vSidebar from '../common/Sidebar.vue';
    export default {
        name: "MessageBoard",
        components: {
            vHead, vSidebar
        }
    }
</script>

<style scoped>

</style>
