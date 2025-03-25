<template>
    <div>
        <Navbar />
        <div class="dashboard-container">
            <h2 class="dashboard-title">Bảng Điều Khiển Nhân Viên</h2>

            <!-- Phần quản lý sách -->
            <div class="section">
                <h3 class="section-title">Quản Lý Sách</h3>
                <button class="btn btn-primary mb-3" @click="showAddBookModal">Thêm Sách Mới</button>
                <div class="table-responsive">
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
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="book in sach" :key="book._id">
                                <td>{{ book.MaSach }}</td>
                                <td>{{ book.TenSach }}</td>
                                <td>{{ book.DonGia }}</td>
                                <td>{{ book.SoQuyen }}</td>
                                <td>{{ book.NamXuatBan }}</td>
                                <td>{{ book.MaNXB ? book.MaNXB.TenNXB : 'N/A' }}</td>
                                <td>{{ book.NguonGocTacGia }}</td>
                                <td>
                                    <button class="btn btn-sm btn-warning me-2" @click="editBook(book)">Sửa</button>
                                    <button class="btn btn-sm btn-danger" @click="deleteBook(book._id)">Xóa</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Phần duyệt yêu cầu mượn sách -->
            <div class="section mt-5">
                <h3 class="section-title">Duyệt Yêu Cầu Mượn Sách</h3>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Mã Độc Giả</th>
                                <th>Tên Độc Giả</th>
                                <th>Mã Sách</th>
                                <th>Tên Sách</th>
                                <th>Ngày Mượn</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="request in borrowingRequests" :key="request._id">
                                <td>{{ request.MaDocGia.MaDocGia }}</td>
                                <td>{{ request.MaDocGia.HoLot }} {{ request.MaDocGia.Ten }}</td>
                                <td>{{ request.MaSach.MaSach }}</td>
                                <td>{{ request.MaSach.TenSach }}</td>
                                <td>{{ new Date(request.NgayMuon).toLocaleDateString() }}</td>
                                <td>{{ request.NgayTra ? 'Đã Trả' : 'Đang Mượn' }}</td>
                                <td>
                                    <button v-if="!request.NgayTra" class="btn btn-sm btn-success me-2"
                                        @click="approveBorrowing(request._id)">
                                        Duyệt Trả Sách
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal thêm/sửa sách -->
            <div v-if="showModal" class="modal-overlay">
                <div class="modal-content">
                    <h4>{{ isEditing ? 'Sửa Sách' : 'Thêm Sách Mới' }}</h4>
                    <form @submit.prevent="saveBook">
                        <div class="mb-3">
                            <label for="maSach" class="form-label">Mã Sách</label>
                            <input id="maSach" v-model="newBook.MaSach" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="tenSach" class="form-label">Tên Sách</label>
                            <input id="tenSach" v-model="newBook.TenSach" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="donGia" class="form-label">Đơn Giá</label>
                            <input id="donGia" v-model="newBook.DonGia" type="number" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="soQuyen" class="form-label">Số Quyển</label>
                            <input id="soQuyen" v-model="newBook.SoQuyen" type="number" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="namXuatBan" class="form-label">Năm Xuất Bản</label>
                            <input id="namXuatBan" v-model="newBook.NamXuatBan" type="number" class="form-control"
                                required />
                        </div>
                        <div class="mb-3">
                            <label for="maNXB" class="form-label">Nhà Xuất Bản</label>
                            <select id="maNXB" v-model="newBook.MaNXB" class="form-control" required>
                                <option v-for="nxb in nhaXuatBan" :key="nxb._id" :value="nxb._id">
                                    {{ nxb.TenNXB }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="tacGia" class="form-label">Tác Giả</label>
                            <input id="tacGia" v-model="newBook.NguonGocTacGia" class="form-control" required />
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
                            <button type="submit" class="btn btn-primary">Lưu</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import axios from 'axios';

export default {
    components: {
        Navbar,
    },
    data() {
        return {
            sach: [],
            borrowingRequests: [],
            nhaXuatBan: [],
            showModal: false,
            isEditing: false,
            newBook: {
                MaSach: '',
                TenSach: '',
                DonGia: 0,
                SoQuyen: 0,
                NamXuatBan: 0,
                MaNXB: '',
                NguonGocTacGia: '',
            },
        };
    },
    methods: {
        async fetchBooks() {
            try {
                const res = await axios.get('http://localhost:5000/api/sach');
                this.sach = res.data;
            } catch (err) {
                console.error('Lỗi khi lấy danh sách sách:', err);
            }
        },
        async fetchBorrowingRequests() {
            try {
                const res = await axios.get('http://localhost:5000/api/theodoimuonsach');
                this.borrowingRequests = res.data;
            } catch (err) {
                console.error('Lỗi khi lấy danh sách yêu cầu mượn sách:', err);
            }
        },
        async fetchNhaXuatBan() {
            try {
                const res = await axios.get('http://localhost:5000/api/nhaxuatban');
                this.nhaXuatBan = res.data;
            } catch (err) {
                console.error('Lỗi khi lấy danh sách nhà xuất bản:', err);
            }
        },
        showAddBookModal() {
            this.isEditing = false;
            this.newBook = {
                MaSach: '',
                TenSach: '',
                DonGia: 0,
                SoQuyen: 0,
                NamXuatBan: 0,
                MaNXB: '',
                NguonGocTacGia: '',
            };
            this.showModal = true;
        },
        editBook(book) {
            this.isEditing = true;
            this.newBook = { ...book, MaNXB: book.MaNXB._id };
            this.showModal = true;
        },
        async saveBook() {
            try {
                if (this.isEditing) {
                    await axios.put(`http://localhost:5000/api/sach/${this.newBook._id}`, this.newBook);
                } else {
                    await axios.post('http://localhost:5000/api/sach', this.newBook);
                }
                this.fetchBooks();
                this.closeModal();
            } catch (err) {
                console.error('Lỗi khi lưu sách:', err);
            }
        },
        async deleteBook(id) {
            if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
                try {
                    await axios.delete(`http://localhost:5000/api/sach/${id}`);
                    this.fetchBooks();
                } catch (err) {
                    console.error('Lỗi khi xóa sách:', err);
                }
            }
        },
        async approveBorrowing(id) {
            try {
                await axios.put(`http://localhost:5000/api/theodoimuonsach/${id}`, {
                    NgayTra: new Date(),
                });
                this.fetchBorrowingRequests();
            } catch (err) {
                console.error('Lỗi khi duyệt trả sách:', err);
            }
        },
        closeModal() {
            this.showModal = false;
        },
    },
    mounted() {
        this.fetchBooks();
        this.fetchBorrowingRequests();
        this.fetchNhaXuatBan();
    },
};
</script>

<style scoped>
.dashboard-container {
    padding: 30px;
    background-color: #f8f9fa;
    min-height: 100vh;
}

.dashboard-title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
}

.section {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 20px;
}

.table {
    background-color: #fff;
}

.table-hover tbody tr:hover {
    background-color: #f1f1f1;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
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

.btn-success {
    background-color: #28a745;
    border: none;
}

.btn-success:hover {
    background-color: #218838;
}
</style>