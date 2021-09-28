<template>
    <form @submit.prevent="submitSearch" class="search-bar">
      <input v-model="searchInput" type="text" class="search-query" placeholder="Search...">
      <button class="search-btn">
        <component :is="searchIcon" class="text-white-50"/>
      </button>
    </form>
</template>

<script>
import {api} from '@/api'
import Magnify from "vue-material-design-icons/Magnify";
// import DotsVertical from 'vue-material-design-icons/DotsVertical'

export default {
  name: "SearchBarAlternative",

  props: {
    placeholder: {
      default: "Search...",
      type: String
    },
  },

  data() {
    return {
      style: '',
      searchInput: '',
    }
  },

  components: {

  },

  methods: {
    submitSearch() {

      api.createSearch(this.$store.getters.isLoggedIn, {query: this.searchInput})
          .then(resp => {
            // TODO: Update Store to store response
            console.log(resp.data)
          })
    }
  },

  computed: {
    searchIcon() {
      return Magnify
    },
  },



  mounted() {

  }
}
</script>

<style>
.search-bar {
  @apply bg-white-100 flex max-h-9 justify-between w-full shadow-2 rounded;
}
.search-query {
  @apply px-2.5 w-full outline-none focus:outline-none focus:border-primary-200 border-b-2 border-white transition-all duration-75 }
.search-btn {
  @apply bg-primary-300 px-2 rounded-r py-2
 }
</style>