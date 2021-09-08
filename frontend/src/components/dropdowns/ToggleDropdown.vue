<template>
  <section   :class=" isOpen ? 'border-primary-100 shadow-6 border-l-8 my-2 bg-white-100 hover:bg-white-200' : 'border-primary-200 hover:border-primary-100'" class="px-4 border-l-4 hover:bg-white-100 focus:bg-white-300 flex flex-col pt-1 ease-in-out transition-all duration-75">
    <section class="w-full flex justify-between  items-center pt-1 " :class="{'pl-2':isOpen}">
      <h3 class="text-lg  text-black-500">{{title}}</h3>
      <button @click="toggle" style="transition: transform .075s ease-in;"  :class="{'rotate-180':isOpen}" class="transform rotate-0 " >
        <component  :is="iconDown"></component>
      </button>
    </section>

    <section :class="isOpen ? 'flex visible border-b-2 border-white-100 opacity-100 flex-col px-2':'invisible h-0 opacity-0 py-0'" class="pb-2">
      <div class="py-2">
        <h3 class="text-sm text-black-300  font-medium pb-3">{{description}}</h3>
        <div class="flex items-center justify-between pt-4">
          <p class="text-black-300 text-sm  font-head pr-2 ">
            Enable {{ searchTitle }} search
          </p>
          <input type="checkbox" :checked="true" value="1" :class="inputClass" placeholder="Full name" />
        </div>
      </div>
      <slot></slot>
    </section>
  </section>
</template>

<script>
import ChevronDown from 'vue-material-design-icons/ChevronDown'

export default {
  name: "ToggleDropdown",

  components: {

  },

  props: {
    description: {
      default: "Hello, Description!",
      value: String
    },

    title: {
      default: "Hello, Title!",
      value: String
    }
  },

  data() {
    return {
      isOpen: false,
      inputClass: '',
    }
  },

  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    }
  },

  computed: {
    iconDown() {
      return ChevronDown
    },
    searchTitle() {
      return String(this.title).toLowerCase()
    }
  }
}
</script>