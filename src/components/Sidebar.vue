<template>
    <aside v-if="isAuthenticated">
        <h3>Menu</h3>
        <ul>
            <li><router-link to="/danh-sach-sach">Danh Sách Sách</router-link></li>
            <li><router-link to="/manage-doc-gia">Quản Lý Độc Giả</router-link></li>
            <li><router-link to="/manage-nhan-vien">Quản Lý Nhân Viên</router-link></li>
            <li><router-link to="/manage-sach">Quản Lý Sách</router-link></li>
            <li><router-link to="/manage-theo-doi-muon-sach">Theo Dõi Mượn Sách</router-link></li>
            <li><router-link to="/manage-nhap-xuat-ban">Quản Lý Nhập Xuất Bản</router-link></li>
        </ul>
    </aside>
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
aside {
    width: 200px;
    background-color: #f4f4f4;
    padding: 20px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
}

a {
    text-decoration: none;
    color: #333;
}
</style>