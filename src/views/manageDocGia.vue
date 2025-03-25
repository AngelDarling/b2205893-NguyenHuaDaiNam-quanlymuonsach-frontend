<template>
    <div class="manage-doc-gia">
        <h2>Quản Lý Độc Giả</h2>
        <button @click="showAddForm = true">Thêm Độc Giả</button>
        <table>
            <thead>
                <tr>
                    <th>Họ Tên</th>
                    <th>Email</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="docGia in docGiaList" :key="docGia._id">
                    <td>{{ docGia.hoTen }}</td>
                    <td>{{ docGia.email }}</td>
                    <td>
                        <button @click="editDocGia(docGia)">Sửa</button>
                        <button @click="deleteDocGia(docGia._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Form thêm/sửa độc giả -->
        <div v-if="showAddForm || showEditForm">
            <h3>{{ showAddForm ? 'Thêm Độc Giả' : 'Sửa Độc Giả' }}</h3>
            <form @submit.prevent="showAddForm ? addDocGia() : updateDocGia()">
                <div>
                    <label>Họ Tên:</label>
                    <input v-model="currentDocGia.hoTen" required />
                </div>
                <div>
                    <label>Email:</label>
                    <input v-model="currentDocGia.email" type="email" required />
                </div>
                <button type="submit">{{ showAddForm ? 'Thêm' : 'Cập Nhật' }}</button>
                <button type="button" @click="cancelForm">Hủy</button>
            </form>
        </div>
    </div>
</template>

<script>
import DocGiaService from '../services/docGia.service';

export default {
    data() {
        return {
            docGiaList: [],
            showAddForm: false,
            showEditForm: false,
            currentDocGia: {
                hoTen: '',
                email: '',
            },
        };
    },
    async created() {
        await this.fetchDocGia();
    },
    methods: {
        async fetchDocGia() {
            try {
                const response = await DocGiaService.getAll();
                this.docGiaList = response.data;
            } catch (err) {
                console.error('Lỗi khi lấy danh sách độc giả:', err);
            }
        },
        async addDocGia() {
            try {
                await DocGiaService.create(this.currentDocGia);
                await this.fetchDocGia();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi thêm độc giả:', err);
            }
        },
        async updateDocGia() {
            try {
                await DocGiaService.update(this.currentDocGia._id, this.currentDocGia);
                await this.fetchDocGia();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi cập nhật độc giả:', err);
            }
        },
        async deleteDocGia(id) {
            if (confirm('Bạn có chắc muốn xóa độc giả này?')) {
                try {
                    await DocGiaService.delete(id);
                    await this.fetchDocGia();
                } catch (err) {
                    console.error('Lỗi khi xóa độc giả:', err);
                }
            }
        },
        editDocGia(docGia) {
            this.currentDocGia = { ...docGia };
            this.showEditForm = true;
            this.showAddForm = false;
        },
        cancelForm() {
            this.showAddForm = false;
            this.showEditForm = false;
            this.currentDocGia = { hoTen: '', email: '' };
        },
    },
};
</script>

<style>
.manage-doc-gia {
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