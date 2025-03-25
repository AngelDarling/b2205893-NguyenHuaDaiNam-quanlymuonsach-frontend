<template>
    <div class="app-layout">
        <header-vue />
        <div class="main-content">
            <sidebar-vue />
            <div class="content">
                <slot />
            </div>
        </div>
        <footer-vue />
    </div>
</template>

<script>
import HeaderVue from '../components/Header.vue';
import SidebarVue from '../components/Sidebar.vue';
import FooterVue from '../components/Footer.vue';

export default {
    components: {
        HeaderVue,
        SidebarVue,
        FooterVue,
    },
};
</script>

<style>
.app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.main-content {
    display: flex;
    flex: 1;
}

.content {
    flex: 1;
    padding: 20px;
}
</style>