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
            @change="onInputTerminalAddress()"
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
  data() {
    return {
      startAddress: "",
      terminalAddress: "",
      trafficWay: "公交"
    };
  },
  methods: {
    onInputStartAddress(name, value) {
      this.$emit('onInputStartAddress', value)
    },
    onInputTerminalAddress(name, value) {
      this.$emit('onInputTerminalAddress', value)
    }
  },
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.search-bar {
  position: relative;
  p {
    display: flex;
    align-items: center;
    .md-field-item {
      flex: 1;
    }
    button {
      width: 100px !important;
    }
  }
}
</style>