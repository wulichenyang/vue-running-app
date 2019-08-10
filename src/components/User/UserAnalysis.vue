<template>
  <section class="user-analysis">
    <BackHeader title="数据分析" />
    <Scroll class="scroll-wrapper">
      <section class="user-analysis-inner">
        <WrapperBox title="出行方式分布">
          <PieChart :data="pieData"></PieChart>
        </WrapperBox>
        <WrapperBox title="出行/交通里程对比">
          <GroupedColumnChart :data="groupedColumnChartData"></GroupedColumnChart>
        </WrapperBox>
      </section>
    </Scroll>
  </section>
</template>

<script>
import Scroll from "@/components/BetterScroll/Scroll";
import G2 from "@antv/g2";
import BackHeader from "@/components/BackHeader.vue";
import PieChart from "@/components/Charts/PieChart.vue";
import GroupedColumnChart from "@/components/Charts/GroupedColumnChart.vue";
import WrapperBox from "@/components/User/WrapperBox.vue";
import { getTripRatio, getDistanceComparation } from "@/api/trip";
import { Toast } from "mand-mobile";
import { tripWayMap } from "@/views/Trip";
export default {
  name: "userAnalysis",

  components: {
    BackHeader: BackHeader,
    PieChart: PieChart,
    GroupedColumnChart: GroupedColumnChart,
    WrapperBox: WrapperBox,
    [Toast.name]: Toast,
    Scroll: Scroll
  },
  props: {},
  mounted() {
    this.getTripRatio();
    this.getDistanceComparation();
  },
  data() {
    return {
      // 饼图数据
      // [
      //   {
      //     item: 'walking',
      //     percent: 0.21
      //   },
      //   ...
      // ]
      pieData: [],
      // 分组柱状图数据
      // [
      //   {
      //     name: 'trip',
      //     day: '2018-01-01',
      //     distance: 10.1
      //   }
      //   ...
      // ]
      groupedColumnChartData: []
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
      // 每种出行方式的比例
      let computedCountMap = tripTimeArr.reduce((totalCountMap, cur) => {
        totalCountMap[tripWayMap[cur.tripWay]] = ++totalCountMap[
          tripWayMap[cur.tripWay]
        ];
        return totalCountMap;
      }, countMap);

      return Object.keys(computedCountMap).map(tripWay => {
        return {
          item: tripWay,
          percent: parseFloat((computedCountMap[tripWay] / allCount).toFixed(2))
        };
      });
    },

    addAllDistanceOfDay(data) {
      // 日期截取
      data = data.map(item => {
        return {
          ...item,
          date: item.date.split('T')[0]
        }
      })
      let totalMap = {
        trip: {
          // '2018-11-11': 121
          // ...
        },
        traffic: {
          // '2018-11-11': 121
          // ...
        }
      }
      // 按照类型和日期分别叠加distance
      totalMap = data.reduce((total, cur) => {
        // 初始化distance
        if(total[cur.type][cur.date] === undefined) {
          total[cur.type][cur.date] = cur.distance
          // 另一个类型同一日设为0
          let anatherType = cur.type === 'trip' ? 'traffic' : 'trip';
          if(total[anatherType][cur.date] === undefined) {
            total[anatherType][cur.date] = 0;
          }
        } else {
          // 叠加distance
          total[cur.type][cur.date] += cur.distance
        }
        return total
      }, totalMap)
      // traffic: {2019-08-03: 8.79, 2019-08-09: 0}
      // trip: {2019-08-03: 0.01, 2019-08-09: 0.04}
      console.log('totalmap', totalMap)
      let trafficArr = Object.keys(totalMap.traffic).map(date => {
        return {
          name: 'traffic',
          x: date,
          y: totalMap.traffic[date]
        }
      })
      let tripArr = Object.keys(totalMap.trip).map(date => {
        return {
          name: 'trip',
          x: date,
          y: totalMap.trip[date]
        }
      })
      return [
        ...trafficArr,
        ...tripArr
      ]
    },

    async getTripRatio() {
      let res = await getTripRatio();
      if (res.code === 0) {
        this.pieData = this.computeRatio(res.data);
      } else if (res.code === 1) {
        Toast.failed("获取出行比例失败");
      }
    },

    async getDistanceComparation() {
      let res = await getDistanceComparation();
      if (res.code === 0) {
        this.groupedColumnChartData = this.addAllDistanceOfDay(res.data);
        // this.groupedColumnChartData = this.computeRatio(res.data);
      } else if (res.code === 1) {
        Toast.failed("获取里程对比信息失败");
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
  // z-index: 1;
  transition: all ease 0.4s;
  background-color: $mainBgGrayColor;
  .scroll-wrapper {
    height: calc(100% - #{$backHeaderHeight} - #{$bottomNavHeight});
  }
  .user-analysis-inner {
    padding: 14px;
  }
}
</style>