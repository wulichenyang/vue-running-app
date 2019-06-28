<template>
  <div id="app">
    <main class="main-wrapper">
      <transition name="fademap">
        <router-view/>
      </transition>
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
    window.onpageshow = (e) => {
      if(e.persisted) {
        window.location.reload()
      }
    }
  },
  methods: {}
};
</script>

<style lang="scss">
@import "../src/assets/css/reset.css";
#app {
  width: 100%;
  height: 100%;
  .main-wrapper {
    width: 100%;
    height: calc(100% - 64px);
    overflow: auto;
    position: relative;
    color: #555;
    font-size: 24px;
  }
}
.fademap-enter {
  opacity: 0;
}
.fademap-enter-active {
  transition: all 0.2s;
}
</style>
