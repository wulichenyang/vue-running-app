<template>
  <section
    :class="collapsed ? 'address-list collapsed' : 'address-list'"
    v-if="addressList.length > 0"
  >
    <div class="address-inner">
      <p class="toggle-button" @click="onToggleList">
        <svg-icon icon-class="up" v-if="collapsed" />
        <svg-icon icon-class="down" v-if="!collapsed" />
      </p>
      <div class="address-inner-scroll">
        <md-field>
          <md-cell-item
            :key="address.id"
            v-for="address in addressList"
            :title="address.name"
            :brief="typeof address.address==='string'?address.address:address.district"
            @click="onSelectAddress(address)"
          ></md-cell-item>
        </md-field>
      </div>
    </div>
  </section>
</template>

<script>
import { Field, CellItem } from "mand-mobile";
export default {
  name: "addressList",
  components: {
    [Field.name]: Field,
    [CellItem.name]: CellItem
  },
  props: {
    addressList: {
      type: Array,
      default: []
    },
    isAddressListCollapsed: {
      type: Boolean
    }
  },
  data() {
    return {
      collapsed: false
    };
  },
  watch: {
    isAddressListCollapsed(newFlag) {
      console.log("wathch");
      this.collapsed = newFlag;
    }
  },
  methods: {
    onSelectAddress(address) {
      this.$emit("onSelectAddress", address);
    },
    onToggleList() {
      this.collapsed = !this.collapsed;
      this.$emit("onCollapsedChange", this.collapsed);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.address-list {
  position: absolute;
  top: 180px;
  bottom: 0;
  width: 100%;
  height: calc(100% - 180px);
  z-index: 999;
  box-shadow: $boxShadowSearchColor;
  transition: all ease 0.4s;
  &.collapsed {
    transform: translateY(calc(100% - 30px));
    transition: all ease 0.4s;
  }
  .address-inner {
    height: 100%;
    margin: 0px 10px !important;
    p.toggle-button {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $mainBgColor;
      text-align: center;
    }
    .address-inner-scroll {
      height: calc(100% - 30px);
      overflow-y: auto;
      .md-field {
        min-height: 100%;
        padding: 0px 20px !important;
        .md-cell-item {
          &:last-child {
            .md-cell-item-body::before {
              border-bottom: none;
            }
          }
          .md-cell-item-body {
            padding: 6px 0 0 0;
            min-height: 68px !important;
            .md-cell-item-content {
              p:nth-child(1) {
                height: initial !important;
                padding-top: 0px !important;
                font-size: $formFontSize;
              }
              p:nth-child(2) {
                font-size: $mainFontSize !important;
                margin-top: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>