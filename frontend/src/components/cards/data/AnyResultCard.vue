<template>
  <section class="flex shadow-7 bg-navy-700 relative my-4">
    <section
      :class="
        isSaved
          ? 'border-l-4 border-submarine-100'
          : 'border-l-2 border-submarine-200'
      "
      class="flex flex-col w-full rounded-r border-l-2 transition-all duration-150 border-submarine-400 hover:border-submarine-300 shadow-6 transition-all duration-75"
    >
      <div class="flex flex-col">
        <section class="flex justify-between items-start mt-2">
          <section class="flex flex-col  pl-3 pr-1 w-full">
            <section class="flex justify-between ">
              <h2
                class="text-blue-100 leading-6 font-body underline font-medium"
              >
                {{ source.title }}
              </h2>
            </section>
            <section class="flex flex-col mt-1">
              <div class="flex items-center w-full">
                <h2
                  class="text-white-900 break-all leading-6 font-medium font-body text-sm"
                >
                  {{ source.description }}
                </h2>
              </div>
            </section>
          </section>
        </section>
        <section class="flex justify-between items-end pb-2 mt-2 px-3">
          <a
            class="font-head break-all flex text-sm hover:underline text-submarine-400  overflow-ellipsis whitespace-wrap leading-5 font-body "
            :href="source.url"
          >
            {{ source.url }}
          </a>
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

export default {
  name: 'AnyResultCard',

  components: {
  },
  props: {
    source: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      isSaved: false,
      showUrl: false,
    };
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
  },

  methods: {
    toggleSave() {
      this.isSaved = !this.isSaved;
    },
  },
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
