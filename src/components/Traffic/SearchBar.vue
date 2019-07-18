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
          <md-button type="primary" plain>{{trafficWay}}</md-button>
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
          <md-button type="primary">搜索</md-button>
        </p>
      </md-field>
    </section>
    <!-- 出行工具模态框 -->
    <section>chu xin modal</section>
  </section>
</template>

<script>
import { Field, FieldItem, Popup, InputItem, Button } from "mand-mobile";
import AddressList from "@/components/Traffic/AddressList.vue";
export default {
  name: "searchBar",
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Popup.name]: Popup,
    [InputItem.name]: InputItem,
    [Field.name]: Field
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
      trafficWay: "公交"
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
    padding: 0  20px 12px 20px !important;
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
</style>