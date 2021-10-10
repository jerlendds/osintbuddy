<template>
    <section class="flex flex-col">
        <h3 class="text-gray-50 text-sm font-head leading-4 pb-1">
            {{  header }}
        </h3>
        <h3 class="text-white-600 text-4xl font-head font-semibold">
            {{ smallHeader }}
        </h3>
    </section>
</template>

<script>
export default {
    name: "DualHeader",

    props: {
        header: {
            default: "prop:header",
            type: String
        },
        smallHeader: {
            default: "prop:smallHeader",
            type: String
        }
    },

}
</script>