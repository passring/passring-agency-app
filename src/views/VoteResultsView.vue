<template>
  <div>
    <h1 v-if="error">Помилка 😓</h1>
    <h2 v-else-if="success">🫡</h2>
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
    <h2 v-else-if="success">Перевірені результати:</h2>
    <div v-else-if="loading">Завантажуємо інформацію...</div>
    <div v-else-if="voteAgencyResp"></div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
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

const voteId = route.params.vote_id.toString()

const loading = ref(true)
const success = ref(false)
const voteRegResp = ref<VoteReg | null>(null)
const voteAgencyResp = ref<VoteAgency | null>({
  id: 'e65fd44f-1efb-40ca-b39b-2af71ecc20e5',
  title: 'Тестове',
  description: 'Чи варто жити',
  options: ['Ні', 'Звісно ні'],
  active: true
})
const votes = ref<string[] | null>(null)
const error = ref<string | null>(null)

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

// fetch(`${import.meta.env.VITE_AGENCY_API}/voting/${voteId}`)
//   .then((res) => res.json())
//   .then((data) => {
//     voteAgencyResp.value = data
//     loading.value = false
//   })
//   .catch((err) => {
//     console.warn(err)
//     error.value = 'Помилка завантаження даних. Спробуй оновити сторінку'
//   })

fetch(`${import.meta.env.VITE_AGENCY_API}/voting/${voteId}/vote`)
  .then((res) => res.json())
  .then((data) => {
    votes.value = data
    loading.value = false
  })
  .catch((err) => {
    console.warn(err)
    error.value = 'Помилка завантаження даних. Спробуй оновити сторінку'
  })

const state = computed(() => {
  if (!votes.value) return null
  if (!voteRegResp.value?.keys) return null

  const ring = voteRegResp.value.keys.map((key) => new PublicKey(key))
  const passring = new Passring(voteId, ring)
  const answers = votes.value.map((vote) => passring.validate(vote))

  return answers
})
// const submitVote = async () => {
//   let ring = voteRegResp.value!.keys!.map((key) => new PublicKey(key))
//   console.log('Using ring: ', ring)
//   let passring = new Passring(voteId, ring)
//   let issued = passring.issue(voteSelected.value!, privateKey!) // issue vote for choice 2 with privkey| console. log("Issued: ", issued);
//   let result = passring.validate(issued)
//   console.log('Validated: ', result)

//   const stripped = strip_full_signature(issued)
//   const resp1 = await (
//     await fetch(`${import.meta.env.VITE_AGENCY_API}/voting/${voteId}/vote`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(stripped)
//     })
//   ).json()
//   const resp2 = await fetch(
//     `${import.meta.env.VITE_AGENCY_API}/voting/${voteId}/vote/${resp1.id}/key`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ key: issued.key })
//     }
//   )

//   success.value = true
// }
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
  max-width: 400px;
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
