<template>
  <ul class="icon-list">
    <li :key="icon.key" v-for="icon in iconList">
      <svg-icon :icon-class="icon.name"></svg-icon>
      <span>{{icon.brief}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "WrapperBox",
  components: {},
  props: {
    iconList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

ul.icon-list {
  display: flex;
  justify-content: space-around;
  li {
    display: flex;
    flex-direction: column;
  }
}
</style>
