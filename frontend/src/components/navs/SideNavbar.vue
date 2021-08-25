<template>
  <nav class="">
<!--      <li v-for="action in actions" :key="action.text">-->
<!--        {{action.text}}-->
<!--      </li>-->
  </nav>
</template>

<script>
export default {
  name: 'SideNavbar',

  data() {
    return {
      actions: [
        {
          text: "1A",
        },
        {
          text: "2A",
        },
        {
          text: "3A",
        },
        {
          text: "4A",
        },
        {
          text: "5A",
        },
      ],
      buttons: [
        {
          text: '',
          action: () => {},
        },
      ],
    };
  },
};
</script>
