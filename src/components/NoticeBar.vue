<template>
  <transition name="top-down">
    <section class="notice-bar" v-if="ifNotice">
      <md-notice-bar>{{noticeInfo}}</md-notice-bar>
    </section>
  </transition>
</template>
<script>
import { NoticeBar } from "mand-mobile";

export default {
  name: "NoticeBar",
  components: {
    [NoticeBar.name]: NoticeBar
  },
  props: {
    ifNotice: {
      type: Boolean,
      default: false
    },
    noticeInfo: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";

.notice-bar {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  background-color: $noticeBgColor;
  z-index: 999;
}
.md-notice-bar {
  font-size: $mainFontSize !important;
  text-align: center;
}

.top-down-enter-active, .top-down-leave-active {
  transition: all ease .5s;
}
.top-down-enter, .top-down-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translate(0, -64px)
}
</style>



