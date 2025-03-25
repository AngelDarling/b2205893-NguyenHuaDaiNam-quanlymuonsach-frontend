<template>
    <div class="manage-theo-doi-muon-sach">
        <h2>Theo Dõi Mượn Sách</h2>
        <button @click="showAddForm = true">Thêm Phiếu Mượn</button>
        <table>
            <thead>
                <tr>
                    <th>Độc Giả</th>
                    <th>Sách</th>
                    <th>Ngày Mượn</th>
                    <th>Ngày Trả</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="muonSach in muonSachList" :key="muonSach._id">
                    <td>{{ muonSach.docGiaId.hoTen }}</td>
                    <td>{{ muonSach.sachId.tenSach }}</td>
                    <td>{{ muonSach.ngayMuon }}</td>
                    <td>{{ muonSach.ngayTra || 'Chưa trả' }}</td>
                    <td>
                        <button @click="editMuonSach(muonSach)">Sửa</button>
                        <button @click="deleteMuonSach(muonSach._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Form thêm/sửa phiếu mượn -->
        <div v-if="showAddForm || showEditForm">
            <h3>{{ showAddForm ? 'Thêm Phiếu Mượn' : 'Sửa Phiếu Mượn' }}</h3>
            <form @submit.prevent="showAddForm ? addMuonSach() : updateMuonSach()">
                <div>
                    <label>Độc Giả (ID):</label>
                    <input v-model="currentMuonSach.docGiaId" required />
                </div>
                <div>
                    <label>Sách (ID):</label>
                    <input v-model="currentMuonSach.sachId" required />
                </div>
                <div>
                    <label>Ngày Mượn:</label>
                    <input v-model="currentMuonSach.ngayMuon" type="date" required />
                </div>
                <div>
                    <label>Ngày Trả:</label>
                    <input v-model="currentMuonSach.ngayTra" type="date" />
                </div>
                <button type="submit">{{ showAddForm ? 'Thêm' : 'Cập Nhật' }}</button>
                <button type="button" @click="cancelForm">Hủy</button>
            </form>
        </div>
    </div>
</template>

<script>
import TheoDoiMuonSachService from '../services/theoDoiMuonSach.service';

export default {
    data() {
        return {
            muonSachList: [],
            showAddForm: false,
            showEditForm: false,
            currentMuonSach: {
                docGiaId: '',
                sachId: '',
                ngayMuon: '',
                ngayTra: '',
            },
        };
    },
    async created() {
        await this.fetchMuonSach();
    },
    methods: {
        async fetchMuonSach() {
            try {
                const response = await TheoDoiMuonSachService.getAll();
                this.muonSachList = response.data;
            } catch (err) {
                console.error('Lỗi khi lấy danh sách mượn sách:', err);
            }
        },
        async addMuonSach() {
            try {
                await TheoDoiMuonSachService.create(this.currentMuonSach);
                await this.fetchMuonSach();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi thêm phiếu mượn:', err);
            }
        },
        async updateMuonSach() {
            try {
                await TheoDoiMuonSachService.update(this.currentMuonSach._id, this.currentMuonSach);
                await this.fetchMuonSach();
                this.cancelForm();
            } catch (err) {
                console.error('Lỗi khi cập nhật phiếu mượn:', err);
            }
        },
        async deleteMuonSach(id) {
            if (confirm('Bạn có chắc muốn xóa phiếu mượn này?')) {
                try {
                    await TheoDoiMuonSachService.delete(id);
                    await this.fetchMuonSach();
                } catch (err) {
                    console.error('Lỗi khi xóa phiếu mượn:', err);
                }
            }
        },
        editMuonSach(muonSach) {
            this.currentMuonSach = { ...muonSach, docGiaId: muonSach.docGiaId._id, sachId: muonSach.sachId._id };
            this.showEditForm = true;
            this.showAddForm = false;
        },
        cancelForm() {
            this.showAddForm = false;
            this.showEditForm = false;
            this.currentMuonSach = { docGiaId: '', sachId: '', ngayMuon: '', ngayTra: '' };
        },
    },
};
</script>

<style>
.manage-theo-doi-muon-sach {
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