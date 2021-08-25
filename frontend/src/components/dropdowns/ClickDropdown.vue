<template>
  <section class="inline-block transition-all duration-75 shadow-2 bg-white-100" @mouseleave="showDropdown = false">
    <button @click="showDropdown = !showDropdown" :class="showDropdown ? 'bg-white-200' : 'bg-white-100'" class="relative z-50 flex px-2 py-2 hover:shadow-5">
      <p class="px-2 text-black">Menu</p>
      <component :class="showDropdown ? 'rotate-180': ''"  class="px-2 text-black transition-transform duration-100 transform" :is="toggleIcon" />
    </button>
    <ul v-show="showDropdown" class="z-10 flex inline-block h-auto px-4 py-3 transition-all duration-75 ">
      <li v-for="item in links" :key="item.text" class="">
        <router-link :to="item.to">
        <p class="text-black">{{item.text}}</p>

        </router-link>
      </li>

    </ul>
  </section>
</template>

<style scoped>

</style>

<script>
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';

export default {
  name: "HoverDropdown",

  props: {
    links: {
      default: [{
        to: '/',
        text: 'Menu Item'
      }],
      value: Array
    }
  },

  data() {
    return {
      showDropdown: false,
    };
  },

  computed: {
    toggleIcon() {
      return ChevronDown;
    },
  },
};
</script>