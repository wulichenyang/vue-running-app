<template>
  <section class="map-wrapper">
    <!-- 地图实例 -->
    <section id="map"></section>
    <!-- 地图操作工具栏 -->
    <section class="map-tool">
      <ul class="tool-wrapper">
        <li class="tool-item">
          <svg-icon icon-class="city" />
          <span v-if="mapData.district">{{mapData.district}}</span>
          <span v-else-if="mapData.city">{{mapData.city}}</span>
          <span v-else>未知地区</span>
        </li>
        <li class="tool-item" @click="themeOnClick">
          <svg-icon icon-class="map" />
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
    <ConfirmButton text="开始"></ConfirmButton>

    <!-- 地址 -->
    <section class="address"></section>
    <!-- 主题 -->
    <section class="theme">
      <md-popup style="z-index:999" v-model="mapPopupShow" position="top">
        <div class="popupText">
          <md-field>
            <md-field-item title="地图" solid>
              <md-radio name="dark" v-model="theme" label="幻影黑" inline />
              <md-radio name="normal" v-model="theme" label="标准" inline />
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
    <transition name="fadeStart"></transition>
  </section>
</template>

<script>
import { Icon, Toast } from "mand-mobile";
import ConfirmButton from "@/components/ConfirmButton";
import { mapActions } from "vuex";
export default {
  name: "Map",
  components: {
    ConfirmButton: ConfirmButton,
    Toast: Toast
  },
  data() {
    return {
      map: null, // 地图实例
      geolocation: null, // 定位实例
      mapData: {},
      mapAddress: "",
      mapPopupShow: false, // 模态框
      theme: 'normal', // 地图背景
    };
  },
  mounted() {
    this.createMap();
  },
  watch: {
    theme (newVal) {
      this.map.setMapStyle(`amap://styles/${newVal}`)
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
    themeOnClick() {
      this.mapPopupShow = true;
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
    // 手动定位失败
    localOnError(e) {
      console.log("手动定位出错");
      console.log(e);
      Toast.failed("定位失败请尝试刷新");
    },
    // 停止实时定位
    locationOnDelete() {
      let that = this;
      that.geolocation.clearWatch(that.watchID);
      console.log("停止实时定位");
    },
    createMap() {
      /* 实例化高德地图 */
      let that = this;
      let buttonDom = document.getElementById("location-button");
      this.map = new window.AMap.Map("map", {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        // mapStyle: 'amap://styles/light', // 设置地图的显示样式
        zoom: 11, // 初始化地图层级
        // viewMode: '3D', // 地图模式
        // pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        center: [116.397428, 39.90923] // 初始地图中心点
      });

      /* 地图插件 */
      this.map.plugin(["AMap.Geolocation", "AMap.ControlBar"], function() {
        /* 实例化定位按钮 */
        that.geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          buttonPosition: "RB", // 定位按钮的停靠位置
          buttonDom: buttonDom, // 绑定定位按钮到Dom
          buttonOffset: new window.AMap.Pixel(100, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        });

        /* 添加定位按钮插件 */
        that.map.addControl(that.geolocation);
        that.geolocation.getCurrentPosition(function(status, result) {
          // if (status == "complete") {
          //   onComplete(result);
          // } else {
          //   onError(result);
          // }
        });

        /* 监听定位完成事件 */
        window.AMap.event.addListener(
          that.geolocation, // 监听对象
          "complete", // 监听事件
          that.localOnComplete // 成功回调
        ); // 返回定位信息

        /* 监听定位错误事件 */
        window.AMap.event.addListener(
          that.geolocation,
          "error",
          that.localOnError // 错误回调
        ); // 返回定位出错信息

        /************************************************/
        /* 添加罗盘插件 */
        var controlBar = new window.AMap.ControlBar();
        that.map.addControl(controlBar);

        /* 加载完毕 */
        this.map.on("complete", function() {
          // 地图图块加载完成后触发
          console.log("地图加载完成");
        });
      });
    }
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
  }
  .map-tool {
    border-radius: 5px;
    padding: 50px 50px 0 50px;
    position: relative;
    z-index: 1;
    ul.tool-wrapper {
      display: flex;
      justify-content: space-around;
      text-align: center;
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
  }
  .theme {
  }
}
</style>
