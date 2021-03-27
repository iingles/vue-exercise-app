<template>
  <div id="app">
    <Header />

    <b-container>

      <b-row class="px-0">
          <header class="page-header">
            <h1>{{ this.$route.name }}</h1>
          </header>
      </b-row>

     
      <router-view /> 

    </b-container>
     
  </div>
</template>

<script>
import Header from '@/components/header/Header'
import axios from 'axios'

export default {
  components: {
    Header
  },

  data: () => ({

  }),

  mounted() {
    this.getExercises()
  },

  methods: {
    async getExercises(){
      const response = await axios.get('https://goofy-wiles-652986.netlify.app/exerciseData.json')

      const resData = await response.data

      this.$store.commit('SET_EXERCISE_HISTORY', resData)

    }
}

}
</script>


<style lang="scss">
  html {
    font-size: 62.5%!important;
  }

  body {
    font-family: 'Roboto', 'Arial', sans-serif;
    font-size: 1.6rem!important;
  }

  label {
    font-size: 1.6rem;
  }

  select, input {
      padding: 1rem 2rem 1rem 1rem;
      border: 1px solid #ccc;
      font-size: 1.6rem!important;
      cursor: pointer; 
  }

  .card {
    padding: 2rem;
    border: 1px solid #ccc!important;
    border-radius: 20px!important;
  }
</style>
