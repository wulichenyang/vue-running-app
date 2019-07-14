<template>
  <section class="start-btn-wrapper">
    <button ref="buttonRef" class="start-btn waves" @click="onClickButton" slot>{{text}}</button>
  </section>
</template>

<script>
import { initWaveButton, destroyListener } from "@/assets/js/wave-button.js";

export default {
  name: "ConfirmButton",
  props: {
    text: {
      type: String,
      default: "确认"
    }
  },
  mounted() {
    initWaveButton(this.$refs.buttonRef);
  },
  beforeDestroy() {
    destroyListener(this.$refs.buttonRef);
  },
  methods: {
    onClickButton() {
      this.$emit("onClickButton");
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";
@import "../assets/css/wave-button.css";

.start-btn-wrapper {
  margin-top: 48px;
  text-align: center;
  border-radius: 90px;
  overflow: hidden;
  position: relative;
  .start-btn {
    display: inline-block;
    min-width: 100px;
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
</style>
