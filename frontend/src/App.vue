
<template>
  <section class="video-rec-container">
    <VideoCapture :uploadUrl="uploadUrl" v-model="videoUrl" />
    <div v-if="videoUrl" class="video-url-container">
      <a class="btn" :href="shareUrl">Share Your Video</a>
    </div>
  </section>
  <textarea v-model="text" @change="enhance()"></textarea>
</template>

<script>
import VideoCapture from './VideoCapture.vue';

export default {
  components: {
    VideoCapture
  },
  data() {
    return {
      text: null,
      videoUrl: null,
      uploadUrl: "localhost:3001/ws"
    };
  },
  methods: {
    enhance: async function () {
      const response = await fetch(`http://localhost:3001/detect?text=${this.text}`);
      const enhancements = await response.json();
      console.log(enhancements)
    }
  },
  computed: {
    shareUrl() {
      return `testse`
    }
  }
};
</script>