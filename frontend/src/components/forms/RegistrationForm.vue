<template>
  <ValidationObserver
    v-slot="{handleSubmit}"
    ref="form"
    slim
    class="flex flex-col"
  >
    <form
      class="flex justify-between w-full"
      @submit.prevent="handleSubmit(login)"
    >
      <!-- Submission error -->
      <section class="flex flex-col">
        <ValidationProvider
          v-slot="{errors}"
          class="flex flex-col"
          slim
          mode="eager"
          name="Full name"
          rules="required|min:3"
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
            class="bg-white-100"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Full name"
          />
        </ValidationProvider>

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

          <span :class="errorClass">{{
            errors[0] ? errors[0] : '*Email'
          }}</span>

          <!-- Email container -->
          <!-- Email input field -->
          <input
            id="email"
            ref="emailref"
            v-model="email"
            class="bg-white-100"
            type="email"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Email"
            @keydown.enter="onEmailSubmit"
          />
        </ValidationProvider>

        <ValidationProvider
          v-slot="{errors}"
          class="flex flex-col"
          slim
          mode="eager"
          name="Password"
          rules="required|min:8"
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
            class="bg-white-100"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Your password"
          />
        </ValidationProvider>

        <ValidationProvider
          v-slot="{errors}"
          class="flex flex-col"
          slim
          mode="eager"
          name="Confirm password"
          rules="required|confirmed:Password"
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
            class="bg-white-100"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Confirm password"
          />
        </ValidationProvider>
      </section>

      <section class="flex flex-col items-center pl-10">
        <ValidationProvider
          v-slot="{errors}"
          class="flex flex-col"
          slim
          mode="eager"
          name="Company"
          rules=""
        >
          <!-- Company error message -->
          <span :class="errorClass">{{
            errors[0] ? errors[0] : 'Company'
          }}</span>

          <!-- Company input field -->
          <input
                  ref="company"
            v-model="company"
            class="bg-white-100"
            type="text"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Company"
          />
        </ValidationProvider>

        <ValidationProvider
          v-slot="{errors}"
          class="flex flex-col"
          slim
          mode="eager"
          name="Country"
          rules="required"
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
            class="bg-white-100"
            :class="errors[0] ? inputClassAlt : inputClass"
            placeholder="Country"
          />
        </ValidationProvider>

        <ValidationProvider
          v-slot="{errors}"
          class="flex mt-4 w-72"
          slim
          mode="eager"
          name="Agreement"
          rules="required"
        >
               <input
              ref="agreed"
              v-model="agreed"
              type="checkbox"
              :class="errors[0] ? checkInputClassAlt : checkInputClass"
              class="mr-2 bg-white-100"
            />
          <section class="flex flex-col">

            <p class="text-sm text-white-500">
              <span v-if="errors[0]" :class="errorClass">{{ errors[0]  }}<br /></span>

              By signing up you agree to our
              <span class="text-submarine-400"
                ><router-link class="hover:underline" to="/">Terms & Conditions</router-link></span
              >
              and
              <span class="text-submarine-400"
                ><router-link class="hover:underline" to="/">Privacy Policy</router-link></span
              >
            </p>
          </section>

          <!-- Password input field -->
        </ValidationProvider>
        <div class="flex flex-col w-full pt-3 mx-4 mt-1">
            <button class="font-medium  hover:bg-submarine-600 text-white transition-all shadow-2 duration-200 font-head h-2 text-sm h-10
                            bg-submarine text-semibold font-head"
                    @click="handleSubmit(login)">
                   Sign Up
            </button>

        </div>
      </section>
    </form>
    <span class="">{{
      submitError
    }}</span>
  </ValidationObserver>
</template>

<script>

export default {
  name: 'RegistrationForm',

  components: {
  },

  data() {
    return {
      isModalOpen: false,
      inputClass:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-black-100  px-2.5 py-1 lg:w-72',
      inputClassAlt:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-danger-500 px-2.5 py-1 lg:w-72',
      checkInputClass:
        'mt-0.5 mb-1.5 border-2 border-opacity-30 border-black-100  px-3 py-1 mt-0.5 h-4',
      checkInputClassAlt:
        'mt-0.5 mb-1.5 border-2 border-opacity-60 border-danger-500 bg-primary-300 px-3 py-1  h-4',
      errorClass: 'h-3 mb-0.5 text-xs text-bluegreen-100',

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