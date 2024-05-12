<template>
  <div>
    <h1 v-if="error">Помилка 😓</h1>
    <h2 v-else-if="success">🫡</h2>
    <h2 v-else-if="!voteAgencyResp?.active">😉</h2>
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
    <h2 v-else-if="success">Дякуємо, ваш голос враховано!</h2>
    <div v-else-if="loading">Завантажуємо інформацію...</div>
    <h2 v-else-if="!voteAgencyResp?.active">Голосування ще не почалося або вже закінчилося</h2>
    <div v-else-if="voteAgencyResp">
      <ul>
        <li v-for="(option, index) in voteAgencyResp?.options" :key="index">
          <button @click="voteSelected = index === voteSelected ? null : index">
            <svg
              v-if="index === voteSelected"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{{ option }}</span>
          </button>
        </li>
      </ul>
      <button :disabled="voteSelected === null" class="submit-btn" @click="submitVote">
        <span>Надіслати вибір</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  PublicKey,
  PrivateKey,
  init_panic_hook,
  version,
  Passring,
  strip_full_signature
} from '../passring/passring_wasm'

type VoteReg = {
  keys: string[]
}
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
const router = useRouter()

const voteId = route.params.vote_id.toString()
const privateKeyString = route.hash.slice(1)

const loading = ref(true)
const success = ref(false)
const voteRegResp = ref<VoteReg | null>(null)
const voteAgencyResp = ref<VoteAgency | null>(null)
const error = ref<string | null>(null)
const voteSelected = ref<number | null>(null)

let privateKey: PrivateKey | null = null
if (!privateKeyString) {
  error.value =
    'Ви використали посилання не із офіційних джерел. Будь ласка, перевірте посилання та спробуйте ще раз.'
} else {
  privateKey = new PrivateKey(privateKeyString)
}

fetch(`${import.meta.env.VITE_REG_API}/vote/${voteId}/ring`)
  .then((res) => res.json())
  .then((data) => {
    voteRegResp.value = data
    loading.value = false
  })
  .catch((err) => {
    console.warn(err)
    error.value = 'Помилка завантаження даних. Спробуй оновити сторінку'
  })

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

const submitVote = async () => {
  let ring = voteRegResp.value!.keys!.map((key) => new PublicKey(key))
  console.log('Using ring: ', ring)
  let passring = new Passring(voteId, ring)
  let issued = passring.issue(voteSelected.value!, privateKey!) // issue vote for choice 2 with privkey| console. log("Issued: ", issued);
  let result = passring.validate(issued)
  console.log('Validated: ', result)

  const stripped = strip_full_signature(issued)
  const resp1 = await (
    await fetch(`${import.meta.env.VITE_AGENCY_API}/voting/${voteId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stripped)
    })
  ).json()
  const resp2 = await fetch(
    `${import.meta.env.VITE_AGENCY_API}/voting/${voteId}/vote/${resp1.id}/key`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: issued.key })
    }
  )

  success.value = true
}
</script>
<style scoped>
button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}
button span {
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
