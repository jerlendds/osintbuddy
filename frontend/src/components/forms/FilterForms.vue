<template>
  <ul >
    <!-- List of filters -->
    <li>
      <GeneralFilter />
    </li>
    <li>
      <EducationFilter />
    </li>
    <li>
      <SocialNetwork />
    </li>
    <li>
      <ImgVidDocFilter />
    </li>

  </ul>
</template>

<script>
import SocialNetwork from "@/components/forms/filters/SocialNetwork";
import ImgVidDocFilter from "@/components/forms/filters/ImgVidDocFilter";
import GeneralFilter from '@/components/forms/filters/GeneralFilter';
import EducationFilter from '@/components/forms/filters/EducationFilter';

export default {
  name: "FilterForms",

  components: {
    SocialNetwork,
    GeneralFilter,
    ImgVidDocFilter,
    EducationFilter,
  }
}
</script>