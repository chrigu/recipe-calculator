<template>
    <div class="container">
      <h1>Recipe Calculator</h1>
      <upload-component @uploadDone="uploadDone"></upload-component>
      <div v-if="isSuccess" class="ingredients">
        <div>
          <p>{{ factor }}x</p>
        </div>
        <ingredient :ingredient="ingredient" :factor="factor" v-for="ingredient in ingredients" :key="ingredient.name">
        </ingredient>
        <input class="factor" type="range" min="0.25" max="2" step="0.25" v-model="factor" />
      </div>
  </div>
</template>

<script>
  import Ingredient from './Ingredient.vue'
  import UploadComponent from './UploadComponent.vue'
  import { STATUS_SUCCESS, STATUS_FAILED } from '../constants'

  export default {
    name: 'RecipeCalculator',
    components: { Ingredient, UploadComponent },
    data () {
      return {
        ingredients: [],
        currentStatus: null,
        uploadFieldName: 'recipe',
        factor: 1,
        uploadState: 0
      }
    },
    computed: {
      isSuccess () {
        return this.uploadState === STATUS_SUCCESS
      },
      isFailed () {
        return this.uploadState === STATUS_FAILED
      }
    },
    methods: {
      uploadDone (state, ingredients) {
        this.uploadState = state
        this.ingredients = ingredients || []
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.factor {
  width: 75%;
  height: 20px;
}
</style>
