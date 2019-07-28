<template>
  <section class="setting-section">
    <slot></slot>
  </section>
</template>
<script>
export default {
  name: "settingInfoSection",
  components: {},
  props: {},
  methods: {}
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";

.setting-section {
  margin-top: 12px;
  background-color: $mainBgColor;
  padding: 12px;
}
</style>



