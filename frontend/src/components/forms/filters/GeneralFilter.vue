<template>
  <ToggleDropdown
    :title="title"
    :description="description"
  >
    <div class="flex flex-col">
      <div class="flex flex-col ">
        <div class="flex items-center justify-between pb-5">
          <p class="text-black-300 text-sm  font-head">
            Enable all search filters
          </p>
          <input type="checkbox" :checked="true" :class="inputClass" placeholder="Full name" />
        </div>

        <p class="text-black-400 text-sm  text-semibold font-head">
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
  name: 'GeneralFilter',

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
      title: 'General',
      description: "A general information search returning broad results. The data fields below may be recurring between other filters. Data entered here may be used as defaults in recurring fields",

      inputClass:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 ',
      inputClassOne:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 lg:w-64',
    };
  },
};
</script>
