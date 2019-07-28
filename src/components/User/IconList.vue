<template>
  <ul class="icon-list">
    <li
      :key="icon.key"
      v-for="icon in iconList"
      @click="onClickCallback(icon.link)"
    >
      <svg-icon :icon-class="icon.name"></svg-icon>
      <span>{{icon.brief}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "IconList",
  components: {},
  props: {
    iconList: {
      type: Array,
      default: () => []
    },
    onClickCallback: {
      type: Function,
      default: (link) => {}
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
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap; // 自动换行
  li {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    svg {
      width: $svgFontSize !important;
      height: $svgFontSize !important;
      margin-bottom: 8px;
    }
  }
}
</style>
