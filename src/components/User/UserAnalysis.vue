<template>
  <section class="user-analysis">
    <BackHeader title="数据分析" />
  </section>
</template>

<script>
import BackHeader from "@/components/BackHeader.vue";

export default {
  name: "userAnalysis",

  components: {
    BackHeader: BackHeader
  },
  props: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-analysis {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
  transition: all ease 0.4s;
  background-color: $mainBgColor;
}
</style>