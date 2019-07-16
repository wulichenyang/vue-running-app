<template>
  <footer class="nav-tab">
    <ul>
      <li :key="item.name" v-for="item in items">
        <router-link :to="item.href">
          <div class="icon">
            <md-icon :name="item.icon" size="xs"/>
          </div>
          <div class="text">
            <span v-text="item.label"></span>
          </div>
        </router-link>
      </li>
    </ul>
  </footer>
</template>

<script>
import { Icon } from "mand-mobile";

export default {
  name: "BottomNav",
  components: {
    [Icon.name]: Icon
  },
  data() {
    return {
      current: 1,
      items: [
        { name: 1, label: "出行", icon: "home" , href: '/trip'},
        { name: 2, label: "交通", icon: "location" , href:'/traffic'},
        { name: 3, label: "历史", icon: "calendar", href: '/history' },
        { name: 4, label: "我的", icon: "user", href: '/user' }
      ]
    };
  },
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";

.nav-tab {
  width: 100%;
  height: $bottomNavHeight;
  background-color: $bottomNavBgColor;
  ul {
    padding: 0 10px;
    display: flex;
    min-height: $bottomNavHeight !important;
    li {
      display: flex;
      flex: 1;
      text-align: center;
      a {
        flex:1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: $navLinkFontColor;
        &.router-link-active {
          color: $confirmBtnColor;
        }
        .icon {
          text-align: center;
        }
        .text {
          font-size: $tabFontSize;
        }
      }
    }
  }
}
</style>
