<template>
    <div class="dashboard">
        <h2>Dashboard</h2>
        <p>Xin chào, {{ currentUser ? currentUser.name : 'Khách' }}!</p>
        <button v-if="isAuthenticated" @click="logout">Đăng Xuất</button>
        <div v-if="isAuthenticated">
            <router-link to="/danh-sach-sach">Xem Danh Sách Sách</router-link><br />
            <router-link to="/manage-doc-gia">Quản Lý Độc Giả</router-link><br />
            <router-link to="/manage-nhan-vien">Quản Lý Nhân Viên</router-link><br />
            <router-link to="/manage-sach">Quản Lý Sách</router-link><br />
            <router-link to="/manage-theo-doi-muon-sach">Theo Dõi Mượn Sách</router-link><br />
            <router-link to="/manage-nhap-xuat-ban">Quản Lý Nhập Xuất Bản</router-link>
        </div>
        <div v-else>
            <p>Vui lòng đăng nhập để truy cập dashboard.</p>
            <router-link to="/dang-nhap">Đăng Nhập</router-link>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        },
        currentUser() {
            return this.$store.getters.currentUser;
        },
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/');
        },
    },
};
</script>

<style>
.dashboard {
    padding: 20px;
}
</style>