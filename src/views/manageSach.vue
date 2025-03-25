<template>
    <div class="manage-sach">
        <h2>Quản Lý Sách</h2>
        <button @click="showAddForm = true">Thêm Sách</button>
        <table>
            <thead>
                <tr>
                    <th>Tên Sách</th>
                    <th>Tác Giả</th>
                    <th>Thể Loại</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="sach in sachList" :key="sach._id">
                    <td>{{ sach.tenSach }}</td>
                    <td>{{ sach.tacGia }}</td>
                    <td>{{ sach.theLoai }}</td>
                    <td>
                        <button @click="editSach(sach)">Sửa</button>
                        <button @click="deleteSach(sach._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Form thêm/sửa sách -->
        <div v-if="showAddForm || showEditForm">
            <h3>{{ showAddForm ? 'Thêm Sách' : 'Sửa Sách' }}</h3>
            <form @submit.prevent="showAddForm ? addSach() : updateSach()">
                <div>
                    <label>Tên Sách:</label>
                    <input v-model="currentSach.tenSach" required />
                </div>
                <div>
                    <label>Tác Giả:</label>
                    <input v-model="currentSach.tacGia" required />
                </div>
                <div>
                    <label>Thể Loại:</label>
                    <input v-model="currentSach.theLoai" required />
                </div>
                <button type="submit">{{ showAddForm ? 'Thêm' : 'Cập Nhật' }}</button>
                <button type="button" @click="cancelForm">Hủy</button>
            </form>
        </div>
    </div>
</template>

<script>
import SachService from '../services/sach.service';

export default {
    data() {
        return {
            sachList: [],
            showAddForm: false,
            showEditForm: false,
            currentSach: {
                tenSach: '',
                tacGia: '',
                theLoai: '',
            },
        };
    },
    async created() {
        await this.fetchSach();
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
        async addSach() {
            try {
                await SachService.create(this.currentSach);
                await this.fetchSach();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi thêm sách:', err);
            }
        },
        async updateSach() {
            try {
                await SachService.update(this.currentSach._id, this.currentSach);
                await this.fetchSach();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi cập nhật sách:', err);
            }
        },
        async deleteSach(id) {
            if (confirm('Bạn có chắc muốn xóa sách này?')) {
                try {
                    await SachService.delete(id);
                    await this.fetchSach();
                } catch (err) {
                    console.error('Lỗi khi xóa sách:', err);
                }
            }
        },
        editSach(sach) {
            this.currentSach = { ...sach };
            this.showEditForm = true;
            this.showAddForm = false;
        },
        cancelForm() {
            this.showAddForm = false;
            this.showEditForm = false;
            this.currentSach = { tenSach: '', tacGia: '', theLoai: '' };
        },
    },
};
</script>

<style>
.manage-sach {
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