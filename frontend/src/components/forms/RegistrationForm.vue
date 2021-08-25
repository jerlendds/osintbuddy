<template>
  <ValidationObserver
    v-slot="{handleSubmit}"
    ref="form"
    slim
    class="flex flex-col"
  >
    <form
      @submit.prevent="handleSubmit(login())"
      class="flex justify-between w-full"
    >
      <!-- Submission error -->
      <section class="flex flex-col">
        <ValidationProvider
          class="flex flex-col"
          slim
          mode="eager"
          name="Full name"
          rules="required|min:3"
          v-slot="{errors}"
        >
          <!-- Email error message -->
          <span :class="errorClass">{{
            errors[0] ? errors[0] : '*Full name'
          }}</span>

          <!-- Email container -->
          <!-- Email input field -->
          <input
            id="fullname"
            ref="fullname"
            v-model="fullname"
            type="text"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Full name"
          />
        </ValidationProvider>

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

          <span :class="errorClass">{{
            errors[0] ? errors[0] : '*Email'
          }}</span>

          <!-- Email container -->
          <!-- Email input field -->
          <input
            id="email"
            ref="emailref"
            @keydown.enter="onEmailSubmit"
            v-model="email"
            type="email"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Email"
          />
        </ValidationProvider>

        <ValidationProvider
          class="flex flex-col"
          slim
          mode="eager"
          name="Password"
          rules="required|min:8"
          v-slot="{errors}"
        >
          <!-- Password error message -->
          <span :class="errorClass">{{
            errors[0] ? errors[0] : '*Password'
          }}</span>

          <!-- Password input field -->
          <input
            ref="passwordref"
            v-model="password"
            type="password"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Your password"
          />
        </ValidationProvider>

        <ValidationProvider
          class="flex flex-col"
          slim
          mode="eager"
          name="Confirm password"
          rules="required|confirmed:Password"
          v-slot="{errors}"
        >
          <!-- Password error message -->
          <span :class="errorClass">{{
            errors[0] ? errors[0] : '*Confirm password'
          }}</span>

          <!-- Password input field -->
          <input
            ref="passwordconfirmref"
            v-model="passwordconfirm"
            type="password"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Confirm password"
          />
        </ValidationProvider>
      </section>

      <section class="flex flex-col items-center pl-10">
        <ValidationProvider
          class="flex flex-col"
          slim
          mode="eager"
          name="Company"
          rules=""
          v-slot="{errors}"
        >
          <!-- Company error message -->
          <span :class="errorClass">{{
            errors[0] ? errors[0] : 'Company'
          }}</span>

          <!-- Company input field -->
          <input
            ref="company"
            v-model="company"
            type="text"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Company"
          />
        </ValidationProvider>

        <ValidationProvider
          class="flex flex-col"
          slim
          mode="eager"
          name="Country"
          rules="required"
          v-slot="{errors}"
        >
          <!-- Country error message -->
          <span :class="errorClass">{{
            errors[0] ? errors[0] : '*Country'
          }}</span>

          <!-- Country input field -->
          <input
            ref="country"
            v-model="country"
            type="text"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Country"
          />
        </ValidationProvider>

        <ValidationProvider
          class="flex mt-4 w-72"
          slim
          mode="eager"
          name="Agreement"
          rules="required"
          v-slot="{errors}"
        >
               <input
              ref="agreed"
              v-model="agreed"
              type="checkbox"
              :class="errors[0] ? checkInputClassAlt : checkInputClass"
              class="mr-2"
            />
          <section class="flex flex-col">
     
            <p class="text-sm text-black-500">
              <span v-if="errors[0]" :class="errorClass">{{ errors[0]  }}<br /></span>
              
              By signing up you agree to our
              <span class="text-info-600"
                ><router-link to="/">Terms & Conditions</router-link></span
              >
              and
              <span class="text-info-600"
                ><router-link to="/">Privacy Policy</router-link></span
              >
            </p>
          </section>

          <!-- Password input field -->
        </ValidationProvider>
        <div class="flex flex-col w-full pt-3 mx-4 mt-1">
          <btn text="Sign up" size="md" v-on:click="handleSubmit(login())" />
        </div>
      </section>
    </form>
    <span class="h-2 text-sm text-danger text-semibold font-head">{{
      submitError
    }}</span>
  </ValidationObserver>
</template>

<script>
import Button from '@/components/buttons/Btn';

export default {
  name: 'RegistrationForm',

  components: {
    btn: Button,
  },

  data() {
    return {
      isModalOpen: false,
      inputClass:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 lg:w-72',
      inputClassAlt:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-danger-500 px-2.5 py-1 lg:w-72',
      checkInputClass:
        'mt-0.5 mb-1.5 border-2 border-opacity-30 border-primary-300  px-3 py-1 mt-0.5 h-4',
      checkInputClassAlt:
        'mt-0.5 mb-1.5 border-2 border-opacity-60 border-danger-500 bg-primary-300 px-3 py-1  h-4',
      errorClass: 'h-3 mb-0.5 text-xs text-black-200',

      submitError: '',
      errors: [],
      email: null,
      password: null,
      country: null,
      fullname: null,
      company: null,
      agreed: null,
    };
  },

  mounted() {},

  methods: {
    openModal() {},

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
          return;
        }

        // Open modal; Reminder for the user to confirm their email.
        this.isModalOpen = true;

        // Resetting Values
        (this.email = this.password = this.fullname = this.country),
          (this.company = '');
        this.agreed = false;

        // Wait until the models are updated in the UI
        this.$nextTick(() => {
          this.$refs.form.reset();
        });

        if (success) {
          console.log('Login method form valid');
          const user = {
            email: this.email,
            password: this.password,
          };

          this.$store
            .dispatch('login', user)
            .then(() => this.$router.push('/dashboard'))
            .catch(err => {
              this.submitError =
                'Oh no, our servers went on strike! Please try again in a few minutes ';

              this.submitError = err.response.data.detail;
              console.log(this.submitError);
            });
        }
      });
    },
  },
};
</script>