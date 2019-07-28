<template>
  <header class="back-header-wrapper">
    <md-icon
      name="arrow-left"
      class="back-icon"
      size="xs"
      @click="onBack"
    ></md-icon>
    <h1>{{title}}</h1>
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
    }
  },
  methods: {
    onBack() {
      this.$router.go(-1)
    }
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";

.back-header-wrapper {
  position: relative;
  .back-icon {
    position: absolute;
    left: 22px;
    top: 22px;
  }
  h1 {
    font-size: $tipTopFontSize;
    height: $backHeaderHeight;
    line-height: $backHeaderHeight;
    text-align: center;
  }
}
</style>



