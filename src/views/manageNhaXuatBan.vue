<!-- views/ManageNhaXuatBan.vue -->
<template>
    <div class="manage-container d-flex">
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
            <h2 class="mb-4">Quản Lý Nhà Xuất Bản</h2>
            <div class="mb-3 d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary" @click="showAddModal">Thêm nhà xuất bản</button>
                </div>
                <div>
                    <input type="text" v-model="searchQuery" class="form-control"
                        placeholder="Tìm kiếm nhà xuất bản theo tên..." @input="fetchNhaXuatBan" />
                </div>
            </div>
            <div v-if="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
            </div>
            <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
            <div v-else-if="nhaXuatBanList.length === 0" class="text-center">
                <p>Không có nhà xuất bản nào để hiển thị.</p>
            </div>
            <div v-else>
                <table class="table table-bordered table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Mã NXB</th>
                            <th>Tên NXB</th>
                            <th>Địa Chỉ</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="nhaXuatBan in nhaXuatBanList" :key="nhaXuatBan._id">
                            <td>{{ nhaXuatBan.MaNXB }}</td>
                            <td>{{ nhaXuatBan.TenNXB }}</td>
                            <td>{{ nhaXuatBan.DiaChi }}</td>
                            <td>
                                <button class="btn btn-warning btn-sm me-2"
                                    @click="editNhaXuatBan(nhaXuatBan)">Sửa</button>
                                <button class="btn btn-danger btn-sm"
                                    @click="deleteNhaXuatBan(nhaXuatBan._id)">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Phân trang -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <p>Hiển thị {{ nhaXuatBanList.length }} / {{ total }} nhà xuất bản</p>
                    </div>
                    <div>
                        <button class="btn btn-secondary me-2" @click="prevPage" :disabled="currentPage === 1">
                            Trang trước
                        </button>
                        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
                        <button class="btn btn-secondary ms-2" @click="nextPage" :disabled="currentPage === totalPages">
                            Trang sau
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal thêm/sửa nhà xuất bản -->
            <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditMode ? "Sửa nhà xuất bản" : "Thêm nhà xuất bản" }}</h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveNhaXuatBan">
                                <div class="mb-3">
                                    <label for="maNXB" class="form-label">Mã NXB</label>
                                    <input id="maNXB" v-model="currentNhaXuatBan.MaNXB" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="tenNXB" class="form-label">Tên NXB</label>
                                    <input id="tenNXB" v-model="currentNhaXuatBan.TenNXB" class="form-control"
                                        required />
                                </div>
                                <div class="mb-3">
                                    <label for="diaChi" class="form-label">Địa Chỉ</label>
                                    <input id="diaChi" v-model="currentNhaXuatBan.DiaChi" class="form-control"
                                        required />
                                </div>
                                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                                    {{ isLoading ? "Đang lưu..." : "Lưu" }}
                                </button>
                                <button type="button" class="btn btn-secondary ms-2" @click="closeModal">Hủy</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showModal" class="modal-backdrop fade show"></div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            nhaXuatBanList: [],
            loading: false,
            errorMessage: "",
            showModal: false,
            isEditMode: false,
            isLoading: false,
            currentNhaXuatBan: {
                MaNXB: "",
                TenNXB: "",
                DiaChi: "",
            },
            searchQuery: "", // Từ khóa tìm kiếm
            currentPage: 1, // Trang hiện tại
            limit: 6, // Số nhà xuất bản mỗi trang
            total: 0, // Tổng số nhà xuất bản
            totalPages: 1, // Tổng số trang
        };
    },
    mounted() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.$router.push("/dang-nhap");
            return;
        }
        this.fetchNhaXuatBan();
    },
    methods: {
        async fetchNhaXuatBan() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const response = await axios.get("http://localhost:3000/nhaXuatBan", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search: this.searchQuery,
                        page: this.currentPage,
                        limit: this.limit,
                    },
                });
                this.nhaXuatBanList = response.data.nhaXuatBans;
                this.total = response.data.total;
                this.currentPage = response.data.page;
                this.limit = response.data.limit;
                this.totalPages = response.data.totalPages;
            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false;
            }
        },
        showAddModal() {
            this.isEditMode = false;
            this.currentNhaXuatBan = {
                MaNXB: "",
                TenNXB: "",
                DiaChi: "",
            };
            this.showModal = true;
        },
        editNhaXuatBan(nhaXuatBan) {
            this.isEditMode = true;
            this.currentNhaXuatBan = { ...nhaXuatBan };
            this.showModal = true;
        },
        async saveNhaXuatBan() {
            try {
                this.isLoading = true;

                // Validate dữ liệu
                if (!this.currentNhaXuatBan.MaNXB) {
                    throw new Error("Mã NXB không được để trống.");
                }
                if (!this.currentNhaXuatBan.TenNXB) {
                    throw new Error("Tên NXB không được để trống.");
                }
                if (!this.currentNhaXuatBan.DiaChi) {
                    throw new Error("Địa chỉ không được để trống.");
                }

                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                if (this.isEditMode) {
                    await axios.put(`http://localhost:3000/nhaXuatBan/${this.currentNhaXuatBan._id}`, this.currentNhaXuatBan, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Nhà xuất bản đã được cập nhật thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } else {
                    await axios.post("http://localhost:3000/nhaXuatBan", this.currentNhaXuatBan, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Nhà xuất bản đã được thêm thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
                this.closeModal();
                this.fetchNhaXuatBan();
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Đã xảy ra lỗi.";
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: message,
                    confirmButtonText: "OK",
                });
            } finally {
                this.isLoading = false;
            }
        },
        async deleteNhaXuatBan(id) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const result = await Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa nhà xuất bản này?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Hủy",
                });

                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:3000/nhaXuatBan/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Nhà xuất bản đã được xóa thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    this.fetchNhaXuatBan();
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Đã xảy ra lỗi.";
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: message,
                    confirmButtonText: "OK",
                });
            }
        },
        closeModal() {
            this.showModal = false;
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
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchNhaXuatBan();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchNhaXuatBan();
            }
        },
    },
};
</script>

<style scoped>
.manage-container {
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

.table {
    border-radius: 8px;
    overflow: hidden;
}

.table th,
.table td {
    vertical-align: middle;
}

.table-dark {
    background-color: #343a40;
    color: white;
}

.btn-primary {
    background-color: #007bff;
    border: none;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-warning {
    background-color: #ffc107;
    border: none;
}

.btn-warning:hover {
    background-color: #e0a800;
}

.btn-danger {
    background-color: #dc3545;
    border: none;
}

.btn-danger:hover {
    background-color: #c82333;
}

.btn-secondary {
    background-color: #6c757d;
    border: none;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    border-radius: 8px;
}

.spinner-border {
    width: 2rem;
    height: 2rem;
}
</style>