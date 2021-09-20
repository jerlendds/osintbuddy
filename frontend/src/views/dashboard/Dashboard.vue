<template>
  <main class="flex flex-col w-full ">

    <section class="section py-2">
      <SearchBarAlternative />
    </section>
    <section class="section">
      <ul>
        <li class="py-2"  v-for="result in results" :key="result.title">
          <AnyResultCard
                         :domain="result.domain"
                         :url="result.url"
                         :title="result.title"
                         :description="result.description"
                         :imgUrl="result.imgUrl"
          />
        </li>
      </ul>


    </section>
  </main>
</template>

<style>
.section {
  @apply  mx-4 sm:mx-6 md:mx-8 lg:mx-20 py-3
}

</style>

<script>
import AnyResultCard from "@/components/cards/data/AnyResultCard";
import TwitterCard from '@/components/cards/data/TwitterCard';
import SearchBarAlternative from "../../components/forms/SearchBarAlternative";


export default {
  name: 'Dashboard',

  components: {
    SearchBarAlternative,
    AnyResultCard
  },

  data() {
    return {
      results: [{'title': 'The Botanical Arts City / City of St. Albert','description': "St. Albert is one of Alberta's most beautiful communities with extensive parks, a rich heritage of arts and culture, and a strong commitment to building a\xa0...", 'url': 'https://stalbert.ca/','domain': 'stalbert.ca','imgUrl': 'https://static.stalbert.ca/site/templates/img/opengraph.png'}, {'title': 'Albert College: Home', 'description': "A student's experience of the 5 A's is integral to an Albert College education. We strive to inspire excellence in all 5 of the A's, ensuring students\xa0...", 'url': 'https://www.albertcollege.ca/', 'domain': 'www.albertcollege.ca', 'imgUrl': 'https://resources.finalsite.net/images/f_auto,q_auto/v1611599099/albertcollegeca/cwi2db30nfu5fhitsr9d/seniorschoolscience.jpg'}, {'title': 'Albert, Prince Consort - Wikipedia', 'description': 'Prince Albert of Saxe-Coburg and Gotha was the consort of Queen Victoria from their marriage on 10 February 1840 until his death in 1861. Albert was born in\xa0...', 'url': 'https://en.wikipedia.org/wiki/Albert,_Prince_Consort', 'domain': 'en.wikipedia.org', 'imgUrl': 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Albert%2C_Prince_Consort_by_JJE_Mayall%2C_1860_crop.png'}, {'title': 'Albert Pujols Stats | Baseball-Reference.com', 'description': 'Albert Pujols. Positions: First Baseman, Leftfielder and Third Baseman. Bats: Right • Throws: Right. 6-3, 235lb (190cm, 106kg).', 'url': 'https://www.baseball-reference.com/players/p/pujolal01.shtml', 'domain': 'www.baseball-reference.com', 'imgUrl': 'http://ssref.net/scripts/image_resize.cgi?min=200&url=https://www.baseball-reference.com/req/202108020/images/headshots/e/e14fcab4_mlbam.jpg'}, {'title': 'St. Albert Public Schools: Home', 'description': 'More than 8,600 students are enrolled in St. Albert Public Schools. From Preschool to Grade 12, our students learn and succeed in programs that are\xa0...', 'url': 'https://www.spschools.org/', 'domain': 'www.spschools.org', 'imgUrl': 'https://p19cdn4static.sharpschool.com/UserFiles/Servers/Server_969709/Image/Quicklinks/powerschool-icon.png'}, {'title': 'St. Albert Food Bank and Community Village - An Apple a Day Since ...', 'description': 'Thank you to the people of St. Albert and our partners for making a difference. Help us aid our food bank and community by donating today.', 'url': 'https://stalbertfoodbankandcommunityvillage.com/', 'domain': 'stalbertfoodbankandcommunityvillage.com', 'imgUrl': 'https://stalbertfoodbankandcommunityvillage.com/wp-content/uploads/2018/01/food_donations.jpg'}, {'title': 'Art Gallery of St. Albert', 'description': 'Albert Photography Club and the Visual Arts Studio Association. Fostering a sense of place, these artists will welcome all who visit – Home. Image credit:\xa0...', 'url': 'http://artgalleryofstalbert.ca/', 'domain': 'artgalleryofstalbert.ca', 'imgUrl': 'http://artgalleryofstalbert.ca/wp-content/uploads/sites/2/2020/03/ARTNOOKATHOME.LOGO-01-466x600.jpg'}, {'title': 'Arts and Heritage St. Albert', 'description': "Art Gallery of St. Albert. We are continuing with our commitment to provide you with exceptional arts and heritage experiences. We know that's what you\xa0...", 'url': 'https://artsandheritage.ca/', 'domain': 'artsandheritage.ca', 'imgUrl': 'https://artsandheritage.ca/wp-content/uploads/2021/09/Our-Songs-slider.jpg'}, {'title': 'Greater St. Albert Catholic Schools', 'description': 'Greater St. Albert Catholic Schools is a welcoming learning community that awakens the hearts and minds of students while educating and nurturing each to learn,\xa0...', 'url': 'https://www.gsacrd.ab.ca/', 'domain': 'www.gsacrd.ab.ca', 'imgUrl': 'https://www.gsacrd.ab.ca/uploads/footerlogo1.png'}, {'title': 'google-research/albert: ALBERT: A Lite BERT for Self ... - GitHub', 'description': 'ALBERT is "A Lite" version of BERT, a popular unsupervised language representation learning algorithm. ALBERT uses parameter-reduction techniques that allow for\xa0...', 'url': 'https://github.com/google-research/albert', 'domain': 'github.com', 'imgUrl': 'https://opengraph.githubassets.com/67471761087e15ba712fc10e0563a7458be59f8bf8617d80b0cd3032e2a63e9a/google-research/albert'}, {'title': 'Albert Pujols Stats, Fantasy & News | MLB.com', 'description': 'Albert Pujols Bio · Fullname: Jose Alberto Pujols · Nickname: La Maquina · Born: 1/16/1980 in Santo Domingo, Dominican Republic · Draft: 1999, St. Louis Cardinals,\xa0...', 'url': 'https://www.mlb.com/player/albert-pujols-405395', 'domain': 'www.mlb.com', 'imgUrl': 'https://www.mlbstatic.com/team-logos/share/119.jpg'}, {'title': 'Your Albert - Workplace Engagement Solutions', 'description': 'Albert is the leading internal communication and engaging app for deskless workers. Our solution can help you take employee engagement to the next level.', 'url': 'https://youralbert.com/', 'domain': 'youralbert.com', 'imgUrl': 'https://youralbert.com/newsite/wp-content/uploads/2021/06/easy-to-deploy-albert.jpeg'}, {'title': 'St. Albert & Sturgeon Primary Care Network | To deliver the best ...', 'description': 'Albert and Sturgeon PCN provides comprehensive and collaborative health care through its 62 family physicians in 18 clinics. Our team of health care\xa0...', 'url': 'https://www.saspcn.com/', 'domain': 'www.saspcn.com', 'imgUrl': 'https://www.saspcn.com/wp-content/uploads/2016/05/logo_2x.jpg'}, {'title': 'Handcrafted Kitchen & Bath Fixtures | Victoria + Albert', 'description': 'Founded in Shropshire, England, Victoria + Albert® has established a worldwide reputation for creating beautiful freestanding bathtubs and basins.', 'url': 'https://houseofrohl.com/victoria-and-albert/', 'domain': 'houseofrohl.com', 'imgUrl': 'https://cdn11.bigcommerce.com/s-80sqzb3h0c/images/stencil/450x322/z/img_va_nav_bath_06__73938.original.jpg'}, {'title': 'Saint Albert Seniors Association - Red Willow Place', 'description': 'The St. Albert Seniors Association is a gathering place, a resource centre, and a recreation and arts centre for people aged fifty and over in St.Albert.', 'url': 'https://stalbertseniors.ca/', 'domain': 'stalbertseniors.ca', 'imgUrl': 'https://stalbertseniors.ca/wp-content/uploads/2021/05/St.AlbertSeniorsAssoc.png'}, {'title': 'Albert Einstein - Quotes, Death & Facts - Biography', 'description': 'Albert Einstein was a physicist who developed the general theory of relativity. He is considered one of the most influential scientists of the 20th century.', 'url': 'https://www.biography.com/scientist/albert-einstein', 'domain': 'www.biography.com', 'imgUrl': 'https://www.biography.com/.image/t_share/MTc5ODc5NjY5ODU0NjQzMzIy/gettyimages-3091504.jpg'}, {'title': 'City of Prince Albert', 'description': "City of Prince Albert\\'s homepage, here you\\'ll find useful information for navigating and living within Prince Albert.", 'url': 'https://www.citypa.ca/en/index.aspx', 'domain': 'www.citypa.ca', 'imgUrl': 'https://www.citypa.ca/en/images/structure/news_avatar.jpg'}]

    }
  },

  computed: {
    twitterCard() {
      return TwitterCard
    },

  },

  mounted() {},
};
</script>
