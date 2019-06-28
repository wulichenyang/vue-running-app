<template>
  <div class="trip">
    <section class="trip-bg-wrapper">
      <div class="trip-wrapper">
        <!-- Top Trip Nav -->
        <div class="md-example-child md-example-child-tabs md-example-child-tab-bar-1">
          <md-tab-bar v-model="current" :items="items" :maxLength="4" @change="onTripWayChange"/>
        </div>
        <!-- Data Tips -->
        <div class="tips">
          <p>累计{{tripWay}}</p>
          <h2>{{distance}}</h2>
          <p>本月{{tripWay}}{{distance}}公里>></p>
        </div>
        <!-- Start Button -->
        <div class="start-btn-wrapper">
          <button class="start-btn waves" slot>开始{{tripWay}}</button>
        </div>
      </div>
    </section>

    <!-- Click the Button to Show Map -->
    <section class="map-wrapper"></section>
  </div>
</template>
<script>
import { TabBar } from "mand-mobile";
import initWaveButton from '@/assets/js/wave-button.js'

export default {
  name: "trip",
  components: {
    [TabBar.name]: TabBar
  },

  data() {
    return {
      tripWay: "步行",
      distance: 0,
      // Top tab
      current: 1,
      items: [
        { name: 1, label: "步行" },
        { name: 2, label: "跑步" },
        { name: 3, label: "骑行" },
        { name: 4, label: "驾车" }
      ]
    };
  },
  mounted() {
    initWaveButton()
  },
  methods: {
    onTripWayChange(e) {
      // this.current = index
      this.tripWay = e.label;
    }
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";
@import '../assets/css/wave-button.css';

.trip {
  width: 100%;
  height: 100%;
  .trip-bg-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url("../assets/img/bg.png");
    background-size: cover;
    // Opicity for bg
    &:after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: $coverBgColor;
    }
    .trip-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
      .md-tab-bar-item {
        font-size: $tabFontSize;
        min-height: $topNavHeight;
      }
      .tips {
        width: $tipBorderLength;
        height: $tipBorderLength;
        margin: 36px auto;
        text-align: center;
        border: $tipDashedBorder;
        border-radius: 50%;
        border-bottom: none;
        p:nth-child(1) {
          margin-top: 40px;
          font-size: $tipTopFontSize;
        }
        h2 {
          margin-top: 10px;
          font-size: $tipStrongFontSize;
        }
        p:nth-child(3) {
          margin-top: 12px;
          font-size: $tipLinkFontSize;
          color: $linkFontColor;
          text-decoration: underline;
          letter-spacing: 1px;
        }
      }
      .start-btn-wrapper {
        margin-top: 48px;
        text-align: center;
        border-radius: 90px;
        overflow: hidden;
        position: relative;
        .start-btn {
          display: inline-block;
          width: 240px;
          height: 48px;
          letter-spacing: 2px;
          border-radius: 90px;
          font-size: $primaryBtnFontSize;
          color: $primaryBtnFontColor;
          background-color: $primaryBtnBgColor;
          border: none;
          outline: none;
        }
      }
    }
  }
}
</style>

