<template>
    <default-layout>
        <router-view />
    </default-layout>
</template>

<script>
import DefaultLayout from './layouts/defaultLayout.vue';

export default {
    components: {
        DefaultLayout,
    },
};
</script>