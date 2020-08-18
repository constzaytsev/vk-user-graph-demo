<template>
  <div>
    <div class="mb-10">
      <div class="mb-2 text-gray-600">Добавить пользователя, для которого будет строиться список друзей</div>
      <input
        v-model.number="userId"
        type="text"
        placeholder="ID пользователя VK"
        class="border rounded p-2 mr-2"
      />
      <button
        @click="addUser"
        class="border rounded py-2 px-4"
      >Добавить</button>
    </div>
    <div class="flex">
      <div class="mr-10">

        <div
          v-for="user in users"
          :key="user.id"
          class="w-64 mb-2"
        >
          <div
            @click="deleteUser(user.id)"
            class="text-xs text-gray-500 text-right cursor-pointer"
          >удалить</div>
          <div
            @click="selectUser(user.id)"
            :class="{'bg-blue-300': $store.state.checkedUsers.includes(user.id)}"
            class="p-2 rounded border shadow flex items-center cursor-pointer"
          >
            <div class="mr-2"><img
                :src="user.photo_50"
                class="rounded-full"
                alt=""
              ></div>
            <div class="text-sm">
              {{user.first_name}} {{user.last_name}}
              <br />
              <div v-if="user.bdate">{{user.bdate}}</div>
              <div
                v-if="user.sex"
                class="text-xs text-gray-600"
              >
                {{user.sex === 2 ? 'мужчина' : 'женщина'}}
              </div>
            </div>
          </div>
        </div>

        <button
          @click="build"
          v-if="users.length"
          class="border rounded py-2 px-4 mt-4"
        >Построить список друзей</button>

      </div>
      <div>
        <div v-if="friendsList.length" class="mb-4 text-gray-600">Список друзей выбранных пользователей</div>
        <div
          @click="$router.push({name: 'User', params: {id: user.id}})"
          v-for="user in friendsList"
          :key="user.id"
          :class="`bg-green-${100}`"
          class="text-xs py-1 px-2 rounded border shadow w-64 flex items-center cursor-pointer mb-1"
        >
          <div class="mr-2"><img
              :src="user.photo_50"
              width="30"
              class="rounded-full"
              alt=""
            ></div>
          <div>
            {{user.first_name}} {{user.last_name}}
            <br />
            <div v-if="user.bdate">{{user.bdate}}</div>
            {{user.sex === 2 ? 'мужчина' : 'женщина'}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  userId = null;

  get users () {
    return this.$store.state.users.sort((a, b) => {
      if (a.first_name < b.first_name) {
        return -1
      }
      if (a.first_name > b.first_name) {
        return 1
      }
      return 0
    })
  }

  get friendsList () {
    return this.$store.state.friendsList.sort((a, b) => {
      if (a.first_name < b.first_name) {
        return -1
      }
      if (a.first_name > b.first_name) {
        return 1
      }
      return 0
    })
  }

  addUser () {
    this.$store.dispatch('addUser', this.userId)
  }

  selectUser (id: number) {
    this.$store.commit('selectUser', id)
  }

  deleteUser (id: number) {
    this.$store.commit('deleteUser', id)
  }

  build () {
    this.$store.dispatch('buildFriendsList')
  }
}
</script>
