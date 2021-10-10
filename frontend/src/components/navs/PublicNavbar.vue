<template>
  <nav
    style="transition: all 0.15s ease-in"
    class="z-50 h-auto bg-navy-900 shadow-2 flex-center lg:px-2 lg:px-10 w-full"
  >
    <ul
      class="z-50 flex flex-col items-center justify-between w-full py-1 lg:flex-row  lg:bg-transparent"
    >
      <li
        class="flex items-center justify-between w-full pr-4 padded-link-block lg:w-auto"
      >
        <!-- OSINT Buddy logo -->
        <router-link data-test="topnavbarHomeLink" to="/">
          <img
            class="h-6 lg:h-7"
            src="@/assets/imgs/logo-lg.svg"
            alt="Osint Buddy Logo"
          />
        </router-link>

        <!-- Mobile menu toggle button -->
        <button
          class="relative flex w-10 h-6 no-moz-focus lg:hidden lg:invisible"
          @click="isMobileOpen = !isMobileOpen"
        >
          <div
            :class="{'is-active': isMobileOpen}"
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
        v-for="link in links"
        :key="link.path"
        class="px-3 pb-1 text-white-300 lg:visible"
      >
        <router-link :data-test="link.testData" :to="link.path">
          <p class="topnavbar-link">
            {{ link.text }}
          </p>
        </router-link>
      </li>
        <li
                class="px-3 pb-1 text-white-300 lg:visible"
        >
            <a href="https://github.com/jerlendds/osintbuddy">
                <p class="topnavbar-link">
                    Github
                </p>
            </a>
        </li>
      <!-- Accounts -->
      <li class="lg:ml-auto text-white-300 lg:visible py-2">
        <router-link
          data-test="topnavbarRegisterLink"
          class="font-medium w-full  hover:bg-persian-500 text-white transition-all shadow-2 duration-200 font-head text-sm py-1.5 px-5 bg-persian-400  font-head"
          to="/register"
        >
            Register
        </router-link>
      </li>
      <li class="px-3 lg:px-3 lg:visible lg:block">
        <router-link data-test="" to="/login">
          <p class="font-semibold text-white-100 font-head">Login</p>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>

export default {
  name: 'PublicNavbar',

  components: {
  },

  data() {
    return {
      isMobileOpen: false,
      links: [
        {
          path: '/docs',
          text: 'Documentation',
          testData: 'topnavbarDocsLink',
        },
        {
          path: '/guides',
          text: 'Guides',
          testData: 'topnavbarExamplesLink',
        },
      ],
    };
  },
};
</script>
