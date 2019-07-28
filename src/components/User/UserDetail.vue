<template>
  <section class="user-detail">
    <BackHeader title="个人信息" />
  </section>
</template>

<script>
import BackHeader from "@/components/BackHeader.vue";

export default {
  name: "userDetail",

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
.user-detail {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
  transition: all ease 0.4s;
  background-color: $mainBgColor;
}
</style>