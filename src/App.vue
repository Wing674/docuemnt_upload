<script setup lang="ts">
import FileUploader from './components/FileUploader.vue'
import DocumentViewer from './components/DocumentViewer.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
        Document Viewer
      </h1>
      <FileUploader />
      <DocumentViewer />
    </div>
  </div>
</template>