<template>
  <tr>
    <td class="px-6 py-4 text-left whitespace-nowrap">
      <p class="font-medium">{{ values.created }}</p>
    </td>
    <td class="px-6 py-4 text-left whitespace-nowrap">
      <p class="font-medium">{{ values.username }}</p>
    </td>
    <td class="px-6 py-4 text-left whitespace-nowrap">
      <p class="font-medium">{{ values.email }}</p>
    </td>
    <td class="px-6 py-4 text-left whitespace-nowrap">
      <p class="font-medium">{{ values.phoneNumber }}</p>
    </td>

    <td class="flex px-6 py-4 whitespace-nowrap">
      <button class="p-1 mr-1.5 rounded-sm bg-danger">
        <component :is="accountDeleteIcon" class="text-white-600" />
      </button>
      <button class="p-1 mx-1.5 rounded-sm bg-warning-400">
        <component :is="accountEditIcon" class="text-white-600" />
      </button>
      <button class="p-1 ml-1.5 rounded-sm bg-success">
        <component :is="accountAddIcon" class="text-white-600" />
      </button>
    </td>
  </tr>
</template>

<script>
import AccountEditOutline from "vue-material-design-icons/AccountEditOutline.vue";
import AccountPlusOutline from "vue-material-design-icons/AccountPlusOutline.vue";
import DeleteForeverOutline from "vue-material-design-icons/DeleteForeverOutline.vue";

export default {
  name: "OrderTableRow",

  props: {
    values: {
      default: function () {
				return {
        created: "September 26, 2021",
        username: "Cort Bosh",
        email: "ctosh0@github.com",
        phoneNumber: "327-626-5542",
        role: "Admin",
      }},
      type: Object,
    },
  },

  mounted() {
    console.log("fuck", this.row);
  },

  computed: {
    accountEditIcon() {
      return AccountEditOutline;
    },
    accountAddIcon() {
      return AccountPlusOutline;
    },
    accountDeleteIcon() {
      return DeleteForeverOutline;
    },
  },
};
</script>