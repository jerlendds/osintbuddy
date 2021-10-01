<template>
  <main class="bg-navy-800">
    <section class="z-50 flex">
      <section class="z-50 flex flex-col h-full px-10 py-44 blur-3xl ">
        <h2
          class="max-w-md text-5xl font-semibold leading-11 font-head text-white-600"
        >
          OSINT Gathering and Analysis
        </h2>
        <p class="max-w-md pt-2 pb-4 text-lg font-body text-white-700 ">
          <!-- Make connections and find your online footprint. OSINT Buddy is a... -->
          Make connections to people and public-facing assets from fragments of
          information
        </p>
        <div class="pb-52">
          <a class="lg:ml-auto text-white-300 lg:visible py-1 font-semibold">
            <router-link
              data-test="topnavbarRegisterLink"
              class="py-2 px-6 mr-2 bg-green shadow-2"
              to="/register"
            >
              Watch a Video
            </router-link>
          </a>
        </div>
      </section>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Home',
  components: {},

  computed: {},

  mounted() {},
};
</script>

<style scoped></style>
