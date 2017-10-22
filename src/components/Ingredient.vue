<template>
    <div class="ingredient">
      <p>{{ ingredient.name }} {{ amount }}{{ ingredient.unit }} ({{ ingredient.amount }})</p>
  </div>
</template>

<script>
  export default {
    name: 'Ingredient',
    props: [ 'ingredient', 'factor' ],
    computed: {
      amount () {
        return this.ingredient.amount * this.factor
      }
    }
  }
</script>
