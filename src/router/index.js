import Vue from 'vue'
import Router from 'vue-router'
import RecipeCalculator from '@/components/RecipeCalculator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RecipeCalculator',
      component: RecipeCalculator
    }
  ]
})
