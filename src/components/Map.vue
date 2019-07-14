<template>
  <section class="map-wrapper">
    <!-- 地图实例 -->
    <section id="map"></section>
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
    <!-- 定位按钮 -->
    <section id="location-button" @click="loactionOnClick"></section>
    <!-- 开始按钮 -->
    <ConfirmButton :text="confirmText" @onClickButton="onConfirmClick"></ConfirmButton>

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
        :class="actionState === 'running' ? 'detail-info running-info' : actionState === 'finished' ? 'detail-info finised-info': ''"
        v-if="this.actionState !== 'ready'"
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
  CellItem
} from "mand-mobile";

import ConfirmButton from "@/components/ConfirmButton";
import { formatSeconds, localDate } from "@/utils/time";
import { mapTraceDataToDistance } from "@/utils/mapUtils";
import { mapActions } from "vuex";
import { saveTrip } from "@/api/trip";
import { tripWayMap } from "@/views/Trip.vue";

export const actionStateMap = {
  ready: "开始",
  running: "结束",
  finished: "退出"
};

export default {
  name: "Map",
  components: {
    ConfirmButton: ConfirmButton,
    [CellItem.name]: CellItem,
    [Toast.name]: Toast,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Radio.name]: Radio,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar
  },
  data() {
    return {
      actionState: "ready", // App运行状态 ready, running, finished
      /* 地图 */
      map: null, // 地图实例
      geolocation: null, // 定位实例
      // watchTraceId: null, // 原生监听行程移动句柄（暂时不可用）
      mapData: {},
      mapAddress: "",

      /* 模态框 */
      themePopupShow: false, // 主题模态框
      theme: "normal", // 地图背景
      addressPopupShow: false, // 地址模态框

      /* 跑步数据 */
      timeSecond: 0,
      timeHd: null, // 时间循环句柄
      traceMapHd: null, // 坐标获取循环句柄
      markText: "",
      mapTraceData: [], // 行程移动坐标数组: [[22, 3224.22], ...]
      marker: null // 绘制路径
    };
  },
  mounted() {
    this.createMap();
  },
  beforeDestroy() {
    this.destroyMap();
  },
  watch: {
    theme(newVal) {
      this.map.setMapStyle(`amap://styles/${newVal}`);
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
      return mapTraceDataToDistance(this.mapTraceData, window.AMap);
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
      this.geolocation.getCurrentPosition(function(status, result) {
        // if(status=='complete'){
        //     onComplete(result)
        // }else{
        //     onError(result)
        // }
      });
    },
    onConfirmClick() {
      if (this.actionState === "ready") {
        this.actionState = "running";
        Toast.info("行程开启~");
        this.startTraceMap();
        this.startTimeCounter();
      } else if (this.actionState === "running") {
        this.actionState = "finished";
        this.drawTripLine();
        this.saveTripData();
        this.clearTimeCounter();
        this.clearTimeTraceMap();
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

      let res = await saveTrip({
        type,
        tripWay: `${tripWayCN}`,
        distance: parseFloat(this.distanceNow),
        date: localDate(new Date()),
        time: this.timeNow, // TODO
        trajectory: this.mapTraceData,
        calorie: parseFloat(this.calorieNow),
        speed: parseFloat(this.speedNow),
        mark: this.markText || "无备注"
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
    // 监听手动定位成功
    localOnComplete(e) {
      console.log("手动定位成功");
      console.log(e);
      // addressComponent:
      // adcode: "510117"
      // building: ""
      // buildingType: ""
      // businessAreas: Array(0)
      // city: "成都市"
      // citycode: "028"
      // district: "郫都区"
      // neighborhood: ""
      // neighborhoodType: ""
      // province: "四川省"
      // street: "合作路"
      // streetNumber: "77号"
      // township: "合作街道"
      this.mapData = e.addressComponent;
      // formattedAddress: "四川省成都市郫都区合作街道电子科技大学清水河校区学知三组团电子科技大学清水河校区"
      this.mapAddress = e.formattedAddress;
    },
    // 手动定位失败回调
    localOnError(e) {
      console.log("手动定位出错");
      console.log(e);
      Toast.failed("定位失败请尝试刷新");
    },
    // // 停止实时定位回调(原生)
    // locationOnDelete() {
    //   let that = this;
    // that.geolocation.clearWatch(that.watchTraceId);
    //   console.log("停止实时定位");
    // },
    createMap() {
      /* 实例化高德地图 */
      let buttonDom = document.getElementById("location-button");
      this.map = new window.AMap.Map("map", {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        // mapStyle: 'amap://styles/light', // 设置地图的显示样式
        zoom: 11, // 初始化地图层级
        viewMode: "3D", // 地图模式
        // pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        center: [116.397428, 39.90923] // 初始地图中心点
      });

      /* 地图插件 */
      this.map.plugin(["AMap.Geolocation", "AMap.ControlBar"], () => {
        /* 实例化定位按钮 */
        this.geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          buttonPosition: "RB", // 定位按钮的停靠位置
          buttonDom: buttonDom, // 绑定定位按钮到Dom
          buttonOffset: new window.AMap.Pixel(100, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        });

        /* 添加定位按钮插件 */
        this.map.addControl(this.geolocation);
        this.geolocation.getCurrentPosition((status, result) => {
          // if (status == "complete") {
          //   onComplete(result);
          // } else {
          //   onError(result);
          // }
        });

        /* 监听定位完成事件 */
        window.AMap.event.addListener(
          this.geolocation, // 监听对象
          "complete", // 监听事件
          this.localOnComplete // 成功回调
        ); // 返回定位信息

        /* 监听定位错误事件 */
        window.AMap.event.addListener(
          this.geolocation,
          "error",
          this.localOnError // 错误回调
        ); // 返回定位出错信息

        /************************************************/
        /* 添加罗盘插件 */
        var controlBar = new window.AMap.ControlBar();
        this.map.addControl(controlBar);

        /* 加载完毕 */
        this.map.on("complete", function() {
          // 地图图块加载完成后触发
          console.log("地图加载完成");
        });
      });
    },
    drawTripLine() {
      this.marker = new AMap.Marker({
        map: this.map,
        position: [116.478935, 39.997761],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      });
      // 绘制行程途经轨迹
      let polyline = new AMap.Polyline({
        map: this.map,
        path: this.mapTraceData.slice(), // 防止数据被修改
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      });
      // 绘制行程路径动画
      let passedPolyline = new AMap.Polyline({
        map: this.map,
        // path: lineArr,
        strokeColor: "#AF5", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      });
      // 触发行程路径动画
      this.marker.on("moving", function(e) {
        passedPolyline.setPath(e.passedPath);
      });
      this.startDrawTripLineAnimation();
    },
    startDrawTripLineAnimation() {
      this.marker.moveAlong(this.mapTraceData.slice(), 200); // 防止数据被修改
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
    clearTimeTraceMap() {
      clearTimeout(this.traceMapHd);
    },
    onGetCurrPositionComplete(gps) {
      // 获取上一个定位坐标
      let pLast =
        this.mapTraceData.length > 0
          ? this.mapTraceData[this.mapTraceData.length - 1].toString()
          : "";
      console.log(this.mapTraceData);
      // 当前最新坐标
      let pNow = [gps.position.Q, gps.position.P];
      if (pLast === pNow.toString()) {
        console.log("停留当前位置中");
      } else {
        console.log("加入新坐标: ", pNow);
        this.mapTraceData = [...this.mapTraceData, pNow.slice()];
      }
    },

    onGetCurrPositionError() {
      console.log("Error in getting position");
    },

    startTraceMap() {
      this.geolocation.getCurrentPosition((status, gps) => {
        if (status == "complete") {
          this.onGetCurrPositionComplete(gps);
        } else {
          this.onGetCurrPositionError(gps);
        }
      });
      this.traceMapHd = setTimeout(() => {
        this.startTraceMap();
      }, 1000);
    },
    // // 原生navigator绘制移动轨迹  IOS需要HTTPS支持, 暂时放弃
    // startTraceMap() {
    //   console.log(navigator.geolocation);
    //   this.watchTraceId = navigator.geolocation.watchPosition(
    //     position => {
    //       let gps = [position.coords.longitude, position.coords.latitude];
    //       console.log("实时定位中...");
    //       // console.log(gps)
    //       // 获取最后一个定位坐标
    //       let pLast =
    //         this.mapTraceData.length > 0
    //           ? this.mapTraceData[this.mapTraceData.length - 1].toString()
    //           : "";

    //       // else {
    //         // 坐标纠正:
    //         // 原生 navigator.geolocation(GPS) 坐标转化为高德地图经纬度坐标
    //         window.AMap.convertFrom(gps, "gps", (status, result) => {
    //           if (result.info === "ok") {
    //             let pNow = [result.locations[0].Q, result.locations[0].P].toString();
    //             if (pLast === pNow) {
    //               console.log("停留当前位置中");
    //             } else {
    //               console.log('加入新坐标: ', pNow);
    //               alert(pNow)
    //               this.mapTraceData.push(pNow);
    //             }
    //           } else {
    //             console.log("轨迹路径经纬度转换失败！！");
    //           }
    //         });
    //       // }
    //     },
    //     error => {
    //       console.log("listen to currentPosition error", error.code);
    //       //清除多次地理位置定位
    //      navigator.geolocation.clearWatch(this.watchTraceId);
    //       Toast.failed("实时定位出错，请尝试刷新", error.code);
    //       // this.distroyMap();
    //     },
    //     {
    //       /* Options:
    //        *      enableHighAcuracy  :  更精确的查找，默认false
    //        *      timeout  :指定获取地理位置的超时时间，默认不限时，单位为毫秒
    //        *      maximumAge :最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
    //        */
    //       enableHighAccuracy: true,
    //       maximumAge: 2000,
    //       timeout: 20000
    //     }
    //   );
    // },

    // 结束行程, 重设数据
    async resetRunningData() {
      this.timeSecond = 0;
      this.marker = null;
      this.mapTraceData = [];
      await this.getDistance();

      this.$router.push({ path: "/trip" });
    },

    destroyMap() {
      this.map.destroy();
      this.map = null;
      this.geolocation = null;
    },

    ...mapActions(["getDistance"])
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  #map {
    position: absolute !important;
    width: 100%;
    height: 100%;
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
    &.running-info {
    }
    &.finished-info {
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
