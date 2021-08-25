<template>
  <main class="flex lg:flex-row flex-col w-full ">
    <section
      class="max-w-2xl flex flex-col lg:pr-4 w-full lg:ml-2 h-full overflow-y-scroll scroll scroll-color"
    >
      <section class=" h-10 w-full bg-white ">
        <div class="bg-white  fixed ">
          <tabbed-nav class="z-50" />
        </div>
      </section>

      <section class="w-full pt-10 z-0">
        <ul class=" pb-2 px-3 w-full ">
          <li  class="py-1 w-full">
            <TwitterCard
              :status="tests[0].status"
              :domain_type="tests[0].domain_type"
              :domain_value="tests[0].domain_value"
              :url="tests[0].url"
              :title="tests[0].title"
              :description="tests[0].description"
              :img_url="tests[0].img_url"
            />
          </li>
          <li   class="py-1 w-full">
            <AnyResultCard
                :status="tests[1].status"
                :domain_type="tests[1].domain_type"
                :domain_value="tests[1].domain_value"
                :url="tests[1].url"
                :title="tests[1].title"
                :description="tests[1].description"
                :img_url="tests[1].img_url"
            />
          </li>
        </ul>
      </section>
    </section>
    <section
      class="px-2 w-full max-w-sm flex flex-col m border-l-2 border-primary-300  shadow-2"
    >
      <section class="">
        <h3 class="text-black-600 font-head text-lg leading-6 py-4 px-4">
          Set and optimize filters for your target
        </h3>
      </section>
      <FilterForms />


    </section>
  </main>
</template>

<style></style>

<script>
import AnyResultCard from "@/components/cards/data/AnyResultCard";
import FilterForms from "@/components/forms/FilterForms";
import TabbedNav from '@/components/navs/TabbedNav';
import TwitterCard from '@/components/cards/data/TwitterCard';

export default {
  name: 'Dashboard',

  components: {
    AnyResultCard,
    FilterForms,
    TwitterCard,
    TabbedNav,
  },

  data() {
    return {
      tests: [
        {
          status: 'Match',
          domain_type: 'Twitter',
          domain_value: 'Twitter › kikehndez › status',
          url: 'https://twitter.com/kikehndez/status/658493902610018304',
          title:
            'Enrique Hernández on Twitter: "We came to shake our hips here at ...',
          description:
            'Oct. 25, 2015  ... 25 Oct 2015. 33 Retweets; 276 Likes; Jill ✨ · ivana ·  Davidson · Merary Lola Lobos · lena   · Jackie Loeza · Jasmine · Hannah.',
          img_url:
            'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQK9yM0MhPI5ioF-YW00kNEOBqVpfcNcyES_jIMggQvejqRdLwWPh8XfDdf',
        },
        {
          status: 'Match',
          domain_type: 'Twitter',
          domain_value: 'Imperial Valley Press Online › virtual_graduations › brawley-union-high-school',
          url: 'https://www.ivpressonline.com/.../article_d5ecc254-a792-11ea-9bbd- a7b225667833.html',
          title:
              'Brawley Union High School | Virtual Graduations | ivpressonline.com',
          description: 'Jun. 5, 2020  John Cummings, Anamaria Curiel,  Currier. Brandon De Dios ... Jacob  , Joshua Salazar, Rayan Salazar Rios. Yaxaira Salazar- ...',
          img_url:
              'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQK9yM0MhPI5ioF-YW00kNEOBqVpfcNcyES_jIMggQvejqRdLwWPh8XfDdf',
        },

      ],
    };
  },

  mounted() {},
};
</script>
