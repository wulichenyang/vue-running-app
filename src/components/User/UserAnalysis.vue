<template>
  <section class="user-analysis">
    <BackHeader title="数据分析" />
    <section class="user-analysis-inner">
      <WrapperBox title="出行方式分布">
        <Pie></Pie>
      </WrapperBox>
      <Pie :data="pieData"></Pie>
    </section>
  </section>
</template>

<script>
import G2 from "@antv/g2";
import BackHeader from "@/components/BackHeader.vue";
import Pie from "@/components/Charts/Pie.vue";
import WrapperBox from "@/components/User/WrapperBox.vue";

export default {
  name: "userAnalysis",

  components: {
    BackHeader: BackHeader,
    Pie: Pie,
    WrapperBox: WrapperBox
  },
  props: {},
  mounted() {},
  data() {
    return {
      pieData: [
        {
          item: "事例一",
          count: 40,
          percent: 0.4
        },
        {
          item: "事例二",
          count: 21,
          percent: 0.21
        },
        {
          item: "事例三",
          count: 17,
          percent: 0.17
        },
        {
          item: "事例四",
          count: 13,
          percent: 0.13
        },
        {
          item: "事例五",
          count: 9,
          percent: 0.09
        }
      ]
    };
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
  background-color: $mainBgGrayColor;
  .user-analysis-inner {
    padding: 14px;
  }
}
</style>