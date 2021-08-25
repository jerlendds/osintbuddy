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
              <component :is="twitterIcon" class="twitter pr-2" />
              <h2 class="font-semibold font-body text-black-500">Twitter</h2>
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
              @mouseover="showUrl = true"
              @mouseleave="showUrl = false"
            >
              <p
                v-if="domain_value"
                class=" text-sm hover:underline text-primary-400  overflow-ellipsis whitespace-wrap max-w-lg leading-6 font-body "
              >
                {{ domainValue }}
              </p>
            </a>
          </section>
        </section>
      </div>
      <section
          class="flex lg:flex-row flex-col pb-1 lg:justify-between items-center font-head  border-t-2 border-black-100 border-opacity-10 bg-white-100"
      >
        <h3 class="text-gray-400 px-3 mr-1">Actions</h3>

        <div class="flex items-center justify-center w-full lg:my-0 my-2 lg:px-1">
          <btn
              size="xs"
              color="bg-white-500"
              colortext="text-gray-100 hover:text-black-400"
              text="Copy URL"
          />
        </div>

        <div class="flex items-center justify-center w-full lg:my-0 my-2 lg:px-1">
          <btn
              size="xs"
              color="bg-white-500"
              colortext="text-gray-100 hover:text-black-400"
              text="Screenshot"
          />
        </div>
        <div class="flex items-center justify-center w-full lg:my-0 my-2 lg:px-1">
          <btn
              size="xs"
              color="bg-white-500"
              colortext="text-gray-100 hover:text-black-400"
              text="Archive Result"
          />
        </div>


      </section>
      <section
        class="flex lg:flex-row flex-col lg:justify-between items-center font-head pt-1 border-white border-opacity-10 bg-white-100"
      >
        <h3 class="text-gray-400 px-3">Analyse</h3>
        <div class="flex  items-center justify-center w-full lg:my-0 my-2 lg:px-1">
          <btn
            text="All tweets"
            size="xs"
            color="bg-white-500"
            colortext="text-gray-100 hover:text-black-400"
          />
        </div>
        <div class="flex items-center justify-center w-full lg:my-0 my-2 lg:px-1">
          <btn
            size="xs"
            color="bg-white-500"
            colortext="text-gray-100 hover:text-black-400"
            text="Keyword tweets"
          />
        </div>

        <div class="flex items-center justify-center w-full lg:my-0 my-2 lg:px-1">
          <btn
            size="xs"
            color="bg-white-500"
            colortext="text-gray-100 hover:text-black-400"
            text="Followers"
          />
        </div>

        <div class="flex items-center justify-center w-full py-1 lg:py-0 lg:px-1">
          <btn
            size="xs"
            color="bg-white-500"
            colortext="text-gray-100 hover:text-black-400 "
            text="Following"
          />
        </div>
        <button
          @click="toggleSave"
          :class="isSaved ? 'px-2 ' : '  w-full'"
          class="mt-3 px-0 transition-all duration-150 lg:mt-0 py-1 ml-1 lg:py-0 flex items-center bg-primary-300 shadow-primary-6 hover:bg-primary-200 h-full  justify-center rounded-br "
        >
          <span class="text-white-200 font-head">{{
            isSaved ? '' : '&nbsp;&nbsp;Save&nbsp;'
          }}</span>
          <component class="text-white icon-2x" :is="setSaveIcon" />
        </button>
      </section>

    </section>
  </section>
</template>

<script>
import Bookmark from 'vue-material-design-icons/Bookmark';
import BookmarkOutline from 'vue-material-design-icons/BookmarkOutline';
import ChevronRight from 'vue-material-design-icons/ChevronRight';
import Twitter from 'vue-material-design-icons/Twitter';
import SimpleBtn from '@/components/buttons/SimpleBtn.vue';

export default {
  name: 'TwitterCard',

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

    domainValue() {
      if (!this.showUrl) {
        return this.domain_value;
      } else {
        return this.url;
      }
    },

    rightIcon() {
      return ChevronRight;
    },
    twitterIcon() {
      return Twitter;
    },
  },
};
</script>

<style>
.twitter {
  color: #1da1f2;
}
.material-design-icon.icon-2x {
  height: 1.4rem;
  width: 1.4rem;
}

.material-design-icon.icon-2x > .material-design-icon__svg {
  height: 1.4rem;
  width: 1.4rem;
}
</style>
