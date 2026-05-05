<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    
    <!-- Code 404 -->
    <h1 class="text-7xl font-extrabold text-primary mb-4">404</h1>

    <!-- Title -->
    <h2 class="text-2xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>

    <!-- Description -->
    <p class="text-muted-foreground mb-6 max-w-md">
      Sepertinya kamu nyasar ke halaman yang nggak ada. 
      Bisa jadi URL-nya salah, atau halamannya memang sudah menghilang seperti harapan mantan.
    </p>

    <!-- Actions -->
    <div class="flex gap-3">
      <RouterLink to="/">
        <button class="px-4 py-2 rounded-md bg-primary text-white hover:opacity-90">
          Kembali ke Beranda
        </button>
      </RouterLink>

      <button
        onclick="window.history.back()"
        class="px-4 py-2 rounded-md border hover:bg-muted"
      >
        Kembali
      </button>
    </div>

  </div>
</template>