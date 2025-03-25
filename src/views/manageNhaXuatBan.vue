<template>
    <div class="manage-nhap-xuat-ban">
        <h2>Quản Lý Nhập Xuất Bản</h2>
        <button @click="showAddForm = true">Thêm Nhập/Xuất</button>
        <table>
            <thead>
                <tr>
                    <th>Sách</th>
                    <th>Loại</th>
                    <th>Số Lượng</th>
                    <th>Ngày</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="nhaXuat in nhaXuatList" :key="nhaXuat._id">
                    <td>{{ nhaXuat.sachId.tenSach }}</td>
                    <td>{{ nhaXuat.loai }}</td>
                    <td>{{ nhaXuat.soLuong }}</td>
                    <td>{{ nhaXuat.ngay }}</td>
                    <td>
                        <button @click="editnhaXuat(nhaXuat)">Sửa</button>
                        <button @click="deletenhaXuat(nhaXuat._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Form thêm/sửa nhập xuất -->
        <div v-if="showAddForm || showEditForm">
            <h3>{{ showAddForm ? 'Thêm Nhập/Xuất' : 'Sửa Nhập/Xuất' }}</h3>
            <form @submit.prevent="showAddForm ? addnhaXuat() : updatenhaXuat()">
                <div>
                    <label>Sách (ID):</label>
                    <input v-model="currentnhaXuat.sachId" required />
                </div>
                <div>
                    <label>Loại (Nhập/Xuất):</label>
                    <select v-model="currentnhaXuat.loai" required>
                        <option value="Nhập">Nhập</option>
                        <option value="Xuất">Xuất</option>
                    </select>
                </div>
                <div>
                    <label>Số Lượng:</label>
                    <input v-model="currentnhaXuat.soLuong" type="number" required />
                </div>
                <div>
                    <label>Ngày:</label>
                    <input v-model="currentnhaXuat.ngay" type="date" required />
                </div>
                <button type="submit">{{ showAddForm ? 'Thêm' : 'Cập Nhật' }}</button>
                <button type="button" @click="cancelForm">Hủy</button>
            </form>
        </div>
    </div>
</template>

<script>
import nhaXuatBanService from '../services/nhaXuatBan.service';

export default {
    data() {
        return {
            nhaXuatList: [],
            showAddForm: false,
            showEditForm: false,
            currentnhaXuat: {
                sachId: '',
                loai: 'Nhập',
                soLuong: 0,
                ngay: '',
            },
        };
    },
    async created() {
        await this.fetchnhaXuat();
    },
    methods: {
        async fetchnhaXuat() {
            try {
                const response = await nhaXuatBanService.getAll();
                this.nhaXuatList = response.data;
            } catch (err) {
                console.error('Lỗi khi lấy danh sách nhập xuất:', err);
            }
        },
        async addnhaXuat() {
            try {
                await nhaXuatBanService.create(this.currentnhaXuat);
                await this.fetchnhaXuat();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi thêm nhập/xuất:', err);
            }
        },
        async updatenhaXuat() {
            try {
                await nhaXuatBanService.update(this.currentnhaXuat._id, this.currentnhaXuat);
                await this.fetchnhaXuat();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi cập nhật nhập/xuất:', err);
            }
        },
        async deletenhaXuat(id) {
            if (confirm('Bạn có chắc muốn xóa bản ghi này?')) {
                try {
                    await nhaXuatBanService.delete(id);
                    await this.fetchnhaXuat();
                } catch (err) {
                    console.error('Lỗi khi xóa nhập/xuất:', err);
                }
            }
        },
        editnhaXuat(nhaXuat) {
            this.currentnhaXuat = { ...nhaXuat, sachId: nhaXuat.sachId._id };
            this.showEditForm = true;
            this.showAddForm = false;
        },
        cancelForm() {
            this.showAddForm = false;
            this.showEditForm = false;
            this.currentnhaXuat = { sachId: '', loai: 'Nhập', soLuong: 0, ngay: '' };
        },
    },
};
</script>

<style>
.manage-nhap-xuat-ban {
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