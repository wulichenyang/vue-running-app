<template>
  <section class="address-list" v-if="addressList.length > 0">
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
    }
  },
  data() {
    return {};
  },
  methods: {
    onSelectAddress(address) {
      this.$emit("onSelectAddress", address);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.address-list {
  position: relative;
}
</style>