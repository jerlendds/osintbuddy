<template>
  <ul class="w-full">
    <li v-for="result in results" :key="result.id" class="my-2">
      <AnyResultCard :source="result" />
    </li>
    <infinite-loading @infinite="infiniteHandler" />
  </ul>

</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';

import AnyResultCard from "../cards/data/AnyResultCard";
import {api} from '@/api'
import FilterVariant from "vue-material-design-icons/FilterVariant";

export default {
  name: "InfiniteResults",

  components: {
    InfiniteLoading,
    AnyResultCard,
  },

  data() {
    return {
      searchSubmitted: false,
      filterIcon: FilterVariant,
      page: 6,
      searchId: 51,
      results: [], // Object { id, title, description, url }
      limit: 10, // SQLAlchemy .limit()
      offset: 0, // SQLAlchemy .offset()
      addedResultsCount: 0, // Results count returned by server
      totalResultsCount: 0,
    }
  },

  methods: {
      getResults() {
          api.getSearchResults(this.$store.getters.isLoggedIn, this.searchId, this.limit, this.offset)
              .then(resp => {
                  this.totalResultsCount = resp.data.total_results
                  this.addedResultsCount = resp.data.results_count
                  let results = this.results;
                  if (resp.data.results.length) {
                      this.page += 1
                      if (this.offset < this.totalResultsCount) this.offset = this.offset + 10
                      results.push(...resp.data.results)
                      this.searchSubmitted = true;
                      this.$emit('totalResultsCount', this.totalResultsCount)
              }})
      },

    infiniteHandler($state) {
          let isfailed = false
      api.getSearchResults(this.$store.getters.isLoggedIn, this.searchId, this.limit, this.offset)
          .then(resp => {
            this.totalResultsCount = resp.data.total_results
            this.addedResultsCount = resp.data.results_count
            let results = this.results;
            if (resp.data.results.length) {
              this.page += 1
              if (this.offset < this.totalResultsCount) this.offset = this.offset + 10
              results.push(...resp.data.results)
              this.searchSubmitted = true;
              this.$emit('totalResultsCount', this.totalResultsCount)
              $state.loaded()
            } else {
              $state.complete()
            }
          }).catch(() => {
              isfailed = true
      })
        if (isfailed) {
            this.getResults()
        }
    }
  }
}
</script>
