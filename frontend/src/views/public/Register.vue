<template>
      <section class="account-container">
    <div class="account-form-container">
        <h1 class="account-header">To continue, sign up for OSINT Buddy</h1>
        <registration-form  class="pt-5"  />
    </div>
  </section>
</template>

<style scoped>

</style>

<script>
import RegistrationForm from '@/components/forms/RegistrationForm.vue'
export default {
  name: "Register",

  components: {
    RegistrationForm

  }
}
</script>