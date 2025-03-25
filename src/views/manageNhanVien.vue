<template>
    <div class="manage-nhan-vien">
        <h2>Quản Lý Nhân Viên</h2>
        <button @click="showAddForm = true">Thêm Nhân Viên</button>
        <table>
            <thead>
                <tr>
                    <th>Họ Tên</th>
                    <th>Email</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="nhanVien in nhanVienList" :key="nhanVien._id">
                    <td>{{ nhanVien.hoTen }}</td>
                    <td>{{ nhanVien.email }}</td>
                    <td>
                        <button @click="editNhanVien(nhanVien)">Sửa</button>
                        <button @click="deleteNhanVien(nhanVien._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Form thêm/sửa nhân viên -->
        <div v-if="showAddForm || showEditForm">
            <h3>{{ showAddForm ? 'Thêm Nhân Viên' : 'Sửa Nhân Viên' }}</h3>
            <form @submit.prevent="showAddForm ? addNhanVien() : updateNhanVien()">
                <div>
                    <label>Họ Tên:</label>
                    <input v-model="currentNhanVien.hoTen" required />
                </div>
                <div>
                    <label>Email:</label>
                    <input v-model="currentNhanVien.email" type="email" required />
                </div>
                <button type="submit">{{ showAddForm ? 'Thêm' : 'Cập Nhật' }}</button>
                <button type="button" @click="cancelForm">Hủy</button>
            </form>
        </div>
    </div>
</template>

<script>
import NhanVienService from '../services/nhanVien.service';

export default {
    data() {
        return {
            nhanVienList: [],
            showAddForm: false,
            showEditForm: false,
            currentNhanVien: {
                hoTen: '',
                email: '',
            },
        };
    },
    async created() {
        await this.fetchNhanVien();
    },
    methods: {
        async fetchNhanVien() {
            try {
                const response = await NhanVienService.getAll();
                this.nhanVienList = response.data;
            } catch (err) {
                console.error('Lỗi khi lấy danh sách nhân viên:', err);
            }
        },
        async addNhanVien() {
            try {
                await NhanVienService.create(this.currentNhanVien);
                await this.fetchNhanVien();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi thêm nhân viên:', err);
            }
        },
        async updateNhanVien() {
            try {
                await NhanVienService.update(this.currentNhanVien._id, this.currentNhanVien);
                await this.fetchNhanVien();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi cập nhật nhân viên:', err);
            }
        },
        async deleteNhanVien(id) {
            if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
                try {
                    await NhanVienService.delete(id);
                    await this.fetchNhanVien();
                } catch (err) {
                    console.error('Lỗi khi xóa nhân viên:', err);
                }
            }
        },
        editNhanVien(nhanVien) {
            this.currentNhanVien = { ...nhanVien };
            this.showEditForm = true;
            this.showAddForm = false;
        },
        cancelForm() {
            this.showAddForm = false;
            this.showEditForm = false;
            this.currentNhanVien = { hoTen: '', email: '' };
        },
    },
};
</script>

<style>
.manage-nhan-vien {
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

form {
    margin-top: 20px;
    max-width: 400px;
}

form div {
    margin-bottom: 10px;
}
</style>