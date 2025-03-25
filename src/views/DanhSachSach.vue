<template>
    <div class="book-list">
        <h2>Danh Sách Sách</h2>
        <table>
            <thead>
                <tr>
                    <th>Tên Sách</th>
                    <th>Tác Giả</th>
                    <th>Thể Loại</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="sach in sachList" :key="sach._id">
                    <td>{{ sach.tenSach }}</td>
                    <td>{{ sach.tacGia }}</td>
                    <td>{{ sach.theLoai }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import SachService from '../services/sach.service';

export default {
    data() {
        return {
            sachList: [],
        };
    },
    async created() {
        try {
            const response = await SachService.getAll();
            this.sachList = response.data;
        } catch (err) {
            console.error('Lỗi khi lấy danh sách sách:', err);
        }
    },
};
</script>

<style>
.book-list {
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
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
</style>