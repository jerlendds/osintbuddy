<template>
  <main class="flex flex-col w-full h-screen">
    <!-- Main Content -->
    <section class="flex h-20 items-center justify-center">
      <!-- Overview Cards -->
        <section class="section">
            <SimpleDataStat card-class="bg-blue-600 whitespace-nowrap"
                            text="All entities"
                            :value="allEntities" />
        </section>
        <section class="section">
            <SimpleDataStat card-class="bg-green-600 whitespace-nowrap"
                            text="Keyword Matches"
                            :value="keywordMatches" />
        </section>
        <section class="section">
            <SimpleDataStat card-class="bg-alert-700 whitespace-nowrap"
q                            text="Active Searches"
                            :value="activeSearches" />
        </section>



    </section>

      <!-- -->
      <section class="w-full pr-4 mt-4">
          <SearchBarAlternative class="z-50" />
      </section>

      <section class="w-full pr-4 h-full overflow-y-scroll noscroll">
          <InfiniteResults class="mr-7" @totalResultsCount="getResultsData" />
      </section>
  </main>
</template>

<script>
import {api} from '@/api';

import SearchBarAlternative from "../../components/forms/SearchBarAlternative";
import InfiniteResults from "../../components/data/InfiniteResults";
import SimpleDataStat from "../../components/cards/SimpleDataStat";

export default {
  name: 'Dashboard',

  components: {
      SimpleDataStat,
      InfiniteResults,
      SearchBarAlternative
  },

  data() {
    return {
      searchHistory: [],
      totalResults: 0,
        allEntities: "0",
        keywordMatches: "0",
        activeSearches: "0"
    };
  },

  mounted() {
    this.getSearchHistory();
  },

  methods: {
      getResultsData(data) {
          this.allEntities = data
      },

    getSearchHistory() {
      api.getSearchHisory(this.$store.getters.isLoggedIn).then(resp => {
        this.searchHistory = resp.data.searchHistory;
      });
    },
  },
};
</script>

<style>

.filter-btn {
  @apply right-4 w-9 h-9 bg-white-300 shadow-2  py-1.5 px-2 flex justify-center items-center;
}
.visible-filter {
  @apply transition-all ease-in-out opacity-0 fixed;
}

.invisible-filter {
  @apply fixed w-4/5 z-50 border-t-2 border-primary-300 top-12 transition-all duration-150 h-full opacity-100;
}
</style>
