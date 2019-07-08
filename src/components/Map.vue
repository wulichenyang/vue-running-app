<template>
  <section class="map-wrapper">
    <!-- 地图实例 -->
    <section id="map"></section>
    <!-- 地图操作工具栏 -->
    <section class="map-tool">111</section>
    <!-- 定位按钮 -->
    <section id="location-button"></section>
    <!-- 开始按钮 -->
    <ConfirmButton text="开始"></ConfirmButton>

    <!-- 地址 -->
    <section class="address"></section>
    <!-- 主题 -->
    <section class="theme"></section>

    <!-- 开始跑步信息 -->
    <transition name="fadeStart"></transition>
  </section>
</template>

<script>
import { Icon } from "mand-mobile";
import ConfirmButton from "@/components/ConfirmButton";
import { mapActions } from "vuex";
export default {
  name: "Map",
  components: {
    ConfirmButton: ConfirmButton
  },
  data() {
    return {};
  },
  mounted() {
    this.craeteMap();
  },
  methods: {
    craeteMap() {
      let that = this;
      let buttonDom = document.getElementById("location-button");
      this.map = new window.AMap.Map("map", {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        // mapStyle: 'amap://styles/light', // 设置地图的显示样式
        zoom: 11, // 初始化地图层级
        // viewMode: '3D', // 地图模式
        // pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        center: [126.56092959999998, 43.920187299999995] // 初始地图中心点
      });
      this.map.plugin(["AMap.Geolocation", "AMap.ControlBar"], function() {
        var geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          buttonPosition: "LT", // 定位按钮的停靠位置
          buttonDom: locationButton,
          buttonOffset: new window.AMap.Pixel(100, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        });
        // 定位插件---------------------------------------------------------
        that.map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status, result) {
          // Toast.hide()
        });
        window.AMap.event.addListener(
          geolocation,
          "complete",
          that.localOnComplete
        ); // 返回定位信息
        window.AMap.event.addListener(geolocation, "error", that.localOnError); // 返回定位出错信息
        // 罗盘插件---------------------------------------------------------
        that.map.addControl(new window.AMap.ControlBar());
      });
      this.map.on("complete", function() {
        // 地图图块加载完成后触发
        console.log("地图加载完成");
      });

    },

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

  }
  #location-button {

  }
  .start-btn-wrapper {

  }
  .address {

  }
  .theme {

  }
}
</style>
