<template>
  <div
    id="app"
    :class="isPublicRoute ? 'flex-col justify-between' : 'flex justify-between h-screen '"
  >
    <router-view v-if="isPublicRoute" key="nav" name="header" class="z-30" />
    <router-view key="main" class="z-10" />
    <router-view key="footer" name="footer"
     :class="isPublicRoute ? 'mt-64' : 'order-first'"
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
    @apply bg-navy-800
}
html {
  @apply font-body;
}
</style>
