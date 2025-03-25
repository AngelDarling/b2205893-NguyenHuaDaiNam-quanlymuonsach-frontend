<template>
    <div>
        <Navbar />
        <div class="container mt-4">
            <h2>Danh Sách Sách</h2>
            <div class="row">
                <div v-for="sach in sach" :key="sach._id" class="col-md-3">
                    <SachCard :sach="sach" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import SachCard from '../components/SachCard.vue';

export default {
    components: { Navbar, SachCard },
    computed: {
        sach() {
            return this.$store.state.sach;
        },
    },
    mounted() {
        this.$store.dispatch('layTatCaSach');
    },
};
</script>