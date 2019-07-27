<template>
  <!-- 地图实例 -->
  <section class="map">
    <div id="map"></div>
    <!-- 罗盘按钮 -->
    <div id="location-button"></div>
  </section>
</template>

<script>
import { Toast } from "mand-mobile";
export default {
  name: "v-map",
  components: {
    [Toast.name]: Toast
  },
  props: {
    theme: {
      type: String,
      default: "normal"
    },
    autoLocation: {
      type: Boolean,
      default: true
    },
    mapCenter: {
      type: Array,
      default: () => [116.397428, 39.90923]
    },
  },
  mounted() {
    this.createMap();
  },
  beforeDestroy() {
    this.clearMarker();
    this.destroyMap();
  },
  data() {
    return {
      /* 地图 */
      map: null, // 地图实例
      geolocation: null, // 定位实例
      marker: null, // 绘制路径
      mapTraceData: [], // 行程移动坐标数组: [[22, 3224.22], ...]
      traceMapHd: null // 坐标获取循环句柄
    };
  },
  methods: {
    createMap() {
      /* 实例化高德地图 */
      console.log(this.mapCenter)
      let buttonDom = document.getElementById("location-button");
      this.map = new window.AMap.Map("map", {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        // mapStyle: 'amap://styles/light', // 设置地图的显示样式
        zoom: 17, // 初始化地图层级
        viewMode: "3D", // 地图模式
        // pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        center: this.mapCenter // 初始地图中心点
      });

      if(this.autoLocation) { // 自动定位
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
      }
    },
    destroyMap() {
      this.map.destroy();
      this.map = null;
      this.geolocation = null;
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
    clearMarker() {
      if (this.marker && this.marker.clear) {
        this.marker.clear();
      }
      this.marker = null;
    },
    setMapTraceData(mapTraceData) {
      this.mapTraceData = mapTraceData || []
    },
    clearMapTraceData() {
      this.mapTraceData = [];
      this.$emit("onMapTraceData", this.mapTraceData);
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
        this.$emit("onMapTraceData", this.mapTraceData);
      }
    },

    onGetCurrPositionError() {
      console.log("Error in getting position");
    },
    getCurrentPosition() {
      this.geolocation.getCurrentPosition(function(status, result) {
        // if(status=='complete'){
        //     onComplete(result)
        // }else{
        //     onError(result)
        // }
      });
    },
    // 手动定位失败回调
    localOnError(e) {
      console.log("手动定位出错");
      console.log(e);
      Toast.failed("定位失败请尝试刷新");
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
      this.$emit("onAddress", e.addressComponent, e.formattedAddress);
      // formattedAddress: "四川省成都市郫都区合作街道电子科技大学清水河校区学知三组团电子科技大学清水河校区"
    },

    drawTripLine() {
      console.log(this.mapTraceData[0])
      this.marker = new window.AMap.Marker({
        map: this.map,
        position: this.mapTraceData[0] || [116.478935, 39.997761],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new window.AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      });
      // 绘制行程途经轨迹
      let polyline = new window.AMap.Polyline({
        map: this.map,
        path: this.mapTraceData.slice(), // 防止数据被修改
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      });
      // 绘制行程路径动画
      let passedPolyline = new window.AMap.Polyline({
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
    searchAddress(keyword) {
      this.map.plugin("AMap.Autocomplete", () => {
        // 实例化Autocomplete
        var autoOptions = {
          // city 限定城市，默认全国
          city: "全国"
        };
        var autoComplete = new window.AMap.Autocomplete(autoOptions);
        autoComplete.search(keyword, (status, result) => {
          Toast.hide();
          // 搜索成功时，result即是对应的匹配数据
          console.log(status, result);
          if (status !== "complete") {
            this.$emit("onSuggestAddress", []);
            return;
          }
          if (result.info !== "OK") {
            this.$emit("onSuggestAddress", []);
            return;
          }
          this.$emit("onSuggestAddress", result.tips);
        });
      });
    },
    // 根据起止位置查找返回推荐路线
    // [[P:xx Q: yy, lat: xx, lng: yy], [P:xx Q: yy, lat: xx, lng: yy]]
    // [[xx,yy], [xx,yy]]
    searchRoute(routeLocationArr, transportation, panel) {
      if(!routeLocationArr[0].lat) {
        routeLocationArr[0] = new window.AMap.LngLat(routeLocationArr[0][0], routeLocationArr[0][1])
        routeLocationArr[1] = new window.AMap.LngLat(routeLocationArr[1][0], routeLocationArr[1][1])
      }
      console.log(routeLocationArr)
      let type = transportation.slice(5, 15);
      this.map.plugin(transportation, () => {
        this.marker = new window.AMap[type]({
          map: this.map,
          city: "北京市",
          panel,
          autoFitView: true
          //   policy: window.AMap.TransferPolicy.LEAST_TIME
        });
        // 根据起终点经纬度规划驾车导航路线
        this.marker.search(
          routeLocationArr[0],
          routeLocationArr[1],
          //   new window.AMap.LngLat(116.291035, 39.907899),
          //   new window.AMap.LngLat(116.427281, 39.903719),
          (status, result) => {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            console.log(status, result);
            if (status === "complete") {
              console.log("绘制驾车路线完成");
              if (result && result.info === "NO_DATA") {
                Toast.failed("请确保起止路线不同");
              }
              // 存第一条轨迹的路径长度
              if (result.plans) {
                this.$emit(
                  "onGetRouteLength",
                  (result.plans[0].distance / 1000).toFixed(2)
                );
              } else {
                // 保存路径长度
                this.$emit(
                  "onGetRouteLength",
                  (result.routes[0].distance / 1000).toFixed(2)
                );
              }
              this.$emit("onTurnOnRoute");
            } else {
              console.log("获取驾车数据失败：" + result);
              Toast.failed("未检测到匹配路线");
            }
          }
        );
        // window.AMap.event.addListener(this.driving, 'complete', function (e) {
        //   console.log(e)
        // }) // 返回定位出错信息
      });
    }
  },
  watch: {
    theme(newVal) {
      this.map.setMapStyle(`amap://styles/${newVal}`);
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";

#map {
  position: absolute !important;
  width: 100%;
  height: 100%;
}
</style>