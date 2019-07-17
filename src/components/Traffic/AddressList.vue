<template>
  <section
    :class="collapsed ? 'address-list collapsed' : 'address-list'"
    v-if="addressList.length > 0"
  >
    <p class="toggle-button" @click="onToggleList">
      <svg-icon icon-class="up" v-if="collapsed" />
      <svg-icon icon-class="down" v-if="!collapsed" />
    </p>
    <md-field>
      <md-cell-item
        :key="address.id"
        v-for="address in addressList"
        :title="address.name"
        :brief="typeof address.address==='string'?address.address:address.district"
        @click="onSelectAddress(address)"
      ></md-cell-item>
    </md-field>
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
    collapsedAddressList: {
      type: Boolean
    }
  },
  data() {
    return {
      collapsed: false
    };
  },
  watch: {
    collapsedAddressList: {
      immediate: true,
      handler(val) {
        this.collapsed = val;
      }
    }
  },
  methods: {
    onSelectAddress(address) {
      this.$emit("onSelectAddress", address);
    },
    onToggleList() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.address-list {
  position: relative;
  &.collapsed {
    transform: translateY(10px);
  }
  .toggle-button {
    text-align: center;
  }
}
</style>