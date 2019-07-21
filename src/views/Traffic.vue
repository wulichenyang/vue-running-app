<template>
  <section class="traffic">
    <Map
      ref="mapRef"
      @onSuggestAddress="onGetSuggestAddress"
      @onTurnOnRoute="onShowRoute"
      @onGetRoute="onGetRoute"
    ></Map>
    <SearchBar
      @onSelectTrafficWay="onGetTrafficWay"
      @onInputStartAddress="onGetStartAddressList"
      @onInputTerminalAddress="onGetTerminalAddressList"
      @onSearch="onSearchRoute"
      @onTurnOnChange="onTurnOnChange"
      :pStartAddress="startAddress"
      :pTerminalAddress="terminalAddress"
      :ifListenChange="ifListenChange"
    ></SearchBar>
    <AddressList
      :addressList="addressList"
      :isAddressListCollapsed="isAddressListCollapsed"
      @onCollapsedChange="onCollapsedChange"
      @onSelectAddress="onSelectAddress"
    ></AddressList>
    <RouteDetail :showRouteDetail="showRouteDetail" :panelId="panelId"></RouteDetail>
    <!-- 出行提交表单模态 -->
  </section>
</template>

<script>
import SearchBar from "@/components/Traffic/SearchBar.vue";
import AddressList from "@/components/Traffic/AddressList.vue";
import RouteDetail from "@/components/Traffic/RouteDetail.vue";
import Map from "@/components/Map.vue";
import { Toast } from "mand-mobile";
export default {
  name: "traffic",
  components: {
    Map: Map,
    SearchBar: SearchBar,
    AddressList: AddressList,
    RouteDetail: RouteDetail,
    [Toast.name]: Toast
  },
  data() {
    return {
      startAddress: "",
      startAddressDetail: {},
      terminalAddress: "",
      terminalAddressDetail: {},
      trafficWay: "",
      addressList: [],
      timer: null,
      editType: "",
      ifListenChange: true,
      isAddressListCollapsed: false,
      showRouteDetail: false,
      trafficeWayNow: "AMap.Transfer",
      route: null,
      panelId: "panel"
    };
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    onGetTrafficWay() {
      // this.$emit("on");
    },
    onGetStartAddressList(startAddress) {
      this.editType = "startAddress";
      this.startAddress = startAddress;
      console.log("start:", this.startAddress);

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.searchAddress(startAddress);
      }, 500);
    },
    onGetTerminalAddressList(terminalAddress) {
      this.editType = "terminalAddress";
      this.terminalAddress = terminalAddress;
      console.log("end:", this.terminalAddress);

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.searchAddress(terminalAddress);
      }, 500);
    },
    searchAddress(key) {
      this.$refs.mapRef.searchAddress(key);
    },
    onGetSuggestAddress(suggestAddressList) {
      this.addressList = suggestAddressList;
    },
    onSelectAddress(address) {
      if (this.editType === "startAddress") {
        console.log("get", address);
        this.startAddress = address.name;
        this.startAddressDetail = address;
      } else if (this.editType === "terminalAddress") {
        this.terminalAddress = address.name;
        this.terminalAddressDetail = address;
      }
      this.addressList = [];
      this.ifListenChange = false;
    },
    onTurnOnChange() {
      this.ifListenChange = true;
      this.isAddressListCollapsed = false;
    },
    onCollapsedChange(flag) {
      this.isAddressListCollapsed = flag;
    },
    onSearchRoute(transportation) {
      this.trafficeWayNow = transportation;
      this.$refs.mapRef.clearMarker();
      if (
        this.startAddressDetail &&
        this.startAddressDetail.location &&
        this.terminalAddressDetail &&
        this.terminalAddressDetail.location
      ) {
        this.searchRoute(this.trafficeWayNow);
      } else {
        Toast.info("请输入起止地点");
      }
    },
    onShowRoute() {
      this.showRouteDetail = true;
    },
    searchRoute(transportation) {
      let routeLocationArr = [
        this.startAddressDetail.location,
        this.terminalAddressDetail.location
      ];
      this.$refs.mapRef.searchRoute(
        routeLocationArr,
        transportation,
        this.panelId
      );
    },
    onGetRoute(route) {
      this.route = route;
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.traffic {
}
</style>