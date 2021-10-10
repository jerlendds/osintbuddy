<template>
  <div
    id="app"
    class="flex justify-between"
    :class="{'flex-col':isPublicRoute}"
  >
    <router-view v-if="isPublicRoute" key="nav" name="header" class="z-30" />
    <router-view key="main" class="z-10" />
    <router-view key="footer" name="footer"
     :class="{'order-first':!isPublicRoute}"
    />
  </div>
</template>

<script>
import publicRoutes from '@/router/publicRoutes';

export default {
  name: 'App',

  data() {
    return {};
  },

  computed: {
    isPublicRoute() {
      let routes = publicRoutes;

      for (let i = 0; i < routes.length; i++)
        if (this.$route.path === routes[i].path) return true;
      return false;
    },
  },

  mounted() {
    console.log(this.isPublicRoute);
    console.log(publicRoutes);
  },

  methods: {

  },
};
</script>

<style>
#app {
    @apply min-h-screen bg-dark
}
html {
  @apply font-body;
}

</style>
