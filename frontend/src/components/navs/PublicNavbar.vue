<template>
  <nav
    style="transition: all 0.15s ease-in"
    class="z-50 h-auto bg-transparent shadow-2 flex-center lg:px-2 lg:px-10 w-full"
  > 
  <!-- bg-white-100  bg-lightgray-100 -->
    <ul
      class="z-50 flex flex-col items-start justify-between w-full py-2 lg:flex-row lg:items-center lg:bg-transparent"
    >
      <li
        class="flex items-center justify-between w-full pr-4 padded-link-block lg:w-auto"
      >
        <!-- Home link is foodoo logo -->
        <router-link data-test="topnavbarHomeLink" to="/">
          <img
            class="h-6 lg:h-5"
            src="@/assets/imgs/logo.svg"
            alt="Osint Buddy Logo"
          />
        </router-link>

        <!-- Mobile menu toggle button -->
        <button
          class="relative flex w-10 h-6 no-moz-focus lg:hidden lg:invisible"
          @click="isMobileOpen = !isMobileOpen"
        >
          <div
            :class="{ 'is-active': isMobileOpen }"
            class="hamburger hamburger--spring js-hamburger"
          >
            <div class="hamburger-box">
              <div class="hamburger-inner"></div>
            </div>
          </div>
        </button>
      </li>

      <!-- Links for tutorial, docs, examples, blogs, pricing -->
      <li
        
        class="px-3 text-black-300 lg:visible"
        v-for="link in links"
        :key="link.path"
      >
        <router-link :data-test="link.testData" :to="link.path">
          <p class="topnavbar-link">
            {{ link.text }}
          </p>
        </router-link>
      </li>

      <!-- Accounts -->
      <li
        class="lg:ml-auto text-black-300 lg:visible"
      >
        <router-link data-test="topnavbarRegisterLink" class="pr-2" to="/register">
          <btn text="Register" size="sm" />

        </router-link>
      </li>
      <li
        class="px-3 lg:px-3 lg:visible lg:block"
      >
        <router-link data-test="" to="/login">
          <p class="font-semibold text-primary-500 font-head">Login</p>
        
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import Button from '@/components/buttons/Btn'

export default {
  name: "PublicNavbar",

  components: {
    btn: Button
  },

  data() {
    return {
      isMobileOpen: false,
      links: [
        {
          path: "/pricing",
          text: "About",
          testData: "topnavbarDocsLink",
        },
        {
          path: "/support",
          text: "Support",
          testData: "topnavbarTutorialLink",
        },
        {
          path: "/guides",
          text: "Guides",
          testData: "topnavbarExamplesLink",
        },
        {
          path: "/dashboard",
          text: " g",
          testData: "topnavbarExamplesLink",
        },
      ],
    };
  },
};
</script>