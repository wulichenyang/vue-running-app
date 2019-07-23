<template>
  <section>
    <section class="search-bar">
      <md-field>
        <p>
          <md-input-item
            v-model="startAddress"
            title="出发地"
            placeholder="从哪儿出发"
            is-title-latent
            clearable
            @focus="onFocus('start')()"
            @change="onInputStartAddress"
          ></md-input-item>
          <md-button
            type="primary"
            @click="onPopTransportation"
            plain
          >{{trafficWayText}}</md-button>
        </p>
        <p>
          <md-input-item
            v-model="terminalAddress"
            title="目的地"
            placeholder="您要去哪儿"
            is-title-latent
            clearable
            @focus="onFocus('end')()"
            @change="onInputTerminalAddress"
          ></md-input-item>
          <md-button
            @click="onClickSearch"
            type="primary"
          >搜索</md-button>
        </p>
      </md-field>
    </section>
    <!-- 出行工具模态框 -->
    <transition name="topDown">
      <section
        class="transportation"
        v-if="showTransportation"
      >
        <md-field>
          <md-cell-item
            :key="item.value"
            v-for="item in transportations"
            :title="item.text"
            @click="onSelectTransportation(item)"
          />
        </md-field>
      </section>
    </transition>
  </section>
</template>

<script>
import {
  Field,
  CellItem,
  FieldItem,
  Popup,
  InputItem,
  Button
} from "mand-mobile";
import AddressList from "@/components/Traffic/AddressList.vue";
export default {
  name: "searchBar",
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Popup.name]: Popup,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [CellItem.name]: CellItem
  },
  props: {
    pStartAddress: "",
    pTerminalAddress: "",
    ifListenChange: {
      type: Boolean
    }
  },
  data() {
    return {
      startAddress: "",
      terminalAddress: "",
      trafficWayText: "公交",
      trafficeWayNow: "AMap.Transfer",
      showTransportation: false,
      transportations: [
        {
          value: "AMap.Transfer",
          text: "公交/地铁"
        },
        {
          value: "AMap.Driving",
          text: "出租车"
        },
        {
          value: "AMap.Riding",
          text: "单车/电车"
        },
        {
          value: "AMap.Walking",
          text: "步行"
        }
      ]
    };
  },
  watch: {
    pStartAddress: {
      immediate: true,
      handler(val) {
        this.startAddress = val;
      }
    },
    pTerminalAddress: {
      immediate: true,
      handler(val) {
        this.terminalAddress = val;
      }
    }
  },
  methods: {
    onInputStartAddress(name, value) {
      if (this.ifListenChange) {
        this.$emit("onInputStartAddress", value);
      }
    },
    onInputTerminalAddress(name, value) {
      if (this.ifListenChange) {
        this.$emit("onInputTerminalAddress", value);
      }
    },
    onFocus(addType) {
      return name => {
        this.$emit("onTurnOnChange");
        console.log("hehe");
        if (addType === "start") {
          this.$emit("onInputStartAddress", this.startAddress);
        } else if (addType === "end") {
          this.$emit("onInputTerminalAddress", this.terminalAddress);
        }
      };
    },
    onPopTransportation() {
      this.showTransportation = true;
    },
    onSelectTransportation(transportation) {
      this.trafficWayText = transportation.text.split("/")[0];
      this.trafficeWayNow = transportation.value;
      this.showTransportation = false;
      this.$emit("onSelectTrafficWay", transportation);
    },
    onClickSearch() {
      this.$emit("onSearch", this.trafficeWayNow);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.search-bar {
  position: relative;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
  .md-field {
    box-shadow: $boxShadowSearchColor;
    margin: 0 10px 10px 10px;
    padding: 0 20px 12px 20px !important;
  }
  p {
    display: flex;
    align-items: center;
    .md-field-item {
      flex: 1;
    }
    .md-input-item {
      min-height: 50px;
      .md-field-item-content {
        padding-top: 0;
        min-height: 64px !important;
      }
    }
    button {
      min-width: 64px;
      width: 64px !important;
      height: 48px;
      line-height: 48px;
      font-size: $primaryBtnFontSize;
    }
    label {
      font-size: $mainFontSize !important;
    }
    input {
      height: initial !important;
      padding-top: 40px !important;
      padding-bottom: 12px;
      font-size: $formFontSize;
    }
  }
}
.transportation {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 999;
  .md-field {
    margin: 0 10px 10px 10px;
    padding: 0 20px 12px 20px !important;
    box-shadow: $boxShadowSearchColor;
    .md-cell-item {
      height: 64px;
      .md-cell-item-body {
        height: 64px;
        min-height: 64px;
        padding: 0;
        .md-cell-item-content {
          line-height: 1;
          p.md-cell-item-title {
            line-height: 1;
            font-size: $mainFontSize !important;
          }
        }
      }
    }
  }
}
.topDown-enter,
.topDown-leave-to {
  transform: translateY(-80%);
  opacity: 0;
}
.topDown-enter-active,
.topDown-leave-active {
  transition: ease all 0.4s;
}
</style>