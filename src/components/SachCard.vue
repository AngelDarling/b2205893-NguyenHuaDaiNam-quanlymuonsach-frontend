<template>
    <div class="sach-card">
        <h3>{{ sach.tenSach }}</h3>
        <p>Tác Giả: {{ sach.tacGia }}</p>
        <p>Thể Loại: {{ sach.theLoai }}</p>
    </div>
</template>

<script>
export default {
    props: {
        sach: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style>
.sach-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}
</style>