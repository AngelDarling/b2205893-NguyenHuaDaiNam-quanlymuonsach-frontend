<!-- layouts/defaultLayout.vue -->
<template>
    <div>
        <!-- Thanh điều hướng -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="/">Quản Lý Mượn Sách</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <!-- Hiển thị khi chưa đăng nhập -->
                        <li v-if="!isLoggedIn" class="nav-item">
                            <router-link class="nav-link" to="/dang-nhap">Đăng nhập</router-link>
                        </li>
                        <li v-if="!isLoggedIn" class="nav-item">
                            <router-link class="nav-link" to="/dang-ky">Đăng ký</router-link>
                        </li>
                        <!-- Hiển thị khi đã đăng nhập -->
                        <li v-if="isLoggedIn" class="nav-item">
                            <a class="nav-link" href="#" @click.prevent="dangXuat">Đăng xuất</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Nội dung chính -->
        <div class="content-wrapper">
            <slot />
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
export default {
    data() {
        return {
            isLoggedIn: !!localStorage.getItem("token"),
            role: localStorage.getItem("role"),
        };
    },
    watch: {
        '$route'() {
            // Cập nhật trạng thái đăng nhập khi route thay đổi
            this.isLoggedIn = !!localStorage.getItem("token");
            this.role = localStorage.getItem("role");
        }
    },
    methods: {
        dangXuat() {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            this.isLoggedIn = false;
            this.role = null;
            this.$router.push("/dang-nhap");
            Swal.fire({
                icon: "success",
                title: "Đăng xuất thành công!",
                timer: 1500,
                showConfirmButton: false,
            });
        },
    },
};
</script>

<style scoped>
.navbar {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
    font-weight: bold;
    font-size: 1.5rem;
}

.nav-link {
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: #ffd700 !important;
    /* Màu vàng khi hover */
}

.content-wrapper {
    min-height: calc(100vh - 56px);
    /* Đảm bảo nội dung chiếm toàn màn hình */
}
</style>