<template>
  <section class="px-5 py-2 rounded-sm bg-white-100 shadow-2 component">
    <blockquote class="relative w-full p-10 m-1 text-center text-black-400">
      It’s good to meet you, Dr. Banner. Your work on anti-electron collisions
      is unparalleled. And I’m a huge fan of the way you lose control and turn
      into an enormous green rage monster.
      <cite> - Tony Stark</cite>
    </blockquote>
  </section>
</template>

<style scoped>
.component {
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
}

blockquote {
  background: linear-gradient(to right, #E8E8E8 6px, transparent 4px) 0 100%,
    linear-gradient(to left, #E8E8E8 6px, transparent 4px) 100% 0,
    linear-gradient(to bottom, #E8E8E8 6px, transparent 4px) 100% 0,
    linear-gradient(to top, #E8E8E8 6px, transparent 4px) 0 100%;
  background-repeat: no-repeat;
  background-size: 20px 20px;
}

/* -- create the quotation marks -- */
blockquote:before,
blockquote:after {
  font-family: FontAwesome;
  position: absolute;
  color: #E8E8E8;
  font-size: 34px;
}

blockquote:before {
  content: "\f10d";
  top: -12px;
  margin-right: -20px;
  right: 100%;
}

blockquote:after {
  content: "\f10e";
  margin-left: -20px;
  left: 100%;
  top: auto;
  bottom: -20px;
}
</style>