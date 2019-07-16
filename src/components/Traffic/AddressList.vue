<template>
  <section class="address-list">
    <ul>
      addlist 
      <li :key="address.name" v-for="address in addressList">{{address}}</li>
    </ul>
  </section>
</template>

<script>

export default {
  name: 'addressList',
  
  components: {
    
  },
  props: {
    addressList:{
      type: Array,
      default: []
    }
  },
  data() {
    return {

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