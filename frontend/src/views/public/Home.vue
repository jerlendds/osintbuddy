<template>
  <main :style="gradient">
    <section class="z-50 flex">
      <section class="z-50 flex flex-col h-full px-10 py-44 blur-3xl ">
        <h2
          class="max-w-md text-5xl font-semibold leading-11 font-head text-black-400"
        >
          OSINT Gathering and Analysis
        </h2>
        <p class="max-w-md pt-2 pb-3 text-lg font-body text-black-300 ">
          <!-- Make connections and find your online footprint. OSINT Buddy is a... -->
           Make connections to people and public-facing assets from fragments of information
        </p>
        <div class="pb-44">
          <btn size="md" text="Watch a Video" />
        </div>
      </section>
      <canvas id="background" class="fixed w-full h-full" :style="gradient">
      </canvas>
    </section>
  </main>
</template>

<script>
import Button from "@/components/buttons/Btn";
import Particles from "particlesjs";

export default {
  name: "Home",
  components: {
    btn: Button,
  },

  computed: {
    gradient() {
      return "linear-gradient(45deg, rgba(240,240,240,1) 0%, rgba(249,249,249,1) 100%);";
    },
  },

  mounted() {
    Particles.init({
      selector: "#background",
      maxParticles: 86,
      connectParticles: true,
      speed: 0.22,
      sizeVariations: 7,
      color: "#dee0e3",

      responsive: [
        {
          breakpoint: 768,
          options: {
            maxParticles: 200,
            connectParticles: true,
          },
        },
        {
          breakpoint: 425,
          options: {
            maxParticles: 100,
            connectParticles: false,
          },
        },
        {
          breakpoint: 320,
          options: {
            maxParticles: 0,
          },
        },
      ],
    });
  },
};
</script>


<style scoped>
</style>