<template>
  <div
    id="app"
    :class="isPublicRoute ? 'flex-col justify-between' : 'flex relative h-screen'"
  >
    <router-view key="nav" name="header" class="z-30" v-if="isPublicRoute" />
    <router-view key="main" class="z-10" />
    <router-view key="footer" name="footer"  />
  </div>
</template>

<script>
import publicRoutes from '@/router/publicRoutes';

export default {
  name: 'App',

  data() {
    return {};
  },

  mounted() {
    console.log(this.isPublicRoute);
    console.log(publicRoutes);
  },

  methods: {

  },

  computed: {
    isPublicRoute() {
      let routes = publicRoutes;

      for (let i = 0; i < routes.length; i++)
        if (this.$route.path === routes[i].path) return true;
      return false;
    },
  },
};
</script>

<style>
html {
  @apply font-body;
}
</style>
