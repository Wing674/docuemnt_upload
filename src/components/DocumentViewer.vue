<script setup lang="ts">
import { useDocumentStore } from '../stores/documentStore'
import { computed } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

const documentStore = useDocumentStore()

const fileTypeIcon = computed(() => {
  switch (documentStore.fileType) {
    case 'application/pdf':
      return '📄'
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return '📝'
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return '📊'
    default:
      return '📎'
  }
})

const showPagination = computed(() => {
  return documentStore.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
         documentStore.totalPages > 1
})
</script>

<template>
  <div v-if="documentStore.fileName" class="w-full mt-8">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="p-4 bg-gray-50 border-b flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">{{ fileTypeIcon }}</span>
          <span class="font-medium text-gray-700">{{ documentStore.fileName }}</span>
        </div>
        <button
          @click="documentStore.resetState"
          class="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div class="p-6">
        <div v-if="documentStore.loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="documentStore.error" class="text-red-500 text-center py-8">
          {{ documentStore.error }}
        </div>
        
        <div v-else>
          <!-- PDF Viewer -->
          <div v-if="documentStore.fileType === 'application/pdf'" class="w-full">
            <VuePdfEmbed
              :source="documentStore.pdfUrl"
              :width="800"
              class="mx-auto"
            />
          </div>
          
          <!-- Other document types -->
          <div v-else>
            <div
              class="prose max-w-none"
              v-html="documentStore.content"
            ></div>
            
            <!-- Pagination controls -->
            <div v-if="showPagination" class="mt-6 flex justify-center items-center space-x-4">
              <button
                @click="documentStore.goToPage(documentStore.currentPage - 1)"
                :disabled="documentStore.currentPage === 1"
                class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-600">
                Page {{ documentStore.currentPage }} of {{ documentStore.totalPages }}
              </span>
              <button
                @click="documentStore.goToPage(documentStore.currentPage + 1)"
                :disabled="documentStore.currentPage === documentStore.totalPages"
                class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>