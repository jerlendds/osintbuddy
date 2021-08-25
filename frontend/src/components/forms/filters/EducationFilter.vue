<template>
  <ToggleDropdown
    :title="title"
    :description="description"
  >
    <div class="flex flex-col">
      <div class="flex flex-col ">
        <p class="text-black-400 pt-2 text-sm text-semibold font-head">Full name
        </p>
        <input type="text" :class="inputClass" placeholder="Full name" />
        <p class="text-black-400 pt-2 text-sm text-semibold font-head">
          School address
        </p>
        <input type="text" :class="inputClass" placeholder="Address" />
        <p class="text-black-400 pt-2 text-sm text-semibold font-head">
          School name
        </p>
        <input type="text" :class="inputClass" placeholder="Name" />
        <div class="flex flex-col pt-2">
          <p class="text-black-400  text-sm text-semibold font-head">
            School website(s)
          </p>
          <div class="flex items-center " :class="inputClassOne">
            <input
              type="text"
              placeholder="URL"
              class="placeholder-black-100"
            />
            <component :is="addIcon" class="text-primary-100" />
          </div>
        </div>
        <p class="text-black-400 pt-2 text-sm text-semibold font-head">
          Graduation year
        </p>
        <input type="text" :class="inputClass" placeholder="Year" />
      </div>
    </div>
  </ToggleDropdown>
</template>

<script>
import ToggleDropdown from '@/components/dropdowns/ToggleDropdown';
import PlusBoxOutline from 'vue-material-design-icons/PlusBoxOutline';

export default {
  name: 'EducationFilter',

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
      title: 'Education',
      description: "This filter tries to discover where your target attended school. If there's no data below, the search will return broad and untargeted results",

      inputClass:
          'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 ',
      inputClassOne:
        'placeholder-black-100 mt-0.5 mb-1.5 border-2 border-opacity-60 border-primary-300  px-2.5 py-1 ',
    };
  },
};
</script>
