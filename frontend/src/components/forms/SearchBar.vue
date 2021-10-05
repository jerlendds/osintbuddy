<template>
    <form class="max-w-sm flex items-center justify-between bg-white-100 border-2  border-white-800 border-opacity-10 rounded" action="">
      <input v-model="searchValue"  class="bg-white-100 pl-2" type="text" placeholder="Search...">
      <button class="bg-primary-300 px-2 py-1 rounded-r">
        <component :is="setSearch" class="text-white-100"  />
      </button>
    </form>
</template>

<script>
import SearchWeb from 'vue-material-design-icons/SearchWeb';


export default {
  name: 'SearchBar',

  data() {
    return {
      searchValue: "",
    }
  },

  computed: {
    setSearch() {
      return SearchWeb
    }
  }
}
</script>