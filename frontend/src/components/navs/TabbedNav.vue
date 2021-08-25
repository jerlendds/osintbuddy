<template>
    <ul class="flex-grow flex px-3 fixed top-0 h-10 z-50 mr-auto bg-white z-50">
      <li
        class="font-head flex"
        v-for="(tab, index) in tabs"
        :key="index"
        :class="
          activeTab === index
            ? 'text-black-500 border-b-4  border-primary-200'
            : 'border-b-4 border-white-600'
        "
      >
        <div
          class="cursor-pointer py-2 px-3 border-white-600"
          @click="activeTab = index"
          :class="
            activeTab === index
              ? 'text-black-500 border-b-2  border-primary-200'
              : 'text-black-100'
          "
        >
          {{ tab }}
        </div>
      </li>
    </ul>
</template>

<script>
export default {
  name: 'TabbedNav',

  data() {
    return {
      activeTab: 0,
      index: 0,
    };
  },

  props: {
    tabs: {
      default: () => ['All', 'Matches', 'Images'],
      value: Array,
    },
  },
};
</script>
