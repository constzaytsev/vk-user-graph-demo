<template>
  <div class="container mx-auto">

    <div class="text-center mb-10">
      <img
        :src="user.photo_200"
        class="rounded-full mx-auto mb-4"
        alt=""
      >
      <div class="text-2xl">{{user.first_name}} {{user.last_name}}</div>

      {{user.bdate}}

      <div v-if="user.sex" class="text-xs text-gray-600">
        {{user.sex === 2 ? 'мужчина' : 'женщина'}}
      </div>
    </div>

    <div class="text-center mx-auto text-red-900 text-xl">
      {{ error }}
    </div>

    <div
      v-for="post in posts"
      :key="post.id"
      class="w-1/2 mx-auto"
    >
      <post :post="post">
        <post
          v-if="post.copy_history"
          :post="post.copy_history[0]"
        >
        </post>
      </post>
    </div>
  </div>
</template>

<script lang="ts">
import api from '../plugins/api'
import { Component, Vue } from 'vue-property-decorator'
import Post from '@/components/Post.vue'

@Component({
  components: {
    Post
  },
  filters: {
    toDate (value: number) {
      const n = value * 1000
      return new Date(n).toLocaleDateString('ru-RU')
    }
  }
})
export default class User extends Vue {
  posts = [];
  user = {};
  error = '';
  async mounted () {
    const { data: postsData } = await api.get('/wall.get', {
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        owner_id: this.$route.params.id
      }
    })
    if (postsData.error) {
      this.error = 'Пользователь закрыл стену для гостевого просмотра'
    } else {
      this.posts = postsData.response.items
    }

    const { data: userData } = await api.get('/users.get', {
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        user_id: this.$route.params.id,
        fields: 'first_name,last_name,photo_200,sex,bdate'
      }
    })
    this.user = userData.response[0]
  }
}
</script>
