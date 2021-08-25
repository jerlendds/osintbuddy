<template>
  <section class="bg-white-100">
      <div class="">

      </div>
      <ul v-if="showDropdown">

      </ul>
  </section>
</template>

<script>
export default {
  name: "HoverDropdown",

  data() {
    return {
      showDropdown: false,
    }
  }

}
</script>