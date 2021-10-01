<template>
  <nav class="bg-navy-900   pr-2.5 mr-4">
    <!-- Navigation Logo -->
    <section class="py-4">
      <img src="@/assets/imgs/logo-lg.svg"
           alt="OSINT Buddy Logo"
           class="h-10 px-5 "
      />
    </section>
    <ul class="mt-5 min-w-min">
      <li v-for="nav in navItems" :key="nav.id" class="hover:bg-black-500 transition-all duration-200 bg-black-600 pr-7 pl-5 my-3 py-2 rounded-r-sm shadow-6">
        <router-link :to="nav.path">
            <h3 class="text-white ">{{ nav.text }}</h3>

        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "SideNavbar",

  data() {
    return {
      navItems: [
          {
              id: 0,
              text: "Overview",
              path: "/"
          },
        {
          id: 1,
            text: "Cases",
            path: "/dashboard"
        },
        {
          id: 2,
            text: "Search",
            path: "/"
        },
        {
          id: 3,
            text: "Analysis",
            path: "/"
        },

        {
          id: 4,
            text: "Settings",
            path: "/"
        }
      ]
    }
  }

}
</script>