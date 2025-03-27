<!-- views/Dashboard.vue -->
<template>
    <div class="dashboard-container d-flex">
        <!-- Sidebar -->
        <div class="sidebar bg-dark text-white p-3">
            <h4 class="text-center mb-4">Quản Lý</h4>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/dashboard">Dashboard</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-sach">Quản lý sách</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-doc-gia">Quản lý độc giả</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-nhan-vien">Quản lý nhân viên</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-nha-xuat-ban">Quản lý nhà xuất
                        bản</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-theo-doi-muon-sach">Theo dõi mượn
                        sách</router-link>
                </li>
            </ul>
        </div>

        <!-- Nội dung chính -->
        <div class="content p-4 flex-grow-1">
            <h2 class="mb-4">Dashboard</h2>
            <div v-if="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
            </div>
            <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
            <div v-else class="row">
                <div class="col-md-4 mb-4">
                    <div class="card text-white bg-primary">
                        <div class="card-body">
                            <h5 class="card-title">Tổng số sách</h5>
                            <p class="card-text fs-3">{{ totalSach }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card text-white bg-success">
                        <div class="card-body">
                            <h5 class="card-title">Tổng số độc giả</h5>
                            <p class="card-text fs-3">{{ totalDocGia }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card text-white bg-info">
                        <div class="card-body">
                            <h5 class="card-title">Tổng số mượn sách</h5>
                            <p class="card-text fs-3">{{ totalMuonSach }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card text-white bg-warning">
                        <div class="card-body">
                            <h5 class="card-title">Tổng số nhà xuất bản</h5>
                            <p class="card-text fs-3">{{ totalNhaXuatBan }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card text-white bg-secondary">
                        <div class="card-body">
                            <h5 class="card-title">Tổng số nhân viên</h5>
                            <p class="card-text fs-3">{{ totalNhanVien }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card text-white bg-danger">
                        <div class="card-body">
                            <h5 class="card-title">Số sách chưa trả</h5>
                            <p class="card-text fs-3">{{ chuaTra }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card text-white bg-dark">
                        <div class="card-body">
                            <h5 class="card-title">Số sách đã trả</h5>
                            <p class="card-text fs-3">{{ daTra }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card text-white bg-danger">
                        <div class="card-body">
                            <h5 class="card-title">Số sách quá hạn</h5>
                            <p class="card-text fs-3">{{ quaHan }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            totalSach: 0,
            totalDocGia: 0,
            totalMuonSach: 0,
            totalNhaXuatBan: 0,
            totalNhanVien: 0,
            chuaTra: 0,
            daTra: 0,
            quaHan: 0,
            loading: false,
            errorMessage: "",
        };
    },
    mounted() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.$router.push("/dang-nhap");
            return;
        }
        this.fetchStatistics();
    },
    methods: {
        async fetchStatistics() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const [sachRes, docGiaRes, muonSachStats, nhaXuatBanRes, nhanVienRes] = await Promise.all([
                    axios.get("http://localhost:3000/sach", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { limit: 1 },
                    }),
                    axios.get("http://localhost:3000/docGia", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { limit: 1 },
                    }),
                    axios.get("http://localhost:3000/theoDoiMuonSach/statistics", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:3000/nhaXuatBan", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { limit: 1 },
                    }),
                    axios.get("http://localhost:3000/nhanVien", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { limit: 1 },
                    }),
                ]);

                this.totalSach = sachRes.data.total || 0;
                this.totalDocGia = docGiaRes.data.total || 0;
                this.totalMuonSach = muonSachStats.data.total || 0;
                this.chuaTra = muonSachStats.data.chuaTra || 0;
                this.daTra = muonSachStats.data.daTra || 0;
                this.quaHan = muonSachStats.data.quaHan || 0;
                this.totalNhaXuatBan = nhaXuatBanRes.data.total || 0;
                this.totalNhanVien = nhanVienRes.data.total || 0;
            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false;
            }
        },
        handleError(err) {
            const message = err.response?.data?.message || err.message || "Đã xảy ra lỗi.";
            if (message.includes("Token không hợp lệ") || message.includes("Không có token")) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                this.$router.push("/dang-nhap");
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
                    confirmButtonText: "OK",
                });
            } else {
                this.errorMessage = message;
            }
        },
    },
};
</script>

<style scoped>
.dashboard-container {
    min-height: 100vh;
}

.sidebar {
    width: 250px;
    min-height: 100vh;
}

.sidebar .nav-link {
    padding: 10px;
    border-radius: 5px;
}

.sidebar .nav-link:hover {
    background-color: #495057;
}

.content {
    background-color: #f8f9fa;
}

.card {
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-body {
    text-align: center;
}

.fs-3 {
    font-size: 2rem;
}

.spinner-border {
    width: 2rem;
    height: 2rem;
}
</style>