<template>
    <section class="px-4 py-2.5 mt-2 mx-3 shadow-1" :class="cardClass">
        <h3 class="text-white-700 font-head font-light">
            {{ text }} <span class="text-4xl pl-5 font-medium">{{ value }}</span>
        </h3>
    </section>
</template>

<script>
export default {
    name: "SimpleDataStat",

    props: {
        text: {
            default: "empty text",
            type: String
        },
        value: {
            default: {
                default: "empty value",
                type: String
            }
        },
        cardClass: {
            default: {
                default: "",
                type: String
            }
        }
    }
}
</script>