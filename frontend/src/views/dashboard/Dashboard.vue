<template>
  <main class="flex lg:flex-row flex-col w-full ">



    <SearchBarAlternative />

  </main>
</template>

<style></style>

<script>
import AnyResultCard from "@/components/cards/data/AnyResultCard";
import TwitterCard from '@/components/cards/data/TwitterCard';
import SearchBarAlternative from "../../components/forms/SearchBarAlternative";

export default {
  name: 'Dashboard',

  components: {
    SearchBarAlternative
  },

  data() {
    return {
    };
  },

  computed: {
    twitterCard() {
      return TwitterCard
    },

    anyCard() {
      return AnyResultCard
    },
  },

  mounted() {},
};
</script>
