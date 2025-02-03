<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '../stores/documentStore'

const documentStore = useDocumentStore()
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    await documentStore.processFile(input.files[0])
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    await documentStore.processFile(files[0])
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div
    class="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click="triggerFileInput"
  >
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept=".pdf,.docx,.xlsx"
      @change="handleFileChange"
    />
    <div class="text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4h4"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        Drop your file here or click to upload
      </h3>
      <p class="mt-1 text-xs text-gray-500">
        PDF, DOCX, or XLSX (max. 10MB)
      </p>
    </div>
  </div>
</template>