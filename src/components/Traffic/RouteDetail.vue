<template>
  <transition name="down-up">
    <section
      v-show="showRouteDetail"
      :class="collapsed ? 'route-detail collapsed' : 'route-detail'"
    >
      <div class="route-inner">
        <p
          class="toggle-button"
          @click="onToggleRouteDetail"
        >
          <svg-icon
            icon-class="up"
            v-if="collapsed"
          />
          <svg-icon
            icon-class="down"
            v-if="!collapsed"
          />
          <md-button
            v-if="!collapsed"
            type="primary"
            @click.stop="onPopForm"
            inline
          >保存路线</md-button>
        </p>
        <div
          :id="this.panelId"
          class="route-inner-scroll"
        ></div>
      </div>
    </section>
  </transition>
</template>

<script>
import { Button } from "mand-mobile";
export default {
  name: "routeDetail",

  components: {
    [Button.name]: Button
  },
  props: {
    showRouteDetail: {
      type: Boolean
    },
    panelId: {
      type: String,
      default: ""
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
    },
    onPopForm() {
      this.$emit("onPopForm");
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
  &.collapsed {
    transform: translateY(calc(100% - 30px));
    transition: all ease 0.4s;
  }
  button.md-button {
    position: absolute;
    height: 38px !important;
    line-height: 38px !important;
    right: 10px;
    height: 48px;
    line-height: 48px;
    font-size: $primaryBtnFontSize;
  }
  .route-inner {
    background-color: $mainBgColor;
    box-shadow: $boxShadowColor;
    height: 100%;
    margin: 0px 10px !important;
    .amap-call {
      display: none;
    }
    .amap-lib-transfer {
      border-top: none;
    }
    p.toggle-button {
      position: relative;
      height: 56px;
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