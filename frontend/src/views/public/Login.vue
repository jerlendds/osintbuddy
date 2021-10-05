<template>
  <div class="account-container bg-navy-800 pb-3.5">
    <h1 class="account-header">To continue, log in to OSINT Buddy</h1>
    <div class="flex flex-col items-center justify-center w-3/5 ">
      <login-form />
        <div class="mt-4 flex flex-col items-center">
            <router-link class="text-sm text-white-200 my-2 font-semibold" to="/">Forgot password?</router-link>
            <p class="text-sm text-white-500">New to OSINT Buddy?  <router-link class="text-boston-blue-500" to="/">Join now</router-link></p>

        </div>
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
  @apply flex flex-col items-center justify-center my-32
}

.account-header {
  @apply px-12 pt-20 pb-1 mx-2 font-semibold border-b-2 font-head text-white-400 border-opacity-40 border-white-100
}
</style>