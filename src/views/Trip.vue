<template>
  <div class="trip">
    <!-- Notice Bar -->
    <NoticeBar :ifNotice="ifNotice" :noticeInfo="noticeInfo"></NoticeBar>
    <ScrollWrapper @onRefresh="onRefreshTrip" v-show="this.$route.name === 'trip'">
      <section class="trip-bg-wrapper">
        <div class="trip-wrapper">
          <!-- Top Trip Nav -->
          <div class="md-example-child md-example-child-tabs md-example-child-tab-bar-1">
            <md-tab-bar v-model="current" :items="items" :maxLength="4" @change="onTripWayChange" />
          </div>
          <!-- Data Tips -->
          <div class="tips">
            <p>累计{{tripWay}}</p>
            <h2>{{distanceNow}}</h2>
            <p>本月{{tripWay}}{{distanceNow}}公里>></p>
          </div>
          <!-- Start Button -->
          <ConfirmButton :text="`开始${tripWay}`" @onClickButton="onSelectStart"></ConfirmButton>
        </div>
      </section>
    </ScrollWrapper>
    <!-- Click the Button to Show Map -->
    <transition name="fademap">
      <router-view v-if="this.$route.name === 'map'"></router-view>
    </transition>
  </div>
</template>
<script>
import { TabBar } from "mand-mobile";
import ScrollWrapper from "@/components/ScrollWrapper.vue";
import NoticeBar from "@/components/NoticeBar.vue";
import ConfirmButton from "@/components/ConfirmButton.vue";
// import Map from "@/components/Map.vue";
import { mapGetters, mapActions } from "vuex";

export const tripWayMap = {
  步行: "walking",
  跑步: "running",
  骑行: "riding",
  驾车: "driving",
  公交: "bus",
  打车: "taxi",
  walking: '步行',
  running: '跑步',
  riding: '骑行',
  driving: '驾车',
  bus: '公交',
  taxi: '打车'
};

export default {
  name: "trip",
  components: {
    [TabBar.name]: TabBar,
    ScrollWrapper: ScrollWrapper,
    NoticeBar: NoticeBar,
    ConfirmButton: ConfirmButton,
    // Map: Map
  },
  data() {
    return {
      tripWay: "步行",
      // distance: 0,
      // Top tab
      current: 1,
      items: [
        { name: 1, label: "步行" },
        { name: 2, label: "跑步" },
        { name: 3, label: "骑行" },
        { name: 4, label: "驾车" }
      ]
    };
  },
  computed: {
    tripWayCode() {
      return tripWayMap[this.tripWay];
    },
    distanceNow() {
      if (this.distance) {
        const tripWayCode = tripWayMap[this.tripWay];
        return this.distance[tripWayCode].toFixed(2);
      } else {
        return '0.0'
      }
    },
    ...mapGetters(["distance", "ifNotice", "noticeInfo"])
  },
  mounted() {
    this.getDistance();
  },
  methods: {
    onTripWayChange(e) {
      // this.current = index
      this.tripWay = e.label;
    },
    onSelectStart() {
      console.log("confirm");
      this.$router.push({
        // name 是子路由组件，path是一级路由组件
        name: "map",
        params: {
          tripWay: this.tripWayCode
        }
      });
    },
    async onRefreshTrip(finishRefresh) {
      let finished = await this.refreshDistance();
      if (finished) {
        finishRefresh();
        this.updateNoticeBar({ msg: "更新里程成功！" });
      }
    },
    ...mapActions([
      "getDistance",
      "refreshDistance",
      "getUser",
      "updateNoticeBar"
    ])
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";
.trip {
  width: 100%;
  height: 100%;
  .trip-bg-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url("../assets/img/bg.png");
    background-size: cover;
    // Opicity for bg
    &:after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: $coverBgColor;
    }
    .trip-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
      .md-tab-bar-item {
        font-size: $tabFontSize;
        min-height: $topNavHeight;
      }
      .tips {
        width: $tipBorderLength;
        height: $tipBorderLength;
        margin: 36px auto;
        text-align: center;
        border: $tipDashedBorder;
        border-radius: 50%;
        border-bottom: none;
        p:nth-child(1) {
          margin-top: 40px;
          font-size: $tipTopFontSize;
        }
        h2 {
          margin-top: 10px;
          font-size: $tipStrongFontSize;
        }
        p:nth-child(3) {
          margin-top: 12px;
          font-size: $tipLinkFontSize;
          color: $linkFontColor;
          text-decoration: underline;
          letter-spacing: 1px;
        }
      }
      .start-btn {
        width: 220px;
      }
    }
  }
}
</style>

