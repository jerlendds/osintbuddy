<template>
  <footer class="fixed bottom-0 z-50 flex items-center justify-around w-full h-40 shadow-4 bg-white-200 bg-opacity-90">
    <section class="flex flex-col px-12">
      <h1 class="pt-1 text-lg font-semibold text-black-800">General</h1>
      <ul class="text-black-500" >
        <li class="py-1">
          <router-link class="text-black-400" to="/">About</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-black-400" to="/">Pricing</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-black-400" to="/">Features</router-link>
        </li>
      </ul>
    </section>
    <section class="flex flex-col px-12">
      <h1 class="pt-1 text-lg font-semibold text-black-800">Guides</h1>
      <ul class="text-black-500" >
        <li class="py-1">
          <router-link class="text-black-400" to="/">Searching</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-black-400" to="/">Analysis</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-black-400" to="/">Reports</router-link>
        </li>
      </ul>
    </section>
    <section class="flex flex-col px-12">
      <h1 class="pt-1 text-lg font-semibold text-black-800">Legal</h1>
      <ul class="text-black-500" >
        <li class="py-1"> 
          <router-link class="text-black-400" to="/">Terms & Conditions</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-black-400" to="/">Privacy Policy</router-link>
        </li>
        <li class="py-1">
          <router-link class="text-black-400" to="/">Terms of Use</router-link>
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