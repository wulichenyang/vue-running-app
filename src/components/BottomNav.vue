<template>
  <footer class="nav-tab">
    <md-tab-bar v-model="current" :items="items" :has-ink="false" @change="onNavChange">
      <template slot="item" slot-scope="{ item }">
        <div class="custom-item">
          <div class="icon">
            <md-icon :name="item.icon" size="xs"/>
          </div>
          <div class="text">
            <span v-text="item.label"></span>
          </div>
        </div>
      </template>
    </md-tab-bar>
  </footer>
</template>

<script>
import { TabBar, Icon } from "mand-mobile";

export default {
  name: "bottomNav",
  components: {
    [TabBar.name]: TabBar,
    [Icon.name]: Icon
  },
  data() {
    return {
      current: 1,
      items: [
        { name: 1, label: "出行", icon: "home" },
        { name: 2, label: "交通", icon: "location" },
        { name: 3, label: "历史", icon: "calendar" },
        { name: 4, label: "我的", icon: "user" }
      ]
    };
  },
  methods: {
    onNavChange(e) {
      switch (e.name) {
        case 1:
          this.$router.push({
            path: "/trip"
          });
          break;
        case 2:
          this.$router.push({
            path: "/traffic"
          });
          break;
        case 3:
          this.$router.push({
            path: "/history"
          });
          break;
        case 4:
          this.$router.push({
            path: "/user"
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.nav-tab {
  width: 100%;
  height: 64px;
  background-color: #fff;
  .md-tab-bar-item {
    min-height: 64px !important;
    .icon {
      text-align: center;
    }
    .text {
      font-size: 14px;
    }
  }
  // .md-tab-bar-item {

  // }
}
</style>
