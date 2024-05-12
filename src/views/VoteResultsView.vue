<template>
  <div>
    <h1 v-if="error">Помилка 😓</h1>
    <div v-else-if="loading" style="display: flex; align-items: center; justify-content: center">
      <LoadingIcon />
    </div>
    <div v-else-if="voteAgencyResp">
      <h1>
        {{ voteAgencyResp?.title }}
      </h1>
      <p>{{ voteAgencyResp?.description }}</p>
    </div>
  </div>
  <div>
    <p v-if="error">{{ error }}</p>
    <div v-else-if="loading">Завантажуємо інформацію...</div>
    <div v-else-if="voteAgencyResp">
      <h2 style="margin-bottom: 24px; text-align: center">Результати</h2>
      <ul>
        <li v-for="(option, index) in voteAgencyResp?.options" :key="index">
          <span>{{ option }}</span>
          <label>{{ votes?.[index] ?? 0 }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { init_panic_hook, version } from '../passring/passring_wasm'

type VoteAgency = {
  id: string
  title: string
  description: string
  options: string[]
  active: boolean
}

init_panic_hook()
console.log('Passring version:', version())

const route = useRoute()

const voteId = route.params.vote_id.toString()

const loading = ref(true)
const voteAgencyResp = ref<VoteAgency | null>(null)
const votes = ref<string[] | null>(null)
const error = ref<string | null>(null)

fetch(`${import.meta.env.VITE_AGENCY_API}/voting/${voteId}`)
  .then((res) => res.json())
  .then((data) => {
    voteAgencyResp.value = data
    loading.value = false
  })
  .catch((err) => {
    console.warn(err)
    error.value = 'Помилка завантаження даних. Спробуй оновити сторінку'
  })

fetch(`${import.meta.env.VITE_AGENCY_API}/voting/${voteId}/count`)
  .then((res) => res.json())
  .then((data) => {
    votes.value = data
    loading.value = false
  })
  .catch((err) => {
    console.warn(err)
    error.value = 'Помилка завантаження даних. Спробуй оновити сторінку'
  })
</script>
<style scoped>
li span {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  text-align: center;
}

ul {
  width: 100%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  list-style-type: none;
  padding: 0;
}
li {
  width: 100%;
  display: flex;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}
li button {
  width: 100%;
  margin-bottom: 5px;
}
.submit-btn {
  width: 100%;
  margin-top: 24px;
}
</style>
