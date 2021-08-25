<template>
      <div class="flex flex-col items-center justify-center my-36">
    <h1 class="px-12 pt-20 pb-1 mx-2 mb-4 font-semibold border-b-2 font-head text-black-400 border-opacity-40 border-black-300">To continue, sign up for OSINT Buddy</h1>
    <div class="flex items-center justify-center w-3/5 ">
    <registration-form />
    </div>
  </div>
</template>

<script>
import RegistrationForm from '@/components/forms/RegistrationForm.vue'
export default {
  name: "Register",

  components: {
    RegistrationForm

  }
}
</script>