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
import { getTripRatio } from "@/api/trip";
import { Toast } from "mand-mobile";
import { tripWayMap } from "@/views/Trip";
export default {
  name: "userAnalysis",

  components: {
    BackHeader: BackHeader,
    Pie: Pie,
    WrapperBox: WrapperBox,
    [Toast.name]: Toast
  },
  props: {},
  mounted() {
    this.getTripRatio();
  },
  data() {
    return {
      pieData: []
    };
  },
  methods: {
    computeRatio(tripTimeArr) {
      // 次数记录
      let countMap = {
        walking: 0,
        running: 0,
        riding: 0,
        driving: 0,
        taxi: 0,
        bus: 0
      };

      let allCount = tripTimeArr.length;

      let computedCountMap = tripTimeArr.reduce((prev, cur) => {
        let tripWay = tripWayMap[cur.tripWay];
        return {
          ...prev,
          [tripWay]: ++prev[tripWayMap[cur.tripWay]]
        };
      }, countMap);

      return Object.keys(computedCountMap).map(tripWay => {
        return {
          item: tripWay,
          percent: (computedCountMap[tripWay] / allCount)
        };
      });
    },

    async getTripRatio() {
      let res = await getTripRatio();
      if (res.code === 0) {
        console.log(res.data);
        this.pieData = [...this.computeRatio(res.data)];
        console.log(this.pieData);
      } else if (res.code === 1) {
        Toast.failed("获取出行失败");
      }
    }
  }
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