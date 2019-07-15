<template>
  <section class="map-wrapper">
    <!-- 地图实例 -->
    <Map ref="mapRef" :theme="theme" @onAddress="onGetAddress"></Map>
    <!-- 地图操作工具栏 -->
    <section class="map-tool">
      <ul class="tool-wrapper">
        <li class="tool-item" @click="addressOnToggle">
          <svg-icon icon-class="city" />
          <span v-if="mapData.district">{{mapData.district}}</span>
          <span v-else-if="mapData.city">{{mapData.city}}</span>
          <span v-else>未知地区</span>
        </li>
        <li class="tool-item" @click="themeOnToggle">
          <svg-icon icon-class="brush" />
          <span>主题</span>
        </li>
        <li class="tool-item" @click="loactionOnClick">
          <svg-icon icon-class="location" />
          <span>定位</span>
        </li>
      </ul>
    </section>

    <!-- 开始按钮 -->
    <ConfirmButton :style="{zIndex: 998}" :text="confirmText" @onClickButton="onConfirmClick"></ConfirmButton>

    <!-- ********************* Popup ******************** -->
    <!-- 地址详情 -->
    <section class="address">
      <md-popup style="z-index:999" v-model="addressPopupShow" position="top">
        <div>
          <md-field>
            <md-cell-item title="地址详情" :brief="mapAddress" />
          </md-field>
        </div>
      </md-popup>
    </section>

    <!-- 主题 -->
    <section class="theme">
      <md-popup style="z-index:999" v-model="themePopupShow" position="bottom">
        <div class="popupText">
          <span @click="themeOnToggle">OK</span>
          <md-field>
            <md-field-item title="主题" solid>
              <md-radio name="normal" v-model="theme" label="标准" inline />
              <md-radio name="dark" v-model="theme" label="幻影黑" inline />
              <md-radio name="light" v-model="theme" label="月光银" inline />
              <md-radio name="whitesmoke" v-model="theme" label="远山黛" inline />
              <md-radio name="grey" v-model="theme" label="雅士灰" inline />
              <md-radio name="macaron" v-model="theme" label="马卡龙" inline />
              <md-radio name="blue" v-model="theme" label="靛青蓝" inline />
              <md-radio name="darkblue" v-model="theme" label="极夜蓝" inline />
            </md-field-item>
          </md-field>
        </div>
      </md-popup>
    </section>

    <!-- 开始跑步信息 -->
    <transition name="fadeStart">
      <section
        :class="actionState === 'running' ? 'detail-info running-info' : actionState === 'submitting' ? 'detail-info submitting-info': ''"
        v-if="this.actionState === 'running' || this.actionState === 'submitting'"
      >
        <h1>
          {{distanceNow}}
          <span>公里</span>
        </h1>
        <ul>
          <li>
            <h2>{{timeNow}}</h2>
            <p>总计时间</p>
          </li>
          <li>
            <h2>{{speedNow}}km/h</h2>
            <p>平均速度</p>
          </li>
          <li>
            <h2>{{calorieNow}}kcal</h2>
            <p>消耗卡路里</p>
          </li>
        </ul>
        <p v-if="this.actionState === 'submitting'" class="brief">
          <md-field>
            <md-input-item
              v-model="brief"
              title="添加备注"
              placeholder="添加备注"
              is-title-latent
              clearable
            ></md-input-item>
          </md-field>
        </p>
      </section>
    </transition>
  </section>
</template>

<script>
import {
  Icon,
  Toast,
  Radio,
  Field,
  FieldItem,
  Popup,
  PopupTitleBar,
  CellItem,
  InputItem
} from "mand-mobile";

import ConfirmButton from "@/components/ConfirmButton";
import { formatSeconds, localDate } from "@/utils/time";
import { mapTraceDataToDistance } from "@/utils/mapUtils";
import { mapActions } from "vuex";
import { saveTrip } from "@/api/trip";
import { tripWayMap } from "@/views/Trip.vue";
import Map from "@/components/Map";

export const actionStateMap = {
  ready: "开始",
  running: "结束",
  submitting: "提交",
  finished: "退出"
};

export default {
  name: "TripDetail",
  components: {
    ConfirmButton: ConfirmButton,
    [CellItem.name]: CellItem,
    [Toast.name]: Toast,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Radio.name]: Radio,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    Map: Map,
  },
  data() {
    return {
      actionState: "ready", // App运行状态 ready, running, finished
      mapData: {},
      mapAddress: "",
      /* 模态框 */
      themePopupShow: false, // 主题模态框
      theme: "normal", // 地图背景
      addressPopupShow: false, // 地址模态框
      /* 跑步数据 */
      timeSecond: 0,
      timeHd: null, // 时间循环句柄
      markText: "",
      brief: "" // 行程备注
    };
  },
  mounted() {},
  beforeDestroy() {},
  watch: {
    theme(newVal) {
      // Hide theme popup
      setTimeout(() => {
        this.themeOnToggle();
      }, 200);
    }
  },
  computed: {
    confirmText() {
      return actionStateMap[this.actionState];
    },

    // 跑步数据
    distanceNow() {
      // mapTraceData [[22, 333], ...] -> distanceNow (xx公里)
      return mapTraceDataToDistance(this.$refs.mapRef.mapTraceData, window.AMap);
    },
    timeNow() {
      // Seconds to 00:00:00
      return formatSeconds(this.timeSecond);
    },
    speedNow() {
      // this.distanceNow / this.timeSecond
      return this.timeSecond === 0
        ? "0.00"
        : (this.distanceNow / (this.timeSecond / 60 / 60)).toFixed(2);
    },
    calorieNow() {
      // this.distanceNow -> lost calorie
      return (this.distanceNow * 60.975).toFixed(1);
    }
  },
  methods: {
    loactionOnClick() {
      Toast.info("定位中");
      console.log(this.map);
      this.$refs.mapRef.getCurrentPosition();
    },
    onConfirmClick() {
      if (this.actionState === "ready") {
        this.actionState = "running";
        Toast.info("行程开启~");
        this.$refs.mapRef.startTraceMap();
        this.startTimeCounter();
      } else if (this.actionState === "running") {
        this.actionState = "submitting";
        this.$refs.mapRef.drawTripLine();
        this.clearTimeCounter();
        this.$refs.mapRef.clearTimeTraceMap();
      } else if (this.actionState === "submitting") {
        this.actionState = "finished";
        this.saveTripData();
      } else if (this.actionState === "finished") {
        this.resetRunningData();
        this.actionState = "ready";
      }
    },
    async saveTripData() {
      let type =
        location.pathname.indexOf("trip") > 0
          ? "trip"
          : location.pathname.indexOf("traffic") > 0
          ? "traffic"
          : "";
      let tripWayCode = location.pathname.split("/").pop();
      let tripWayCN = tripWayMap[tripWayCode];
      let markText = this.brief;
      let res = await saveTrip({
        type,
        tripWay: `${tripWayCN}`,
        distance: parseFloat(this.distanceNow),
        date: localDate(new Date()),
        time: this.timeNow, // TODO
        trajectory: this.$refs.mapRef.mapTraceData,
        calorie: parseFloat(this.calorieNow),
        speed: parseFloat(this.speedNow),
        mark: markText || "无备注"
      });
      if (res.code === 0) {
        Toast.succeed(res.message);
      }
    },
    themeOnToggle() {
      this.themePopupShow = !this.themePopupShow;
    },
    addressOnToggle() {
      this.addressPopupShow = !this.addressPopupShow;
    },

    // 时间计数器
    startTimeCounter() {
      this.timeHd = setInterval(() => {
        ++this.timeSecond;
      }, 1000);
    },
    clearTimeCounter() {
      clearInterval(this.timeHd);
    },

    onGetAddress(mapData, mapAddress) {
      this.mapData = mapData;
      this.mapAddress = mapAddress;
    },

    // 结束行程, 重设数据
    async resetRunningData() {
      this.timeSecond = 0;
      this.$refs.mapRef.clearMarker();
      this.$refs.mapRef.clearMapTraceData();
      await this.getDistance();

      this.$router.push({ path: "/trip" });
    },

    ...mapActions(["getDistance"])
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  #map {
    .amap-controlbar {
      top: initial !important;
      bottom: 20px !important;
    }
  }
  .map-tool {
    padding: 50px 50px 0 50px;
    position: relative;
    z-index: 1;
    ul.tool-wrapper {
      display: flex;
      justify-content: space-around;
      text-align: center;
      border-radius: 5px;
      background-color: $mapToolBgColor;
      box-shadow: $toolBoxShadowColor;
      li.tool-item {
        flex: 1;
        display: inline-block;
        margin: 5px 0;
        padding: 2px 0;
        border-right: $toolRightBorder;
        &:last-child {
          border-right: none;
        }
        svg {
          margin-right: 5px;
        }
      }
    }
  }
  #location-button {
  }
  .start-btn-wrapper {
    position: relative;
    top: 40%;
    width: 100px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: $boxShadowColor;
    .start-btn {
      height: 100px;
      border-radius: 50%;
    }
  }
  .address {
    .md-field {
      padding: 32px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      .md-cell-item-body {
        padding-top: 10px;
        padding-bottom: 10px;
        .md-cell-item-title {
          font-size: $titleFontSize;
        }
        .md-cell-item-brief {
          font-size: $briefFontSize;
        }
      }
    }
  }
  .theme {
    position: relative;
    .md-popup-box {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      span {
        font-size: $confirmFontSize;
        color: $confirmBtnColor;
        position: absolute;
        top: 12px;
        right: 20px;
      }
      .md-field-item-title {
        min-width: 72px !important;
        width: 72px;
        font-size: $titleFontSize;
      }
      .md-field-item-control {
        min-width: 100px;
        font-size: $mainFontSize;
        i {
          font-size: $radioFontSize;
        }
        label {
          min-width: 80px;
          margin-right: 24px;
        }
      }
    }
  }
  .detail-info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: $mainBgColor;
    box-shadow: $boxShadowColor;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    h1 {
      padding: 20px;
      font-size: $tipStrongFontSize;
      text-align: center;
      span {
        font-size: $titleFontSize;
      }
    }
    ul {
      margin: 20px 0;
      display: flex;
      justify-content: space-around;
      li {
        flex: 1;
        text-align: center;
        h2 {
          font-size: $tipTopFontSize;
        }
        p {
        }
      }
    }
    p.brief {
      .md-field {
        padding-top: 0;
      }
      label {
        font-size: $tipTopFontSize !important;
      }
      input {
        font-size: $mainFontSize;
      }
    }
    &.running-info {
    }
    &.submitting-info {
    }
  }
  .fadeStart-enter,
  .fadeStart-leave-to {
    transform: translateY(-100%);
  }
  .fadeStart-enter-to,
  .fadeStart-leave {
    transform: translateY(0);
  }
  .fadeStart-enter-active,
  .fadeStart-leave-active {
    transition: all 0.4s;
  }
}
</style>
