<template>
  <section class="flex">
    <section class="flex flex-col  border-l-2 border-primary-200 px-3 py-2">
      <div class="flex flex-col">
        <div>

        </div>
        <div class="flex items-center px-0.5">
          <component class="pr-3 py-0.5 text-primary-400" :is="twitterIcon" />

            <a class=" font-head text-primary-400  flex" :href="url" @mouseover="showUrl = true" @mouseleave="showUrl = false">
              <h2  class="font-semibold pr-1.5 text-sm">
              {{ domain_type }}
              </h2><span v-if="domain_value" class="font-light text-sm hover:underline"> {{domainValue}} </span>
            </a>
        </div>
        <div class="flex flex-col max-w-4xl mt-2">
          <h3 class="pr-2 leading-3 text-black-100 font-light text-sm">Title</h3>
          <h2 class="text-black-500 max-w-sm"> {{ title }} </h2>
        </div>
        <div class="flex flex-col max-w-sm mt-2">
          <h3 class="pr-2 leading-3 text-black-100 font-light text-sm">Description</h3>
          <h2 class="text-black-500"> {{ description }}</h2>
        </div>
      </div>
    </section>

  </section>
</template>

<script>
import ChevronRight from 'vue-material-design-icons/ChevronRight'
import Twitter from 'vue-material-design-icons/Twitter'

export default {
  name: "ExperimentTwo",

  created() {
  },
  
  data() {
    return {
      showUrl: false,

      status: "Match",
      domain_type: "Twitter",
      domain_value: "_jackooo",
      url: "twitter.com/_jackooo",
      title: "jackie    (@_jackooo) | Twitter",
      description: "De seneste tweets fra jackie    (@_jackooo). Love Yourz  . 1 Cor 16:14 Coach.",
      img_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRgLFXsre7OPzA4z40xgTE6yep-dtU5JNDGDRn5ZS9K71vDTq4f7IzmUEek"
    }
  },

  computed: {
    domainValue() {
      if (!this.showUrl) {
        return this.domain_value
      } else {
        return this.url
      }
    },

    rightIcon() {
      return ChevronRight
    },
    twitterIcon() {
      return Twitter
    }
  }
}
</script>