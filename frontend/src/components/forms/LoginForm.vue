<template>
    <ValidationObserver v-slot="{handleSubmit}" ref="form" slim>
          <form
            @submit.prevent="handleSubmit(login())"
            class="flex flex-col items-center justify-center px-4 "
          >
                <!-- Submission error -->

              <span
              :class="errorClass"
              >{{ submitError }}</span
            >
            <!-- E-mail validation -->
            <ValidationProvider
            class="flex flex-col"
              slim
              mode="eager"
              name="Email"
              rules="required|email"
              v-slot="{errors}"
            >
              <!-- Email error message -->
              <span
                :class="errorClass">{{ errors[0] }}</span
              >
                <!-- Email input field -->
                <input
                  id="email"
                  ref="emailref"
                  @keydown.enter="onEmailSubmit"
                  v-model="email"
                  type="email"
                  :class="errors[0] ? inputClassAlt : inputClass"
                  placeholder="Your email"
                />
            </ValidationProvider>

            <ValidationProvider
            class="flex flex-col"
              slim
              mode="eager"
              name="Password"
              rules="min:8"
              v-slot="{errors}"
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
            <div class="flex flex-col w-full pt-2 mt-3">
                <btn text="Login" size="md"  v-on:click="handleSubmit(login())" />
  
           </div>
            <div class="mt-4 flex flex-col items-center">
              <router-link class="text-sm text-black-200 my-2 font-semibold" to="/">Forgot password?</router-link>
              <p class="text-sm text-black-500">New to OSINT Buddy? <router-link class="text-info-600" to="/">Join now</router-link></p>

            </div>
          </form>
        </ValidationObserver>
</template>

<script>
import Button from '@/components/buttons/Btn'

export default {
  name: "LoginForm",

  components: {
    btn: Button
  },

   data() {
    return {
      inputClass: "placeholder-black-100 mt-2 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 lg:w-72",
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
      console.log('login called');
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
    // onEmailSubmit() {
    //   /* eslint-disable no-unused-vars */
    //   this.$refs.form.validate().then(success => {
    //     if (this.$refs.form.fields.Email.passed) {
    //       this.$nextTick(() => {
    //         this.$refs.passwordref.focus();
    //       });
    //     }
    //   });
    // },
    //
    // login() {
    //   console.log('login called');
    //   this.$refs.form.validate().then(success => {
    //     if (!success) {
    //       console.log(this.$refs.form);
    //       console.log('login failed');
    //       return;
    //     }
    //     // Resetting Values
    //     this.email = this.password = '';
    //
    //     // Wait until the models are updated in the UI
    //     this.$nextTick(() => {
    //       this.$refs.form.reset();
    //     });
    //
    //     if (success) {
    //       console.log('Login method form valid');
    //       const user = {
    //         email: this.email,
    //         password: this.password,
    //       };
    //
    //       this.$store
    //         .dispatch('login', user)
    //         .then(() => this.$router.push('/dashboard'))
    //         .catch(err => {
    //           this.submitError =
    //             'Oh no, our servers went on strike! Please try again in a few minutes ';
    //
    //           this.submitError = err.response.data.detail;
    //           console.log(this.submitError);
    //         });
    //     }
    //   });
    // },
  },
}
</script>