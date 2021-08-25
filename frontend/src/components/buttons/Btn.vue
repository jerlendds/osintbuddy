<template>
  <button
    class="font-medium text-white transition-all duration-200 font-head"
    :class="classStyles"
  >
     <span>
    {{ text }}

    </span>
    <component v-if="icon" :is="setIcon"  />
  </button>
</template>

<script>


export default {
  name: "Btn",

  data() {
    return {
    showIcon: false,
    }
  },

  props: {
    size: {
      default: "md",
      value: String,
    },

    color: {
      default: "bg-primary-500",
      value: String,
    },
    shadow: {
      default: false,
      value: Boolean,
    },
    text: {
      default: "I'm Noah!",
      value: String,
    },
    icon: {
      default: null,
      value: Object
    }
  },

  mounted() {},

  computed: {


    setIcon() {
      if (!this.icon) {
        return this.showIcon
      } else {
        return this.icon
      }
    },

    baseColor() {
      let colorStr = this.color.replace(/(bg-?\W)/g, "");
      return colorStr.replace(/([-\d])+/g, "");
    },

    classStyles() {
      return (
        this.focusColor +
        " " +
        this.bgColor +
        " " +
        this.textColor +
        " " +
        this.hoverState +
        " " +
        this.defaultShadow +
        " " +
        this.buttonSize
      );
    },

    focusColor() {
      return "focus:bg-" + this.baseColor + "-500";
    },

    buttonSize() {
      let componentSize = this.size.toLowerCase();

      if (componentSize === "sm") {
        return "py-1 px-4 text-base";
      } else if (componentSize === "lg") {
        return "py-2 px-5 text-xl";
      }
      else if (componentSize === "xl") {
        return "py-2.5 px-5 text-2xl";
      }
      return "py-1.5 px-5 text-lg";
    },

    bgColor() {
      return "bg-" + this.baseColor + "-400";
    },

    textColor() {
      return "text-white-500";
    },

    hoverState() {
      return "hover:shadow-" + this.baseColor + "-5 " + "hover:bg-" + this.baseColor + '-300';
    },

    defaultShadow() {
      if (this.shadow) {
        return "shadow-" + this.color.slice(3) + "-5";
      } else {
        return "shadow-2";
      }
    },
  },
};
</script>
