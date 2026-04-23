<template>
    <v-container class="fill-height d-flex justify-center align-start">
      <v-card class="pa-6" max-width="900" elevation="4" width="100%">
        <v-card-title class="text-h6 font-weight-bold">
          📄 저장된 문서 목록
        </v-card-title>
  
        <v-divider class="my-4" />
  
        <v-card-text>
          <v-alert v-if="!pdfList.length" type="info" class="mb-4">
            저장된 문서가 없습니다.
          </v-alert>
  
          <v-list v-else lines="two">
            <v-list-item
              v-for="item in pdfList"
              :key="item.id"
              @click="goToDetail(item.id)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.pdf_name }} · {{ formatDate(item.created_at) }}</v-list-item-subtitle>
              <template #append>
                <v-btn
                  icon="mdi-delete"
                  color="red"
                  variant="text"
                  @click.stop="deleteItem(item.id)"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'ListView',
    data() {
      return {
        pdfList: [],
      }
    },
    async mounted() {
      try {
        const res = await axios.get('http://localhost:8000/pdfs')
        this.pdfList = res.data
      } catch (err) {
        console.error('문서 목록 불러오기 실패:', err)
      }
    },
    methods: {
      goToDetail(id) {
        this.$router.push(`/view/${id}`)
      },
      formatDate(date) {
        return new Date(date).toLocaleString('ko-KR')
      },
      async deleteItem(id) {
        if (!confirm('정말 삭제하시겠습니까?')) return
        try {
          await axios.delete(`http://localhost:8000/pdfs/${id}`)
          this.pdfList = this.pdfList.filter(item => item.id !== id)
        } catch (err) {
          alert('삭제 실패')
          console.error('삭제 오류:', err)
        }
      },
    },
  }
  </script>
  
  <style scoped>
  .v-list-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
  }
  </style>