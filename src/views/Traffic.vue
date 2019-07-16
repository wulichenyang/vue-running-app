<template>
  <section class="traffic">
    <Map></Map>
    <SearchBar
      @onSelectTrafficWay="onGetTrafficWay"
      @onInputStartAddress="onGetStartAddressList"
      @onInputTerminalAddress="onGetTerminalAddressList"
      @onSearch="onSearchRoute"
    ></SearchBar>
    <RouteDetail></RouteDetail>
    <!-- 出行提交表单模态 -->
  </section>
</template>

<script>
import SearchBar from "@/components/Traffic/SearchBar.vue";
import RouteDetail from "@/components/Traffic/RouteDetail.vue";
import Map from "@/components/Map.vue";
export default {
  name: "traffic",
  components: {
    Map: Map,
    SearchBar: SearchBar,
    RouteDetail: RouteDetail
  },
  data() {
    return {
      startAddress: "",
      terminalAddress: "",
      trafficWay: "",
      addressList: []
    };
  },
  methods: {
    onGetTrafficWay() {
      this.$emit("on");
    },
    onGetStartAddressList(startAddress) {
      this.startAddress = startAddress;
      console.log('start:', this.startAddress)
    },
    onGetTerminalAddressList(terminalAddress) {
      this.terminalAddress = terminalAddress;
      console.log('end:', this.terminalAddress)
    },
    onSearchRoute() {}
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.traffic {
}
</style>