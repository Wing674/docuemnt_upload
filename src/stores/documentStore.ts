import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import * as mammoth from 'mammoth'

export const useDocumentStore = defineStore('document', () => {
  const content = ref<string>('')
  const loading = ref(false)
  const error = ref(false)
  const fileName = ref('')
  const fileType = ref('')
  const pdfUrl = ref<string>('')
  const currentPage = ref(1)
  const totalPages = ref(1)
  const xlsxPages = ref<string[]>([])

  const ROWS_PER_PAGE = 42 // Approximate rows for A4 size

  const resetState = () => {
    content.value = ''
    error.value = ''
    loading.value = false
    fileName.value = ''
    fileType.value = ''
    pdfUrl.value = ''
    currentPage.value = 1
    totalPages.value = 1
    xlsxPages.value = []
  }

  const handlePDF = async (file: File) => {
    try {
      pdfUrl.value = URL.createObjectURL(file)
    } catch (err: any) {
      error.value = 'Error processing PDF file: ' + err.message
    }
  }

  const handleDOCX = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer }, {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh"
        ]
      })
      content.value = result.value
    } catch (err: any) {
      error.value = 'Error processing DOCX file: ' + err.message
    }
  }

  const handleXLSX = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      
      // Convert worksheet to array of arrays
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      // Split into pages
      const pages: string[] = []
      for (let i = 0; i < json.length; i += ROWS_PER_PAGE) {
        const pageRows = json.slice(i, i + ROWS_PER_PAGE)
        
        // Create a new worksheet for this page
        const pageWorksheet = XLSX.utils.aoa_to_sheet(pageRows)
        
        // Convert page to HTML
        const pageHtml = XLSX.utils.sheet_to_html(pageWorksheet)
        pages.push(pageHtml)
      }
      
      xlsxPages.value = pages
      totalPages.value = pages.length
      currentPage.value = 1
      
      // Set initial content to first page
      content.value = xlsxPages.value[0]
    } catch (err: any) {
      error.value = 'Error processing XLSX file: ' + err.message
    }
  }

  const processFile = async (file: File) => {
    resetState()
    loading.value = true
    fileName.value = file.name
    fileType.value = file.type

    try {
      if (file.type === 'application/pdf') {
        await handlePDF(file)
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        await handleDOCX(file)
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        await handleXLSX(file)
      } else {
        error.value = 'Unsupported file type'
      }
    } catch (err: any) {
      error.value = 'Error processing file: ' + err.message
    } finally {
      loading.value = false
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      if (fileType.value === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        content.value = xlsxPages.value[page - 1]
      }
    }
  }

  return {
    content,
    loading,
    error,
    fileName,
    fileType,
    pdfUrl,
    currentPage,
    totalPages,
    processFile,
    resetState,
    goToPage
  }
})