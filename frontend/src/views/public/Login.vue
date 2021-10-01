<template>
  <div class="account-container bg-navy-800">
    <h1 class="account-header">To continue, log in to OSINT Buddy</h1>
    <div class="flex items-center justify-center w-3/5 ">
      <login-form />
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/forms/LoginForm";

export default {
  name: "Login",

  components: {
    LoginForm,
  },
};
</script>

<style>
.account-container {
  @apply flex flex-col items-center justify-center my-36
}

.account-header {
  @apply px-12 pt-20 pb-1 mx-2 font-semibold border-b-2 font-head text-white-400 border-opacity-40 border-black-300
}
</style>