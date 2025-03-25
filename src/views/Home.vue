<template>
    <div class="home-page">
        <div class="text-center mb-4">
            <h1>Chào mừng đến với Hệ thống Quản lý Mượn Sách</h1>
            <p v-if="isAuthenticated && userType === 'docgia'" class="text-muted">Danh sách sách hiện có</p>
        </div>

        <!-- Hiển thị danh sách sách nếu là độc giả -->
        <div v-if="isAuthenticated && userType === 'docgia'" class="book-list">
            <table class="table table-bordered table-hover">
                <thead class="table-primary">
                    <tr>
                        <th>Mã Sách</th>
                        <th>Tên Sách</th>
                        <th>Đơn Giá</th>
                        <th>Số Quyển</th>
                        <th>Năm Xuất Bản</th>
                        <th>Nhà Xuất Bản</th>
                        <th>Tác Giả/Nguồn Gốc</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="sach in sachList" :key="sach.MaSach">
                        <td>{{ sach.MaSach }}</td>
                        <td>{{ sach.TenSach }}</td>
                        <td>{{ sach.DonGia }}</td>
                        <td>{{ sach.SoQuyen }}</td>
                        <td>{{ sach.NamXuatBan }}</td>
                        <td>{{ sach.nhaXuatBan ? sach.nhaXuatBan.TenNXB : 'N/A' }}</td>
                        <td>{{ sach.NguonGoc || 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Hiển thị thông báo nếu chưa đăng nhập -->
        <div v-else class="text-center">
            <p>Vui lòng đăng nhập để xem danh sách sách.</p>
            <router-link to="/dang-nhap" class="btn btn-primary">Đăng Nhập</router-link>
            <span class="mx-2">hoặc</span>
            <router-link to="/dang-ky" class="btn btn-secondary">Đăng Ký</router-link>
        </div>
    </div>
</template>

<script>
import SachService from '../services/sach.service';

export default {
    data() {
        return {
            sachList: [],
        };
    },
    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        },
        userType() {
            return this.$store.getters.userType;
        },
    },
    async created() {
        if (this.isAuthenticated && this.userType === 'docgia') {
            await this.fetchSach();
        }
    },
    methods: {
        async fetchSach() {
            try {
                const response = await SachService.getAll();
                this.sachList = response.data;
            } catch (err) {
                console.error('Lỗi khi lấy danh sách sách:', err);
            }
        },
    },
};
</script>

<style scoped>
.home-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.book-list {
    margin-top: 20px;
}

.table {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.table th,
.table td {
    vertical-align: middle;
}

.table-primary {
    background-color: #007bff;
    color: white;
}
</style>