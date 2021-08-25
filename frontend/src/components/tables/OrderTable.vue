<template>
  <div class="rounded shadow-2 bg-white-100" v-if="columns">
    <!-- Component Start -->
    <h1
      class="flex items-center h-12 pl-4 text-lg font-medium font-semibold text-black-400 font-head" 
    >
      Users
    </h1>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow sm:rounded-lg">
            <table class="min-w-full text-sm text-black-400 bg-white-100">
              <thead class="text-xs font-medium uppercase bg-white-100">
                <tr>
                  <th
                    scope="col"
                    v-for="col in columns"
                    :key="col"
                    class="px-6 py-3 tracking-wider text-left"
                  >
                    {{ col }}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody class="bg-white-100">
                <OrderTableRow
                  v-for="user in users"
                  :row="user"
                  :key="user.username"
                /> 
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Component End  -->
  </div>
</template>

<script>
import OrderTableRow from "@/components/tables/OrderTableRow";

export default {
  name: "OrderTable",

  props: {
    columns: {
      default: ["Created", "Username", "Email", "Phone", "Role"],
      type: ArrayBuffer,
    },


  },

  data() {
    return {
      users: [
        {
        created: "September 26, 2021",
          username: "Cort Bosh",
          email: "ctosh0@github.com",
          phoneNumber: "327-626-5542",
          role: "Admin",
      },
      {
        created: "September 26, 2021",
          username: "Cort Josh",
          email: "ctosh0@github.com",
          phoneNumber: "327-626-5542",
          role: "Admin",
      },
      {
        created: "September 26, 2021",
          username: "Cort Posh",
          email: "ctosh0@github.com",
          phoneNumber: "327-626-5542",
          role: "Admin",
      },
      ]
    };
  },

  components: {
    OrderTableRow,
  },
};
</script>