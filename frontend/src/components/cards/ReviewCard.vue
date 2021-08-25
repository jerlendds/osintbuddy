<template>
    <div class="max-w-xl px-10 py-0 transition duration-500 bg-white shadow-2 rounded-2xl hover:shadow-2xl">
      <div class="flex items-center justify-center font-bold text-white bg-yellow-500 rounded-full w-14 ">LOGO</div>
      <div class="mt-4">
        <h1 class="text-lg font-semibold text-gray-700 cursor-pointer hover:underline">Product Review</h1>
       
        <p class="mt-2 mt-4 text-gray-600 text-md">But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happines.</p>
        <div class="flex items-center justify-between">
          <div class="flex items-center py-6 mt-4 space-x-4">
            <div class="">
              <img class="w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1036&q=80" alt="" />
            </div>
            <div class="text-sm font-semibold text-black-600">John Lucas • <span class="font-normal"> 5 minutes ago</span></div>
          </div>
          <div class="flex items-center justify-center w-4 h-4 p-6 mt-4 text-2xl text-white bg-yellow-400 rounded-full shadow-lg cursor-pointer">+</div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "ReviewCard"
}
</script>