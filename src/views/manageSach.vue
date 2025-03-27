<!-- views/ManageSach.vue -->
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
            <h2 class="mb-4">Quản Lý Sách</h2>
            <div class="mb-3 d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary me-2" @click="showAddModal">Thêm sách</button>
                    <button class="btn btn-success me-2" @click="filterSach('HienHanh')"
                        :class="{ 'active': filterStatus === 'HienHanh' }">
                        Sách hiện hành
                    </button>
                    <button class="btn btn-warning" @click="filterSach('DaXoa')"
                        :class="{ 'active': filterStatus === 'DaXoa' }">
                        Sách đã xóa
                    </button>
                </div>
                <div>
                    <input type="text" v-model="searchQuery" class="form-control"
                        placeholder="Tìm kiếm sách theo tên..." @input="fetchSach" />
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
            <div v-else-if="sachList.length === 0" class="text-center">
                <p>Không có sách nào để hiển thị.</p>
            </div>
            <div v-else>
                <table class="table table-bordered table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Mã Sách</th>
                            <th>Tên Sách</th>
                            <th>Đơn Giá</th>
                            <th>Số Quyển</th>
                            <th>Năm Xuất Bản</th>
                            <th>Nhà Xuất Bản</th>
                            <th>Tác Giả</th>
                            <th>Trạng Thái</th> <!-- Thêm cột Trạng Thái -->
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="sach in sachList" :key="sach._id">
                            <td>{{ sach.MaSach }}</td>
                            <td>{{ sach.TenSach }}</td>
                            <td>{{ formatCurrency(sach.DonGia) }}</td>
                            <td>{{ sach.SoQuyen }}</td>
                            <td>{{ sach.NamXuatBan }}</td>
                            <td>{{ sach.nhaXuatBan ? sach.nhaXuatBan.TenNXB : "Không xác định" }}</td>
                            <td>{{ sach.TacGia }}</td>
                            <td>{{ sach.TrangThai === "HienHanh" ? "Hiện hành" : "Đã xóa" }}</td>
                            <td>
                                <button v-if="sach.TrangThai === 'HienHanh'" class="btn btn-warning btn-sm me-2"
                                    @click="editSach(sach)">Sửa</button>
                                <button v-if="sach.TrangThai === 'HienHanh'" class="btn btn-danger btn-sm"
                                    @click="softDeleteSach(sach._id)">Xóa</button>
                                <button v-if="sach.TrangThai === 'DaXoa'" class="btn btn-success btn-sm"
                                    @click="restoreSach(sach._id)">Khôi phục</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Phân trang -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <p>Hiển thị {{ sachList.length }} / {{ total }} sách</p>
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

            <!-- Modal thêm/sửa sách -->
            <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditMode ? "Sửa sách" : "Thêm sách" }}</h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveSach">
                                <div class="mb-3">
                                    <label for="maSach" class="form-label">Mã Sách</label>
                                    <input id="maSach" v-model="currentSach.MaSach" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="tenSach" class="form-label">Tên Sách</label>
                                    <input id="tenSach" v-model="currentSach.TenSach" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="donGia" class="form-label">Đơn Giá</label>
                                    <input id="donGia" v-model="currentSach.DonGia" type="number" class="form-control"
                                        required />
                                </div>
                                <div class="mb-3">
                                    <label for="soQuyen" class="form-label">Số Quyển</label>
                                    <input id="soQuyen" v-model="currentSach.SoQuyen" type="number" class="form-control"
                                        required />
                                </div>
                                <div class="mb-3">
                                    <label for="namXuatBan" class="form-label">Năm Xuất Bản</label>
                                    <input id="namXuatBan" v-model="currentSach.NamXuatBan" type="number"
                                        class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="maNXB" class="form-label">Nhà Xuất Bản</label>
                                    <select id="maNXB" v-model="currentSach.MaNXB" class="form-control" required>
                                        <option value="" disabled>Chọn nhà xuất bản</option>
                                        <option v-for="nhaXuatBan in nhaXuatBanList" :key="nhaXuatBan._id"
                                            :value="nhaXuatBan.MaNXB">
                                            {{ nhaXuatBan.TenNXB }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="tacGia" class="form-label">Tác Giả</label>
                                    <input id="tacGia" v-model="currentSach.TacGia" class="form-control" required />
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
            sachList: [],
            nhaXuatBanList: [],
            loading: false,
            errorMessage: "",
            showModal: false,
            isEditMode: false,
            isLoading: false,
            currentSach: {
                MaSach: "",
                TenSach: "",
                DonGia: 0,
                SoQuyen: 0,
                NamXuatBan: 0,
                MaNXB: "",
                TacGia: "",
                TrangThai: "HienHanh", // Thêm trạng thái mặc định
            },
            searchQuery: "",
            currentPage: 1,
            limit: 6,
            total: 0,
            totalPages: 1,
            filterStatus: "HienHanh", // Trạng thái lọc mặc định là HienHanh
        };
    },
    mounted() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.$router.push("/dang-nhap");
            return;
        }
        this.fetchNhaXuatBan();
        this.fetchSach();
    },
    methods: {
        async fetchNhaXuatBan() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const response = await axios.get("http://localhost:3000/nhaXuatBan", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 1000 },
                });
                this.nhaXuatBanList = response.data.nhaXuatBans;
            } catch (err) {
                this.handleError(err);
            }
        },
        async fetchSach() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const response = await axios.get("http://localhost:3000/sach", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search: this.searchQuery,
                        page: this.currentPage,
                        limit: this.limit,
                        trangThai: this.filterStatus, // Thêm tham số lọc trạng thái
                    },
                });
                this.sachList = response.data.sachs;
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
        filterSach(status) {
            this.filterStatus = status;
            this.currentPage = 1; // Reset về trang đầu khi thay đổi bộ lọc
            this.fetchSach();
        },
        showAddModal() {
            this.isEditMode = false;
            this.currentSach = {
                MaSach: "",
                TenSach: "",
                DonGia: 0,
                SoQuyen: 0,
                NamXuatBan: 0,
                MaNXB: "",
                TacGia: "",
                TrangThai: "HienHanh", // Trạng thái mặc định khi thêm mới
            };
            this.showModal = true;
        },
        editSach(sach) {
            this.isEditMode = true;
            this.currentSach = { ...sach };
            this.showModal = true;
        },
        async saveSach() {
            try {
                this.isLoading = true;

                // Validate dữ liệu
                if (!this.currentSach.MaSach) {
                    throw new Error("Mã sách không được để trống.");
                }
                if (!this.currentSach.TenSach) {
                    throw new Error("Tên sách không được để trống.");
                }
                if (this.currentSach.DonGia <= 0) {
                    throw new Error("Đơn giá phải lớn hơn 0.");
                }
                if (this.currentSach.SoQuyen <= 0) {
                    throw new Error("Số quyển phải lớn hơn 0.");
                }
                const namHienTai = new Date().getFullYear();
                if (this.currentSach.NamXuatBan <= 0) {
                    throw new Error("Năm xuất bản phải lớn hơn 0.");
                } else if (this.currentSach.NamXuatBan > namHienTai) {
                    throw new Error("Năm xuất bản không thể lớn hơn năm hiện tại.");
                }
                if (!this.currentSach.MaNXB) {
                    throw new Error("Nhà xuất bản không được để trống.");
                }
                if (!this.currentSach.TacGia) {
                    throw new Error("Tác giả không được để trống.");
                }

                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                if (this.isEditMode) {
                    await axios.put(`http://localhost:3000/sach/${this.currentSach._id}`, this.currentSach, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Sách đã được cập nhật thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } else {
                    await axios.post("http://localhost:3000/sach", this.currentSach, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Sách đã được thêm thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
                this.closeModal();
                this.fetchSach();
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
        async softDeleteSach(id) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const result = await Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa sách này?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Hủy",
                });

                if (result.isConfirmed) {
                    await axios.put(`http://localhost:3000/sach/soft-delete/${id}`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Sách đã được chuyển sang trạng thái đã xóa.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    this.fetchSach();
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
        async restoreSach(id) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const result = await Swal.fire({
                    title: "Bạn có chắc chắn muốn khôi phục sách này?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Khôi phục",
                    cancelButtonText: "Hủy",
                });

                if (result.isConfirmed) {
                    await axios.put(`http://localhost:3000/sach/restore/${id}`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Sách đã được khôi phục thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    this.fetchSach();
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
                this.fetchSach();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchSach();
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(value);
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

.btn-success {
    background-color: #28a745;
    border: none;
}

.btn-success:hover {
    background-color: #218838;
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

.btn.active {
    font-weight: bold;
    border: 2px solid #fff;
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