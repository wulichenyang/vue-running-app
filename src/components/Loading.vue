<template>
  <section class="loading-wrapper" v-show="isLoading">
    <md-activity-indicator type="carousel" :size="15"></md-activity-indicator>
  </section>
</template>
<script>

import { ActivityIndicator } from "mand-mobile";

export default {
  name: "Loading",
  components: {
    [ActivityIndicator.name]: ActivityIndicator,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss">
@import '../assets/css/var.scss';

.loading-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $loadingBgColor;
  z-index: 999;
}
</style>



