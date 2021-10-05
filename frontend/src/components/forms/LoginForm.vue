<template>
    <ValidationObserver v-slot="{handleSubmit}" ref="form" slim>
          <form
            class="flex flex-col items-center justify-center px-4 mb-16"
            @submit.prevent="handleSubmit(login())"
          >
                <!-- Submission error -->
              <span
              :class="errorClass"
              >{{ submitError }}</span
            >
            <!-- E-mail validation -->
            <ValidationProvider
            v-slot="{errors}"
              class="flex flex-col"
              slim
              mode="eager"
              name="Email"
              rules="required|email"
            >
              <!-- Email error message -->
              <span
                :class="errorClass">{{ errors[0] }}</span
              >
                <!-- Email input field -->
                <input
                  id="email"
                  ref="emailref"
                  v-model="email"
                  type="email"
                  :class="errors[0] ? inputClassAlt : inputClass"
                  placeholder="Your email"
                  @keydown.enter="onEmailSubmit"
                />
            </ValidationProvider>

            <ValidationProvider
            v-slot="{errors}"
              class="flex flex-col"
              slim
              mode="eager"
              name="Password"
              rules="min:8"
            >
              <!-- Password error message -->
              <span 
              :class="errorClass">{{
                errors[0]
              }}</span>
                  <!-- Password input field -->
                  <input
                    ref="passwordref"
                    v-model="password"
                    type="password"
                    :class="errors[0] ? inputClassAlt : inputClass"
                    class="mt-0.5"
                    placeholder="Your password"
                  />
            </ValidationProvider>

              <button class="font-medium w-full mt-5 hover:bg-persian-500 text-white transition-all shadow-2 duration-200 font-head h-2 text-sm h-10 bg-persian-400 text-semibold font-head"
                      @click="handleSubmit(login)">
                  Login
              </button>

          </form>
        </ValidationObserver>
</template>

<script>

export default {
  name: "LoginForm",

  components: {
  },

   data() {
    return {
      inputClass: "placeholder-black-100 mt-2 border-2 border-opacity-0 border-primary-300  px-2.5 py-1 lg:w-72",
      inputClassAlt: "placeholder-black-100 mt-2 border-2 border-opacity-60 border-danger-500 px-2.5 py-1 lg:w-72",
      errorClass: "h-3 mb-0.5 text-xs text-black-200",
      
      submitError: '',
      errors: [],
      email: null,
      password: null,
    };
  },

  mounted() {},

  methods: {
    onEmailSubmit() {
      /* eslint-disable no-unused-vars */
      this.$refs.form.validate().then(success => {
        if (this.$refs.form.fields.Email.passed) {
          this.$nextTick(() => {
            this.$refs.passwordref.focus();
          });
        }
      });
    },

    login() {
      this.$refs.form.validate().then(success => {
        if (!success) {
          console.log(this.$refs.form);
          console.log('login failed');
          return;
        }
        // Resetting Values
        // this.email = this.password = '';

        // Wait until the models are updated in the UI
        this.$nextTick(() => {
          this.$refs.form.reset();
        });

        if (success) {
          const user = {
            email: this.email,
            password: this.password,
          };

          this.$store
              .dispatch('login', user)
              .then(() => this.$router.push('/dashboard'))
              .catch(err => {
                this.submitError = 'submit error...'
                this.submitError = err.response.data.detail;
              });
        }
      });
    },

  },
}
</script>