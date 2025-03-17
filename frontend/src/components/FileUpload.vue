<template>
  <div>
    <input type="file" @change="uploadFile" />
  </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {
  methods: {
    async uploadFile(event: Event) {
      const file = (event.target as HTMLInputElement).files![0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:8000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // ファイルアップロード後の処理
      } catch (error) {
        console.error('ファイルアップロードに失敗しました:', error);
      }
    },
  },
};
</script>
