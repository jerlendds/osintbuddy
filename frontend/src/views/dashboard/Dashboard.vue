<template>
  <main class="flex flex-col w-full">

    <section class="section py-2 ">
      <SearchBarAlternative />
    </section>
    <section class="section" ref="scroll" >
        <div class="my-2"  v-for="result in results" :key="result.id">
          <AnyResultCard :source="result"
          />
        </div>
        <infinite-loading @infinite="infiniteHandler">

        </infinite-loading>

    </section>
  </main>
</template>

<style >
.section {
  @apply  mx-4 sm:mx-6 md:mx-8 lg:mx-20 py-3
}

</style>

<script>
import {api} from '@/api'

import AnyResultCard from "@/components/cards/data/AnyResultCard";
import TwitterCard from '@/components/cards/data/TwitterCard';
import SearchBarAlternative from "../../components/forms/SearchBarAlternative";
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'Dashboard',

  components: {
    SearchBarAlternative,
    InfiniteLoading,
    AnyResultCard
  },

  data() {
    return {
      page: 1,


      searchId: 5,
      results: [],
      limit: 10,
      offset: 0,
      totalResultsCount: 0,
      resultsCount: 0
    }
  },

  computed: {
    twitterCard() {
      return TwitterCard
    },

  },

  methods: {
    infiniteHandler($state) {

      api.getSearchResults(this.$store.getters.isLoggedIn, this.searchId, this.limit, this.offset)
          .then(resp => {
            this.totalResultsCount = resp.data.total_results
            this.resultsCount = resp.data.results_count
            let results = this.results;
            if (resp.data.results.length) {
              this.page +=1
              this.offset = this.offset + 10
              results.push(...resp.data.results)
              $state.loaded()
            } else {
              $state.complete()
            }

          })
    },

    getUsers() {
      let results;


      this.offset = this.offset + 10
      return results
    },
  },

  mounted() {

  },
};
</script>
