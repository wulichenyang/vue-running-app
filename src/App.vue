<template>
  <div id="app">
    <main class="main-wrapper">
      <keep-alive>
        <transition name="fademap">
          <router-view/>
        </transition>
      </keep-alive>
    </main>
    <bottomNav></bottomNav>
  </div>
</template>

<script>
import bottomNav from "@/components/BottomNav.vue";
export default {
  components: {
    bottomNav: bottomNav
  },
  mounted() {
    // For iphone to disable cache, in Dev mode
    window.onpageshow = e => {
      if (e.persisted) {
        window.location.reload();
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss">
@import "../src/assets/css/reset.css";
@import "../src/assets/css/var.scss";

#app {
  width: 100%;
  height: 100%;
  .main-wrapper {
    width: 100%;
    height: calc(100% - #{$bottomNavHeight});
    overflow: auto;
    position: relative;
    color: $mainFontColor;
    font-size: $mainFontSize;
  }
}
.fademap-enter {
  opacity: 0;
}
.fademap-enter-active {
  transition: all 0.2s;
}
</style>
