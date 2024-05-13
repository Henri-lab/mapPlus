import { createRouter, createWebHistory } from 'vue-router'
import home from '@/views/PATH_home/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        cmw: home
      },
      meta: {
        name: 'home'
      },
    },
    {
      path: '/citySearch',
      name: 'citySearch',
      components: {
        cmw: () => import('@/views/PATH_citylist/index.vue')
      },
      meta: {
        name: 'citySearch'
      },
    },
    {
      path: '/openMap',
      name: 'openMap',
      components: {
        cmw: () => import('@/views/PATH_Map_ol/index.vue')
      },
      meta: {
        name: 'openMap'
      },
      children: [
        {
          path: 'mapSearch/:city',
          name: 'mapSearch',
          components: {
            cmw: () => import('@/views/PATH_Map_ol/index.vue')
          },
          props: true,
          meta: {
            name: 'mapSearch'
          }
        }
      ]
    }
  ]
})

export default router
