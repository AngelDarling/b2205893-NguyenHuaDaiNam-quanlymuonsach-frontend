<template>
    <div class="card">
        <img src="https://via.placeholder.com/150" class="card-img-top" alt="Sách" />
        <div class="card-body">
            <h5 class="card-title">{{ sach.TenSach }}</h5>
            <p class="card-text">Giá: {{ sach.DonGia }} VNĐ</p>
            <p class="card-text">Tác giả: {{ sach.NguonGocTacGia }}</p>
            <button class="btn btn-primary" @click="muonSach">Mượn Sách</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['sach'],
    methods: {
        async muonSach() {
            try {
                // Giả sử bạn đã có thông tin độc giả (MaDocGia) từ một nguồn nào đó
                // Ở đây tôi sẽ hardcode MaDocGia để minh họa
                const borrowingData = {
                    MaDocGia: 'your_docgia_id', // Thay bằng ID của độc giả thực tế
                    MaSach: this.sach._id,
                    NgayMuon: new Date(),
                    NgayTra: null,
                };
                await this.$store.dispatch('muonSach', borrowingData);
                alert(`Mượn sách "${this.sach.TenSach}" thành công!`);
            } catch (err) {
                alert('Mượn sách thất bại');
            }
        },
    },
};
</script>

<style scoped>
.card {
    width: 18rem;
    margin: 1rem;
}
</style>