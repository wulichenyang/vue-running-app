<template>
  <transition name="down-up">
    <section 
      v-show="showRouteDetail"
      :class="collapsed ? 'route-detail collapsed' : 'route-detail'"
    >
      <div class="route-inner">
        <p class="toggle-button" @click="onToggleRouteDetail">
          <svg-icon icon-class="up" v-if="collapsed" />
          <svg-icon icon-class="down" v-if="!collapsed" />
        </p>
        <div :id="this.panelId" class="route-inner-scroll">

        </div>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  name: "routeDetail",

  components: {},
  props: {
    showRouteDetail: {
      type: Boolean
    },
    panelId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      collapsed: false
    };
  },
  methods: {
    onToggleRouteDetail() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.route-detail {
  position: absolute;
  top: 180px;
  bottom: 0;
  width: 100%;
  height: calc(100% - 180px);
  z-index: 998;
  transition: all ease 0.4s;
  background-color: $mainBgColor;
  &.collapsed {
    transform: translateY(calc(100% - 30px));
    transition: all ease 0.4s;
  }
  .route-inner {
    box-shadow: $boxShadowSearchColor;
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
    .route-inner-scroll {
      height: calc(100% - 30px);
      overflow-y: auto;
    }
  }
}
</style>