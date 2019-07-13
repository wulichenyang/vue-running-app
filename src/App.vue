<template>
  <div id="app">
    <main class="main-wrapper" :style="{'height': !showNav ? '100% !important': ''}">
      <transition name="fademap">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </transition>
    </main>
    <BottomNav v-if="showNav"></BottomNav>
    <Loading :isLoading="isLoading"></Loading>
  </div>
</template>

<script>
import BottomNav from "@/components/BottomNav.vue";
import Loading from "@/components/Loading.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    BottomNav: BottomNav,
    Loading: Loading
  },
  mounted() {
    // // For iphone to disable cache, in Dev mode
    // window.onpageshow = e => {
    //   if (e.persisted) {
    //     window.location.reload();
    //   }
    // };
  },
  methods: {},

  computed: {
    showNav() {
      return this.$route.name !== 'signup' && this.$route.name !== 'login'
    },
    ...mapGetters(["isLoading"])
  }
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
.md-toast-text {
  font-size: $tipTopFontSize;
}
</style>
