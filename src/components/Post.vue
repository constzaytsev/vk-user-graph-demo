<template>
  <div class="border rounded mb-4 shadow p-6">
    <div class="text-xs text-gray-600 mb-2">{{ post.date | toDate }}</div>
    <div v-if="post.attachments">
      <img
          :src="attachmentUrl"
          alt=""
          class="mb-4"
        >
    </div>
    <div
      v-if="post.text"
      class="text-sm mb-2"
    >{{ post.text }}</div>

    <slot></slot>

    <div
      class="text-xs"
      v-if="post.likes"
    >👍 &nbsp; {{ post.likes.count }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  filters: {
    toDate (value: number) {
      const n = value * 1000
      return new Date(n).toLocaleDateString('ru-RU')
    }
  }
})
export default class Post extends Vue {
  @Prop() post!: object;

  get attachmentUrl () {
    if (this.post.attachments[0].photo) {
      return this.post.attachments[0].photo.sizes[4].url
    }

    if (this.post.attachments[0].video) {
      return this.post.attachments[0].video.photo_320
    }
  }
}
</script>
