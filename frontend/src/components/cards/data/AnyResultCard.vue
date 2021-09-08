<template>
  <section class="flex shadow-9 bg-white-100 relative">
    <section
        :class="
        isSaved
          ? 'border-l-4 border-primary-100'
          : 'border-l-2 border-primary-200'
      "
        class="flex flex-col w-full rounded-r border-l-2 border-primary-200 shadow-6 transition-all duration-75"
    >
      <div class="flex flex-col">
        <section class="flex justify-between items-start mt-2">
          <section class="flex flex-col mt-2 pl-3 pr-1 w-full">
            <div class="flex items-center pb-2 w-full">
              <component :is="cloudIcon" class="text-primary-300 pr-2" />
              <h2 class="font-semibold font-body text-black-500">CSE Result</h2>
            </div>
            <h2
                class="text-black-500 leading-6 font-body underline font-medium"
            >
              {{ title }}
            </h2>
            <section class="flex flex-col mt-1">
              <h2
                  class="text-black-300 leading-6 font-medium font-body text-sm"
              >
                {{ description }}
              </h2>
            </section>
          </section>
          <section class="lg:visible lg:relative hidden invisible">
            <div class="h-20 w-20 ">
              <img alt="" class="w-full h-full" :src="img_url" />
            </div>
          </section>
        </section>

        <section class="flex justify-between items-end pb-3 mt-2 px-3">
          <section>
            <a
                class=" font-head  flex "
                :href="url"
            >
              <p
                  class=" text-sm hover:underline text-primary-400  overflow-ellipsis whitespace-wrap max-w-lg leading-6 font-body "
              >
                {{ domain_value }}
              </p>
            </a>
          </section>
        </section>
      </div>


    </section>
  </section>
</template>

<script>
import Bookmark from 'vue-material-design-icons/Bookmark';
import BookmarkOutline from 'vue-material-design-icons/BookmarkOutline';
import ChevronRight from 'vue-material-design-icons/ChevronRight';
import Cloud from 'vue-material-design-icons/Cloud';
import SimpleBtn from '@/components/buttons/SimpleBtn.vue';

export default {
  name: 'AnyResultCard',

  components: {
    btn: SimpleBtn,
  },

  props: {
    status: {
      default: null,
      value: String,
    },
    domain_type: {
      default: null,
      value: String,
    },
    domain_value: {
      default: null,
      value: String,
    },
    url: {
      default: null,
      value: String,
    },
    title: {
      default: null,
      value: String,
    },
    description: {
      default: null,
      value: String,
    },
    img_url: {
      default: null,
      value: String,
    },
  },

  data() {
    return {
      isSaved: false,
      showUrl: false,
    };
  },

  methods: {
    toggleSave() {
      this.isSaved = !this.isSaved;
    },
  },

  computed: {
    setSaveIcon() {
      if (this.isSaved) {
        return this.solidBookmarkIcon;
      } else {
        return this.bookmarkIcon;
      }
    },
    solidBookmarkIcon() {
      return Bookmark;
    },
    bookmarkIcon() {
      return BookmarkOutline;
    },
    rightIcon() {
      return ChevronRight;
    },
    cloudIcon() {
      return Cloud;
    },
  }
};
</script>

<style>

.material-design-icon.icon-2x {
  height: 1.4rem;
  width: 1.4rem;
}

.material-design-icon.icon-2x > .material-design-icon__svg {
  height: 1.4rem;
  width: 1.4rem;
}
</style>
