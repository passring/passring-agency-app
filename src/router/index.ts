import { createRouter, createWebHistory } from 'vue-router'
import VoteView from '../views/VoteView.vue'
import VoteResultsView from '../views/VoteResultsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/votings/:vote_id',
      name: 'votings',
      component: VoteView
    },
    {
      path: '/votings/:vote_id/results',
      name: 'votingsResults',
      component: VoteResultsView
    }
  ]
})

export default router
