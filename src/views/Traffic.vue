<template>
  <section class="traffic">
    <Map
      ref="mapRef"
      @onSuggestAddress="onGetSuggestAddress"
      @onTurnOnRoute="onShowRoute"
      @onGetRouteLength="onGetRouteLength"
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
    <RouteDetail
      :showRouteDetail="showRouteDetail"
      :panelId="panelId"
      @onPopForm="onPopForm"
    ></RouteDetail>
    <!-- 出行提交表单模态 -->
    <md-dialog
      title="本次出行"
      :closable="true"
      v-model="ifShowForm"
      :btns="btnDialog"
    >
      <md-field class="dialog-field">
        <md-detail-item
          title="交通工具"
          :content="trafficWay"
          bold
        />
        <md-detail-item
          title="出发地"
          :content="startAddress"
        />
        <md-detail-item
          title="目的地"
          :content="terminalAddress"
        />
        <!-- <md-detail-item title="花费" content="5元"/> -->
        <md-field-item title="花费">
          <md-stepper
            slot="right"
            v-model="cost"
            min="0"
          />
        </md-field-item>
        <md-detail-item
          title="日期"
          :content="date"
        />
        <md-input-item
          id="markText"
          v-model="markText"
          title="备注"
          placeholder="点此输入备注，少于20字"
          :maxlength="20"
        ></md-input-item>
      </md-field>
    </md-dialog>
  </section>
</template>

<script>
import { localDate, getTime } from "@/utils/time";
import SearchBar from "@/components/Traffic/SearchBar.vue";
import AddressList from "@/components/Traffic/AddressList.vue";
import RouteDetail from "@/components/Traffic/RouteDetail.vue";
import Map from "@/components/Map.vue";
import { saveTraffic } from "@/api/trip";
import {
  Toast,
  Dialog,
  DetailItem,
  Field,
  Stepper,
  FieldItem,
  InputItem
} from "mand-mobile";
export default {
  name: "traffic",
  components: {
    Map: Map,
    SearchBar: SearchBar,
    AddressList: AddressList,
    RouteDetail: RouteDetail,
    [Toast.name]: Toast,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Stepper.name]: Stepper,
    [Dialog.name]: Dialog,
    [DetailItem.name]: DetailItem
  },
  data() {
    return {
      // 出行信息
      
      // 出发位置
      startAddress: "",
      startAddressDetail: {},
      // 终点位置
      terminalAddress: "",
      terminalAddressDetail: {},
      // 出行方式
      trafficWay: "公交/地铁",
      addressList: [],
      timer: null,
      editType: "",
      ifListenChange: true,
      isAddressListCollapsed: false,
      showRouteDetail: false,
      trafficeWayNow: "AMap.Transfer",
      distance: 0, // 里程
      panelId: "panel",

      // 出行提交模态框
      ifShowForm: false,
      btnDialog: [
        {
          text: "确认保存",
          handler: this.onSaveRoute
        }
      ],
      cost: 0, // 花费
      date: null, // 日期
      markText: "", // 备注信息
      submitting: false, // 提交中信息
    };
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    onGetTrafficWay(transportation) {
      this.trafficWay = transportation.text;
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
    onGetRouteLength(distance) {
      this.distance = distance;
    },
    onPopForm() {
      this.ifShowForm = true;
      this.date = localDate(new Date()).split("T")[0];
    },
    onSaveRoute() {
      // 提交路线表单
      this.saveRoute();
      // 清除表单信息
      this.clearForm();
      // 清除路线轨迹
      this.$refs.mapRef.clearMarker();
      // 清除路线信息Dom
      const panelChildrenDom = document.getElementById(this.panelId);
      [].forEach.call(panelChildrenDom.children, dom => dom.remove());
      // 关闭详细路线
      this.showRouteDetail = false;
    },
    async saveRoute() {
      // 提交中返回
      if (this.submitting) {
        return;
      }
      this.submitting = true;
      // 检查数据完整性
      if (
        !this.startAddressDetail ||
        !this.terminalAddressDetail ||
        !this.startAddress ||
        !this.terminalAddress ||
        !this.trafficWay
      ) {
        Toast.failed("路线信息不完整");
        return;
      }
      // 取表单数据
      let startCode = `${this.startAddressDetail.location.lng}, ${this.startAddressDetail.location.lat}`;
      let endCode = `${this.terminalAddressDetail.location.lng}, ${this.terminalAddressDetail.location.lat}`;

      const trafficData = {
        type: "traffic",
        tripWay: this.trafficWay,
        distance: parseFloat(this.distance),
        date: localDate(new Date()),
        time: getTime().time,
        price: parseFloat(this.cost),
        startPlace: this.startAddress,
        endPlace: this.terminalAddress,
        startCode,
        endCode,
        mark: this.markText || "未备注"
      };
      // 保存交通出行信息
      let res = await saveTraffic(trafficData);
      if (res.code === 0) {
        Toast.info(res.message);
      }
      // 重置提交中flag
      this.submitting = false;
    },
    clearForm() {
      this.cost = 0;
      this.startAddress = "";
      this.terminalAddress = "";
      this.startAddressDetail = {};
      this.terminalAddressDetail = {};
      this.distance = 0;
      this.markText = "";
      this.ifShowForm = false;
      this.submitting = false;
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.traffic {
}
a.md-dialog-btn {
  font-size: $radioFontSize;
}

.md-dialog-content {
  width: auto !important;
  .md-dialog-body {
    padding: 10px !important;
    .md-dialog-close {
      top: 16px;
      right: 16px;
    }
    .md-dialog-title {
      font-size: $radioFontSize;
    }
    .md-field-item {
      label,
      input {
        font-size: $titleFontSize;
      }
      label {
        width: 100px;
      }
    }
    .md-field {
      padding: 10px;
      .md-detail-item {
        font-size: $titleFontSize;
      }
    }
  }
}
</style>