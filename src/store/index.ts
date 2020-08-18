import Vue from 'vue'
import Vuex from 'vuex'
import api from '../plugins/api'

Vue.use(Vuex)

interface T {
  users: object[];
  checkedUsers: number[];
  friendsList: object[];
}

const state: T = {
  users: [],
  checkedUsers: [],
  friendsList: []
}

export default new Vuex.Store({
  state,
  mutations: {
    addUser (state, user) {
      state.users = [...state.users, ...user]
    },
    deleteUser (state, id) {
      const findUser = state.users.findIndex(u => u.id === id)
      if (findUser > -1) {
        state.users.splice(findUser, 1)
        state.checkedUsers.splice(state.checkedUsers.indexOf(id), 1)
      }
    },
    modifyFriendsList (state, friends) {
      state.friendsList = friends
    },
    selectUser (state, id) {
      if (state.checkedUsers.includes(id)) {
        state.checkedUsers.splice(state.checkedUsers.indexOf(id), 1)
      } else {
        state.checkedUsers.push(id)
      }
    }
  },
  actions: {
    async addUser ({ commit, state }, userId) {
      if (!state.users.some(el => el.id === userId)) {
        const { data } = await api.get('/users.get', {
          params: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            user_ids: userId,
            fields: 'first_name,last_name,photo_50,sex,bdate'
          }
        })
        commit('addUser', data.response)
      }
    },

    async buildFriendsList ({ commit, state }) {
      const t: object[] = await state.checkedUsers.reduce(
        async (acc, currentValue) => {
          const accumulator = await acc
          try {
            const { data } = await api.get('/friends.get', {
              params: {
                // eslint-disable-next-line @typescript-eslint/camelcase
                user_id: currentValue,
                fields: 'first_name,last_name,photo_50,sex,bdate'
              }
            })
            return Promise.resolve([...accumulator, ...data.response.items])
          } catch {
            return Promise.resolve([...accumulator])
          }
        },
        Promise.resolve([])
      )

      const dedupUsers = t.reduce((acc, v) => {
        const fi = acc.findIndex(e => e.id === v.id)
        if (fi > -1) {
          acc[fi].count++
        } else {
          const newElement = {
            ...v,
            count: 1
          }
          acc.push(newElement)
        }
        return acc
      }, [])

      commit('modifyFriendsList', dedupUsers)
    }
  }

})
