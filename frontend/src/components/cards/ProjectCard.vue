<template>
<div class="inline-block">
  <section class="p-1.5 my-4 border-4 perspective border-black-200 shadow-2">
      <img src="https://images.pexels.com/photos/177557/pexels-photo-177557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="" class="h-24 shadow-7">
  </section>
    <section class="p-1.5 border-2 rounded perspective-neg border-black-200 shadow-2">
      <img src="https://images.pexels.com/photos/177557/pexels-photo-177557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="" class="h-24 rounded shadow-7">
  </section>
  
</div>

</template>

<script>
export default {
  name: "ProjectCard",


}
</script>

<style scoped>
.perspective {
  transform: perspective(400px) rotateY(35deg)
}
.perspective-neg {
  transform: perspective(400px) rotateY(-35deg)
}

</style>