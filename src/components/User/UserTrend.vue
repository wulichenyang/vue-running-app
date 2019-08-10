<template>
  <section class="user-trend">
    <BackHeader title="出行趋势" />
    <Scroll class="scroll-wrapper">
      <section class="user-trend-inner">
        <WrapperBox title="私人出行里程趋势">
          <LineChart
            :id="'trip-line-chart'"
            :data="tripDistanceTrendData"
          ></LineChart>
        </WrapperBox>
        <WrapperBox title="交通出行里程趋势">
          <LineChart
            :id="'traffic-line-chart'"
            :data="trafficDistanceTrendData"
          ></LineChart>
        </WrapperBox>
      </section>
    </Scroll>
  </section>
</template>

<script>
import Scroll from "@/components/BetterScroll/Scroll";
import G2 from "@antv/g2";
import BackHeader from "@/components/BackHeader.vue";
import LineChart from "@/components/Charts/LineChart.vue";
import GroupedColumnChart from "@/components/Charts/GroupedColumnChart.vue";
import WrapperBox from "@/components/User/WrapperBox.vue";
import { getTripDistanceTrend, getTrafficDistanceTrend } from "@/api/trip";
import { Toast } from "mand-mobile";
import { tripWayMap } from "@/views/Trip";
export default {
  name: "userTrend",

  components: {
    BackHeader: BackHeader,
    LineChart: LineChart,
    GroupedColumnChart: GroupedColumnChart,
    WrapperBox: WrapperBox,
    [Toast.name]: Toast,
    Scroll: Scroll
  },
  props: {},
  mounted() {
    this.getTripDistanceTrend();
    this.getTrafficDistanceTrend();
  },
  data() {
    return {
      // 分组折线图图数据
      // [
      //   {
      //     type: '骑行',
      //     x: '2018-01-01',
      //     y: 10.1
      //   }
      //   ...
      // ]
      tripDistanceTrendData: [],
      trafficDistanceTrendData: []
    };
  },
  methods: {
    formatDistanceTrend(tripArr) {
      return tripArr.map(trip => {
        return {
          type: trip.tripWay,
          x: trip.date.split("T")[0],
          y: trip.distance
        };
      });
    },

    // 同一type同一天累加distance
    addAllDistance(tripArr) {
      let allDistanceMap = {
        // '步行': {
        //   '2018-10-11': 123
        // },
        // ...
      };

      allDistanceMap = tripArr.reduce((totalMap, cur) => {
        // 初始化该type的数据
        if (totalMap[cur.type] === undefined) {
          totalMap[cur.type] = {
            [cur.x]: cur.y
          };
        } else {
          // 累计该type下同一天的里程
          if(totalMap[cur.type][cur.x] === undefined) {
            // 初始化该日期下的里程
            totalMap[cur.type][cur.x] = cur.y;
          } else {
            totalMap[cur.type][cur.x] = totalMap[cur.type][cur.x] + cur.y;
          }
        }
        return totalMap;
      }, allDistanceMap);
      return allDistanceMap;
    },
    distanceMapToTrendData(allDistanceMap) {
      let distanceArr = [];
      console.log("sdf", allDistanceMap);
      let allTypes = Object.keys(allDistanceMap).forEach(type => {
        let distanceSubArr = Object.keys(allDistanceMap[type]).map(date => {
          return {
            type,
            x: date,
            y: allDistanceMap[type][date]
          };
        });
        distanceArr = [...distanceArr, ...distanceSubArr];
      });
      return distanceArr;
    },
    async getTripDistanceTrend() {
      let res = await getTripDistanceTrend();
      if (res.code === 0) {
        let tripDistanceTrendData = this.formatDistanceTrend(res.data);
        console.log('befreo', tripDistanceTrendData)
        let allDistanceMap = this.addAllDistance(tripDistanceTrendData);
        this.tripDistanceTrendData = this.distanceMapToTrendData(
          allDistanceMap
        );
        console.log("ok", this.tripDistanceTrendData);
      } else if (res.code === 1) {
        Toast.failed("获取出行里程趋势失败");
      }
    },

    async getTrafficDistanceTrend() {
      let res = await getTrafficDistanceTrend();
      if (res.code === 0) {
        let trafficDistanceTrendData = this.formatDistanceTrend(res.data);
        let allDistanceMap = this.addAllDistance(trafficDistanceTrendData);
        this.trafficDistanceTrendData = this.distanceMapToTrendData(
          allDistanceMap
        );
        console.log("ok", this.trafficDistanceTrendData);
      } else if (res.code === 1) {
        Toast.failed("获取公交里程趋势失败");
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-trend {
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
  .user-trend-inner {
    padding: 14px;
  }
}
</style>