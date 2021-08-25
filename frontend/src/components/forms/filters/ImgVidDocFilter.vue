<template>
  <ToggleDropdown
      :title="title"
      :description="description"
  >
    <div class="flex flex-col">
      <div class="flex flex-col ">

        <p class="text-black-400 text-sm text-semibold pt-2 font-head">
          Username
        </p>
        <input type="text" :class="inputClass" placeholder="Username" />
        <p class="text-black-400 text-sm pt-2 text-semibold font-head">
          Full name
        </p>

        <input type="text" :class="inputClass" placeholder="City" />
        <p class="text-black-400 pt-2 text-sm text-semibold font-head">
          Phone number
        </p>
        <input type="text" :class="inputClass" placeholder="Phone number" />
        <p class="text-black-400 pt-2 text-sm text-semibold font-head">
          Email
        </p>
        <input type="text" :class="inputClass" placeholder="Email" />
      </div>
    </div>
  </ToggleDropdown>
</template>

<script>
import ToggleDropdown from '@/components/dropdowns/ToggleDropdown';
import PlusBoxOutline from 'vue-material-design-icons/PlusBoxOutline';

export default {
  name: 'ImgVidDocFilter',

  components: {
    ToggleDropdown,
  },

  computed: {
    addIcon() {
      return PlusBoxOutline;
    },
  },

  props: {
    variable: {
      default: '',
      value: String
    }
  },

  data() {
    return {
      title: 'Google Images / Videos / Docs ',
      description: "Images / Videos / Docs",

      inputClass:
          'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 ',
      inputClassOne:
          'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 lg:w-64',
    };
  },
};
</script>
