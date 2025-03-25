<template>
    <header>
        <h1>Hệ thống Quản lý Mượn Sách</h1>
        <nav>
            <router-link to="/">Trang Chủ</router-link>
            <router-link v-if="isAuthenticated" to="/dashboard">Dashboard</router-link>
        </nav>
    </header>
</template>

<script>
export default {
    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        },
    },
};
</script>

<style>
header {
    background-color: #333;
    color: white;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

nav a {
    color: white;
    margin-left: 10px;
    text-decoration: none;
}
</style>