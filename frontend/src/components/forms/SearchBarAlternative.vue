<template>
    <form class="search-bar" @submit.prevent="submitSearch">
      <input v-model="searchInput" type="text" class="search-query" placeholder="Search...">
      <button class="search-btn">
        <component :is="searchIcon" class="text-white-50" />
      </button>
    </form>
</template>

<script>
import {api} from '@/api'
import Magnify from "vue-material-design-icons/Magnify";
// import DotsVertical from 'vue-material-design-icons/DotsVertical'

export default {
  name: "SearchBarAlternative",

  components: {

  },

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

  computed: {
    searchIcon() {
      return Magnify
    },
  },

  mounted() {
  },

  methods: {
    submitSearch() {

      api.createSearch(this.$store.getters.isLoggedIn, {query: this.searchInput})
          .then(resp => {
            // TODO: Update Store to store response
            console.log(resp.data)
          })
    }
  }
}
</script>

<style>
.search-bar {
  @apply bg-blue-200 flex max-h-9 justify-between w-full shadow-2 rounded-sm;
}
.search-query {
  @apply px-2.5 w-full outline-none focus:outline-none focus:border-persian-400 border-b-2 border-white transition-all duration-75 rounded-l-sm
}
.search-btn {
  @apply bg-persian-400 px-2 rounded-r-sm py-2
 }
</style>