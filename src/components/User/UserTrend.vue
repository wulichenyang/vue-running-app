<template>
  <section class="user-trend">
    <BackHeader title="出行趋势" />
  </section>
</template>

<script>
import BackHeader from "@/components/BackHeader.vue";

export default {
  name: "userTrend",

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
.user-trend {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
  transition: all ease 0.4s;
  background-color: $mainBgColor;
}
</style>