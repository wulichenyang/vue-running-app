<template>
  <section class="history-detail">
    <section class="history-info">
      <!-- 跑步历史信息 -->
      <section
        v-if="type==='trip'"
        class="trip-history"
      >
        <p class="header-info">
          <span>{{tripWay}}</span>
          <span>{{date}}</span>
        </p>
        <h1>
          {{distance}}
          <span>公里</span>
        </h1>
        <ul>
          <li>
            <h2>{{time}}</h2>
            <p>总计时间</p>
          </li>
          <li>
            <h2>{{speed}}km/h</h2>
            <p>平均速度</p>
          </li>
          <li>
            <h2>{{calorie}}kcal</h2>
            <p>消耗卡路里</p>
          </li>
        </ul>
      </section>
      <!-- 交通出行历史信息 -->
      <section
        v-else
        class="traffic-history"
      >
        <p class="header-info">
          <span>{{tripWay}}</span>
          <span>{{date}}</span>
        </p>
        <h1>
          <span class="start-place">{{startPlace}}</span>
          <svg-icon
            class="place-svg"
            icon-class="place-right"
          />
          <span class="end-place">{{endPlace}}</span>
        </h1>
        <ul>
          <li>
            <h2>{{time}}</h2>
            <p>出发时间</p>
          </li>
          <li>
            <h2>{{price}}元</h2>
            <p>行程花费</p>
          </li>
          <li>
            <h2>{{distance}}km</h2>
            <p>里程</p>
          </li>
        </ul>
        <p><strong>备注：</strong>{{mark}}</p>
      </section>
    </section>
    <!-- 绘制路线图 -->
    <Map
      ref="mapRef"
      :autoLocation="false"
      :mapCenter="trajectory && trajectory[0]"
    ></Map>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Map from "@/components/Map";
import { positionPair2Array } from "@/utils/mapUtils.js";
import { Toast } from "mand-mobile";
export default {
  name: "history",
  components: {
    Map: Map,
    [Toast.name]: Toast
  },
  mounted() {
    this.drawRouteLine();
  },
  data() {
    return {};
  },
  methods: {
    drawRouteLine() {
      console.log(this.distance)
      if (this.type === "trip") {
        this.$refs.mapRef.setMapTraceData(this.trajectory);
        this.$refs.mapRef.drawTripLine();
      } else if (this.type === "traffic") {
        let { startCode, endCode } = this.historyDetail;
        const trajectory = [
          positionPair2Array(startCode),
          positionPair2Array(endCode)
        ];
        this.$refs.mapRef.setMapTraceData(trajectory);
        this.$refs.mapRef.searchRoute(trajectory, "AMap.Transfer");
      }
    }
  },
  computed: {
    ...mapGetters(["historyDetail"]),
    type() {
      return this.historyDetail.type;
    },
    tripWay() {
      return this.historyDetail.tripWay;
    },
    date() {
      return this.historyDetail.date && this.historyDetail.date.split("T")[0];
    },
    distance() {
      return this.historyDetail.distance;
    },
    time() {
      return this.historyDetail.time;
    },
    speed() {
      return this.historyDetail.speed;
    },
    calorie() {
      return this.historyDetail.calorie;
    },
    startPlace() {
      return this.historyDetail.startPlace;
    },
    endPlace() {
      return this.historyDetail.endPlace;
    },
    price() {
      return this.historyDetail.price;
    },
    mark() {
      return this.historyDetail.mark;
    },
    trajectory() {
      return this.historyDetail.trajector;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.history-detail {
  height: 100%;
  overflow: hidden;
  position: relative;
  .history-info {
    position: relative;
    background-color: $mainBgColor;
    z-index: 1000;
    .traffic-history {
      h1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        svg {
          font-size: $svgFontSize;
          width: $svgFontSize;
          margin: 0 8px;
        }
        span {
          flex: 1;
        }
      }
    }
    .trip-history,
    .traffic-history {
      padding: 20px;
      box-shadow: $boxShadowColor;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      p.header-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      h1 {
        margin-bottom: 20px;
        font-size: $tipStrongFontSize;
        text-align: center;
        span {
          font-size: $titleFontSize;
        }
      }
      ul {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        li {
          flex: 1;
          text-align: center;
          h2 {
            font-size: $tipTopFontSize;
          }
        }
      }
    }
    .map {
      position: absolute !important;
      width: 100%;
      height: 100%;
    }
  }
}
</style>

