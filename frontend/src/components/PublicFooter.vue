<template>
  <footer class="z-50 flex items-center justify-around w-full h-40 shadow-6 bg-navy-900 ">
    <section class="flex flex-col px-12">
      <h1 class="pt-1 text-lg font-semibold text-white-600">General</h1>
      <ul class="text-white-200" >
        <li class="py-1">
          <router-link class="text-white-800" to="/">About</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-white-800" to="/">Support</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-white-800" to="/">Features</router-link>
        </li>
      </ul>
    </section>
    <section class="flex flex-col px-12">
      <h1 class="pt-1 text-lg font-semibold text-white-600">Guides</h1>
      <ul class="text-white-200" >
        <li class="py-1">
          <router-link class="text-white-800" to="/">Searching</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-white-800" to="/">Analysis</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-white-800" to="/">Reports</router-link>
        </li>
      </ul>
    </section>
    <section class="flex flex-col px-12">
      <h1 class="pt-1 text-lg font-semibold text-white-600">Legal</h1>
      <ul class="text-white-200" >
        <li class="py-1"> 
          <router-link class="text-white-800" to="/">Terms & Conditions</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-white-800" to="/">Privacy Policy</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-white-800" to="/">Terms of Use</router-link>
        </li>
      </ul>
    </section>
    <!-- <section class="flex flex-col px-12">
      
    </section> -->
  </footer>
</template>

<script>
export default {
  name: "PublicFooter",

  data() {
    return {
      mockup: [
        {
          text: "link name",
          path: "/",
        },
        {
          text: "link name",
          path: "/",
        },
        {
          text: "link name",
          path: "/",
        },
      ],
    };
  },
};
</script>