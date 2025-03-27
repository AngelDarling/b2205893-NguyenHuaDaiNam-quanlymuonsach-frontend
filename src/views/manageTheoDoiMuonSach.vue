<!-- views/ManageTheoDoiMuonSach.vue -->
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
            <h2 class="mb-4">Theo Dõi Mượn Sách</h2>
            <div class="mb-3 d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary" @click="showAddModal">Thêm bản ghi mượn sách</button>
                </div>
                <div>
                    <input type="text" v-model="searchQuery" class="form-control"
                        placeholder="Tìm kiếm theo mã độc giả..." @input="fetchMuonSach" />
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
            <div v-else-if="muonSachList.length === 0" class="text-center">
                <p>Không có bản ghi mượn sách nào để hiển thị.</p>
            </div>
            <div v-else>
                <table class="table table-bordered table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Mã Độc Giả</th>
                            <th>Mã Sách</th>
                            <th>Số quyển mượn</th> <!-- Thêm cột Số quyển mượn -->
                            <th>Ngày Mượn</th>
                            <th>Ngày Trả</th>
                            <th>Tình trạng</th> <!-- Thêm cột Tình trạng -->
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="muonSach in muonSachList" :key="muonSach._id">
                            <td>{{ muonSach.MaDocGia }}</td>
                            <td>{{ muonSach.MaSach }}</td>
                            <td>{{ muonSach.SoLuong }}</td> <!-- Hiển thị số lượng mượn -->
                            <td>{{ formatDate(muonSach.NgayMuon) }}</td>
                            <td>{{ formatDate(muonSach.NgayTra) }}</td>
                            <td>
                                <!-- Hiển thị tình trạng -->
                                {{ getTinhTrang(muonSach) }}
                            </td>
                            <td>
                                <button class="btn btn-warning btn-sm me-2" @click="editMuonSach(muonSach)">Sửa</button>
                                <button class="btn btn-danger btn-sm me-2"
                                    @click="deleteMuonSach(muonSach._id)">Xóa</button>
                                <button v-if="!muonSach.DaTra" class="btn btn-success btn-sm"
                                    @click="markAsReturned(muonSach._id)">
                                    Đã trả
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Phân trang -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <p>Hiển thị {{ muonSachList.length }} / {{ total }} bản ghi mượn sách</p>
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

            <!-- Modal thêm/sửa bản ghi mượn sách -->
            <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditMode ? "Sửa bản ghi mượn sách" : "Thêm bản ghi mượn sách"
                                }}</h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveMuonSach">
                                <div class="mb-3">
                                    <label for="maDocGia" class="form-label">Mã Độc Giả</label>
                                    <select id="maDocGia" v-model="currentMuonSach.MaDocGia" class="form-control"
                                        required>
                                        <option value="" disabled>Chọn mã độc giả</option>
                                        <option v-for="docGia in docGiaList" :key="docGia._id" :value="docGia.MaDocGia">
                                            {{ docGia.MaDocGia }} - {{ docGia.Ten }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="maSach" class="form-label">Mã Sách</label>
                                    <select id="maSach" v-model="currentMuonSach.MaSach" class="form-control" required>
                                        <option value="" disabled>Chọn mã sách</option>
                                        <option v-for="sach in sachList" :key="sach._id" :value="sach.MaSach">
                                            {{ sach.MaSach }} - {{ sach.TenSach }}
                                        </option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="soLuong" class="form-label">Số quyển mượn</label>
                                    <input id="soLuong" v-model.number="currentMuonSach.SoLuong" type="number"
                                        class="form-control" min="1" required />
                                </div>

                                <div class="mb-3">
                                    <label for="ngayMuon" class="form-label">Ngày Mượn</label>
                                    <input id="ngayMuon" v-model="currentMuonSach.NgayMuon" type="date"
                                        class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="ngayTra" class="form-label">Ngày Trả</label>
                                    <input id="ngayTra" v-model="currentMuonSach.NgayTra" type="date"
                                        class="form-control" required />
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
            muonSachList: [],
            sachList: [], // Danh sách sách để chọn
            docGiaList: [], // Danh sách độc giả để chọn
            loading: false,
            errorMessage: "",
            showModal: false,
            isEditMode: false,
            isLoading: false,
            currentMuonSach: {
                MaDocGia: "",
                MaSach: "",
                NgayMuon: "",
                NgayTra: "",
                SoLuong: 1, // Mặc định là 1
                DaTra: false, // Thêm DaTra
            },
            searchQuery: "", // Từ khóa tìm kiếm
            currentPage: 1, // Trang hiện tại
            limit: 10, // Số bản ghi mỗi trang
            total: 0, // Tổng số bản ghi
            totalPages: 1, // Tổng số trang
        };
    },
    mounted() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.$router.push("/dang-nhap");
            return;
        }
        this.fetchSachAndDocGia();
        this.fetchMuonSach();
    },
    methods: {
        async fetchSachAndDocGia() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const [sachRes, docGiaRes] = await Promise.all([
                    axios.get("http://localhost:3000/sach", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { limit: 1000 }, // Lấy tất cả sách (có thể tối ưu nếu cần)
                    }),
                    axios.get("http://localhost:3000/docGia", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { limit: 1000 }, // Lấy tất cả độc giả
                    }),
                ]);

                this.sachList = sachRes.data.sachs;
                this.docGiaList = docGiaRes.data.docGias;
            } catch (err) {
                this.handleError(err);
            }
        },
        async fetchMuonSach() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const response = await axios.get("http://localhost:3000/theoDoiMuonSach", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search: this.searchQuery,
                        page: this.currentPage,
                        limit: this.limit,
                    },
                });
                this.muonSachList = response.data.theoDoiMuonSachs || [];
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
            this.currentMuonSach = {
                MaDocGia: "",
                MaSach: "",
                NgayMuon: "",
                NgayTra: "",
                SoLuong: 1, // Mặc định là 1
                DaTra: false, // Đảm bảo DaTra mặc định là false
            };
            this.showModal = true;
        },
        editMuonSach(muonSach) {
            this.isEditMode = true;
            this.currentMuonSach = {
                 ...muonSach,
                NgayMuon: new Date(muonSach.NgayMuon).toISOString().split("T")[0],
                NgayTra: muonSach.NgayTra ? new Date(muonSach.NgayTra).toISOString().split("T")[0] : "",
                SoLuong: muonSach.SoLuong || 1, // Đảm bảo SoLuong có giá trị 
                DaTra: muonSach.DaTra || false, // Đảm bảo DaTra có giá trị
            };
            this.showModal = true;
        },
        async saveMuonSach() {
            try {
                this.isLoading = true;

                // Validate dữ liệu
                if (!this.currentMuonSach.MaDocGia) {
                    throw new Error("Mã độc giả không được để trống.");
                }
                if (!this.currentMuonSach.MaSach) {
                    throw new Error("Mã sách không được để trống.");
                }
                if (!this.currentMuonSach.NgayMuon) {
                    throw new Error("Ngày mượn không được để trống.");
                }
                if (!this.currentMuonSach.NgayTra) {
                    throw new Error("Ngày trả không được để trống."); // Thêm validation cho Ngày Trả
                }
                if (this.currentMuonSach.NgayTra && new Date(this.currentMuonSach.NgayTra) < new Date(this.currentMuonSach.NgayMuon)) {
                    throw new Error("Ngày trả không được nhỏ hơn ngày mượn.");
                }

                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                if (this.isEditMode) {
                    await axios.put(`http://localhost:3000/theoDoiMuonSach/${this.currentMuonSach._id}`, this.currentMuonSach, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Bản ghi mượn sách đã được cập nhật thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } else {
                    await axios.post("http://localhost:3000/theoDoiMuonSach", this.currentMuonSach, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Bản ghi mượn sách đã được thêm thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
                this.closeModal();
                this.fetchMuonSach();
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
        async deleteMuonSach(id) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const result = await Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa bản ghi mượn sách này?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Hủy",
                });

                if (result.isConfirmed) {
                    // Lấy bản ghi mượn sách trước khi xóa để kiểm tra DaTra
                    const muonSach = this.muonSachList.find((item) => item._id === id);
                    const isDaTra = muonSach ? muonSach.DaTra : false;
                    await axios.delete(`http://localhost:3000/theoDoiMuonSach/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: isDaTra
                            ? "Bản ghi mượn sách đã được xóa thành công. Số lượng sách không thay đổi vì sách đã được trả."
                            : "Bản ghi mượn sách đã được xóa thành công. Số lượng sách đã được tăng lên.",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    this.fetchMuonSach();
                    this.fetchSachAndDocGia(); // Cập nhật lại danh sách sách để phản ánh số lượng mới
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
                this.fetchMuonSach();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchMuonSach();
            }
        },
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("vi-VN");
        },
        getTinhTrang(muonSach) {
            // Chỉ hiển thị "Đã trả" nếu DaTra là true
            return muonSach.DaTra ? "Đã trả" : "Chưa trả";
        },
        async markAsReturned(id) {
            // console.log("ID gửi lên API:", id); // Kiểm tra ID
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const result = await Swal.fire({
                    title: "Bạn có chắc chắn muốn đánh dấu bản ghi này là đã trả?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đã trả",
                    cancelButtonText: "Hủy",
                });

                if (result.isConfirmed) {
                    await axios.put(
                        `http://localhost:3000/theoDoiMuonSach/mark-returned/${id}`,
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Bản ghi mượn sách đã được đánh dấu là đã trả.",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    this.fetchMuonSach();
                    this.fetchSachAndDocGia();
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