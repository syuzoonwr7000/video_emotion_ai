<template>
  <div class="video-upload">
    <h2>動画をアップロード</h2>
    <label for="videoInput" class="dropzone">
      <input type="file" id="videoInput" accept="video/*" @change="handleFileChange" hidden>
      <div v-if="!videoPreview">
        <p>ドラッグ＆ドロップ</p>
        <span class="file-label">ファイルを選択</span>
      </div>
      <video v-if="videoPreview" :src="videoPreview" controls class="video-preview"></video>
    </label>
    <button @click="uploadVideo" :disabled="!selectedFile">アップロード</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: null,
      videoPreview: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.videoPreview = URL.createObjectURL(file);
      }
    },
    async uploadVideo() {
      if (!this.selectedFile) return;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      try {
        const response = await fetch('http://localhost:8000/upload/', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        console.log('Upload successful:', result);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    },
  },
};
</script>

<style scoped>
.video-upload {
  text-align: center;
}
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 200px;
  border: 2px dashed #ccc;
  margin: 20px auto;
  cursor: pointer;
}
.video-preview {
  width: 100%;
  max-height: 200px;
}
</style>
