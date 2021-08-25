<template>
  <div
          class="relative flex h-6 w-10 no-moz-focus lg:hidden lg:invisible"
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
        </div>

</template>

<script>
export default {
  name: "BtnHamburger",

  data() {
    return {
      isMobileOpen: false,
    }
  }
}
</script>

<style>
/* CSS Hamburger Menu Icon */
.hamburger--spring.is-active .hamburger-inner {
  transition-delay: 0.17s;
  background-color: transparent !important;
}
.hamburger--spring.is-active .hamburger-inner::after {
  top: 0;
  transition: top 0.12s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
    transform 0.1s cubic-bezier(0.215, 0.61, 0.355, 1) 0.17s;
  transform: translate3d(0, 10px, 0) rotate(-45deg);
}
.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::after,
.hamburger.is-active .hamburger-inner::before {
  background-color: #546054;
}
.hamburger--spring .hamburger-inner::after {
  top: 20px;
  transition: top 0.12s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.12s,
    transform 0.1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger-inner::after {
  bottom: -10px;
}
.hamburger-inner::after,
.hamburger-inner::before {
  display: block;
  content: '';
}
.hamburger--spring.is-active .hamburger-inner::before {
  top: 0;
  transition: top 0.1s cubic-bezier(0.33333, 0, 0.66667, 0.33333) 0.12s,
    transform 0.1s cubic-bezier(0.215, 0.61, 0.355, 1) 0.17s;
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--spring .hamburger-inner::before {
  top: 10px;
  transition: top 0.1s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.12s,
    transform 0.1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger-inner::before {
  top: -10px;
}
.hamburger--spring .hamburger-inner {
  top: 2px;
  transition: background-color 0s linear 0.1s;
  transition-delay: 0.1s;
}

.hamburger-inner,
.hamburger-inner::after,
.hamburger-inner::before {
  position: absolute;
  width: 40px;
  height: 4px;
  transition-timing-function: ease;
  transition-duration: 0.12s;
  transition-property: transform;
  border-radius: 4px !important;
  background-color: #4c4e4c;
}
.hamburger-inner {
  top: 50%;
  display: block;
  margin-top: -2px;
}
.hamburger {
  font: inherit;
  cursor: pointer;
  text-transform: none;
  color: inherit;
}
</style>