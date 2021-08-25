<template>
     <div class="px-4 rounded-sm shadow-2 bg-white-100">
        <div class="py-8">
            <div>
                <h2 class="text-2xl font-semibold leading-tight text-black-300">Users</h2>
            </div>
            <div class="flex flex-col my-2 sm:flex-row">
                <div class="flex flex-row mb-1 sm:mb-0">
                    <div class="relative">
                        <select
                            class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border rounded-l appearance-none border-white-800 focus:outline-none focus:bg-white focus:border-white-800">
                            <option>5</option>
                            <option>10</option>
                            <option>20</option>
                        </select>
                        <div
                            class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <div class="relative">
                        <select
                            class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border-t border-b border-r rounded-r appearance-none border-white-800 sm:rounded-r-none sm:border-r-0 focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-white-800">
                            <option>All</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <div
                            class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="relative block">
                    <span class="absolute inset-y-0 left-0 flex items-center h-full pl-2">
                        <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
                            <path
                                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                            </path>
                        </svg>
                    </span>
                    <input placeholder="Search"
                        class="block w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b rounded-l rounded-r appearance-none border-white-800 sm:rounded-l-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
                </div>
            </div>
            <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
                <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
                    <table class="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th
                                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase border-b-4 bg-white-100 border-white-600">
                                    User
                                </th>
                                 <th
                                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase border-b-4 bg-white-100 border-white-600">
                                    Restaurant
                                </th>
                                <th
                                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase border-b-4 bg-white-100 border-white-600">
                                    Role
                                </th>
                                <th
                                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase border-b-4 bg-white-100 border-white-600">
                                    Created
                                </th>
                                <th
                                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase border-b-4 bg-white-100 border-white-600">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white-100 hover:bg-white-200">
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <div class="flex items-center">
                                        
                                       
                                            <p class="text-gray-900 whitespace-no-wrap">
                                                Vera Carpenter
                                            </p>
                                    </div>
                                </td>
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <div class="flex items-center">
                                        
                                       
                                            <p class="text-gray-900 whitespace-no-wrap">
                                                Boston Pizza
                                            </p>
                                    </div>
                                </td>
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <p class="text-gray-900 whitespace-no-wrap">Admin</p>
                                </td>
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                        Jan 21, 2020
                                    </p>
                                </td>
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <span
                                        class="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                                        <span aria-hidden
                                            class="absolute inset-0 bg-green-200 rounded-full opacity-50"></span>
                                        <span class="relative">Active</span>
                                    </span>
                                </td>
                            </tr>
                             <tr class="border-t-4 bg-white-100 hover:bg-white-200 border-white-600">
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <div class="flex items-center">
                                        
                                       
                                            <p class="text-gray-900 whitespace-no-wrap">
                                                Vera Carpenter
                                            </p>
                                    </div>
                                </td>
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <div class="flex items-center">
                                        
                                       
                                            <p class="text-gray-900 whitespace-no-wrap">
                                                Boston Pizza
                                            </p>
                                    </div>
                                </td>
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <p class="text-gray-900 whitespace-no-wrap">Admin</p>
                                </td>
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                        Jan 21, 2020
                                    </p>
                                </td>
                                <td class="px-5 py-5 text-sm border-b border-white-600">
                                    <span
                                        class="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                                        <span aria-hidden
                                            class="absolute inset-0 bg-green-200 rounded-full opacity-50"></span>
                                        <span class="relative">Active</span>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div
                        class="flex flex-col items-center px-5 py-5 border-t-4 border-white-400 xs:flex-row xs:justify-between ">
                        <span class="text-xs text-gray-900 xs:text-sm">
                            Showing 1 to 4 of 50 Entries
                        </span>
                        <div class="inline-flex mt-2 xs:mt-0">
                            <button
                                class="px-4 py-2 text-sm font-semibold text-gray-800 rounded-l bg-white-300 shadow-2 hover:bg-white-500">
                                Prev
                            </button>
                            <button
                                class="px-4 py-2 text-sm font-semibold text-gray-800 rounded-r bg-white-300 shadow-2 hover:bg-white-500">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
  name: "SearchTable",
}
</script>