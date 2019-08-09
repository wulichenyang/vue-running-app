<template>
  <header class="back-header-wrapper">
    <md-icon
      name="arrow-left"
      class="back-icon"
      size="xs"
      @click="onBack"
    ></md-icon>
    <h1>{{title}}</h1>
    <span @click="onClickRight">{{rightText}}</span>
  </header>
</template>
<script>
import { Icon } from "mand-mobile";

export default {
  name: "BackHeader",
  components: {
    [Icon.name]: Icon
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    rightText: {
      type: String,
      default: ""
    },
  },
  methods: {
    onBack() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.$emit('onClickRight')
    }
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";

.back-header-wrapper {
  position: relative;
  background-color: $mainBgColor;
  z-index: 999;
  .back-icon {
    position: absolute;
    left: 22px;
    top: 22px;
  }
  h1 {
    height: $backHeaderHeight;
    font-size: $tipTopFontSize;
    line-height: $backHeaderHeight;
    text-align: center;
  }
  span {
    position: absolute;
    right: 22px;
    top: 0;
    bottom: 0;
    font-size: $tipTopFontSize;
    line-height: $backHeaderHeight;
  }
}
</style>



