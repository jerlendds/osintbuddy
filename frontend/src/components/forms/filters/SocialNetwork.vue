<template>
  <ToggleDropdown
    :title="title"
    :description="description"
  >
    <div class="flex flex-col">
      <div class="flex flex-col ">
        <p class="text-black-400 text-sm pt-2 text-semibold font-head">
          Full name
        </p>
        <input type="text" :class="inputClass" placeholder="Full name" />
        <p class="text-black-400 pt-2 text-sm text-semibold font-head">
          Country
        </p>
        <input type="text" :class="inputClass" placeholder="Country" />
        <p class="text-black-400 pt-2 text-sm text-semibold font-head">
          State
        </p>
        <input type="text" :class="inputClass" placeholder="State/Province" />

        <p class="text-black-400 pt-2 text-sm text-semibold font-head">
          City
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
  name: 'SocialNetwork',

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
      title: 'Social Networks',
      description: "This filter allows you to control the social networks that will be searched. When there's no data entered a broad search of all platforms will be performed, otherwise an exhaustive search will run for the provided platform fields",

      inputClass:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 ',
      inputClassOne:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 lg:w-64',
    };
  },
};
</script>
