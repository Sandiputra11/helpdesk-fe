<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar />
    <div class="container mx-auto mt-8">
      <TicketTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import TicketTable from '../components/TicketTable.vue';
</script>

<style scoped>
</style>
