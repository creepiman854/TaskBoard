import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useTaskStore = defineStore('task', () => {
  const tasksList = ref([])

  const getTask = async () => {
    try {
      const res = await axios.get('https://dummyjson.com/todos')

      // console.log(res.data.todos);
      tasksList.value = res.data.todos
    } catch (error) {
      console.log('AXIOS ERROR: ', error)
    }
  }

  return { tasksList, getTask }
})
