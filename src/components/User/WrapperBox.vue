<template>
  <section class="wrapper-box">
    <h2 v-if="title">{{title}}</h2>
    <slot></slot>
  </section>
</template>

<script>

export default {
  name: "WrapperBox",
  components: {
  },
  props: {
    title: {
      type: String,
      default: '',
    }
  },
  data() {
    return {

    };
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.wrapper-box {
 background-color: $mainBgColor;
 padding: 8px;
 box-shadow: $boxShadowColor;
 margin-bottom: 10px;
 border-radius: 8px;
 h2 {
   margin-top: 5px;
 }
}
</style>
