<template>
  <md-scroll-view ref="scrollView" :scrolling-x="false" @refreshing="$_onRefresh">
    <md-scroll-view-refresh
      slot="refresh"
      slot-scope="{ scrollTop, isRefreshActive, isRefreshing }"
      :scroll-top="scrollTop"
      :is-refreshing="isRefreshing"
      :is-refresh-active="isRefreshActive"
    ></md-scroll-view-refresh>
    <slot></slot>
  </md-scroll-view>
</template>

<script>
import { ScrollView, ScrollViewRefresh } from "mand-mobile";

export default {
  name: "ScrollWrapper",
  components: {
    [ScrollView.name]: ScrollView,
    [ScrollViewRefresh.name]: ScrollViewRefresh
  },
  mounted() {
    window.ScrollViewTrigger1 = () => {
      this.$refs.scrollView.triggerRefresh();
    };
  },
  methods: {
    $_onRefresh() {
      // async data
      this.$emit("onRefresh", this.$refs.scrollView.finishRefresh.bind(this));
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.md-scroll-view {
  width: 100%;
  height: 100%;
  .scroll-view-container {
    width: 100%;
    height: 100% ;
    .md-scroll-view-refresh {
      padding: 16px;
    }
    .md-activity-indicator-svg {
      width: 24px !important;
      height: 24px !important;
    }
    p {
      font-size: $mainFontSize !important;
    }
  }
}
</style>

