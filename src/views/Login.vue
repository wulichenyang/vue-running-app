<template>
  <div class="login">
    <!-- Notice Bar -->
    <NoticeBar :ifNotice="ifNotice" :noticeInfo="noticeInfo"></NoticeBar>
    <section class="login-bg-wrapper">
      <div class="login-wrapper">
        <!-- Title -->
        <div class="title">
          <img src="../assets/img/logo1.png">
        </div>
        <!-- Login Form-->
        <div class="login-form">
          <md-field>
            <md-input-item title="手机号" type="phone" v-model="phone" align="left"></md-input-item>
            <md-input-item title="密码" type="password" v-model="password" align="left"></md-input-item>
            <router-link to="/signup">注册账号</router-link>
          </md-field>
        </div>
        <!-- Login Button -->
        <ConfirmButton text="登录" @onClickButton="onLogin"></ConfirmButton>
      </div>
    </section>
  </div>
</template>
<script>
import { InputItem, Field } from "mand-mobile";
import NoticeBar from "@/components/NoticeBar.vue";
import ConfirmButton from "@/components/ConfirmButton.vue";

import { mapGetters, mapActions } from "vuex";
export default {
  name: "login",
  components: {
    [Field.name]: Field,
    [InputItem.name]: InputItem,
    NoticeBar: NoticeBar,
    ConfirmButton: ConfirmButton
  },
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters(["ifNotice"])
  },
  mounted() {},
  methods: {
    onLogin() {},
    ...mapActions([])
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";

.login {
  width: 100%;
  height: 100%;
  .login-bg-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url("../assets/img/login-bg.jpg");
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
    .login-wrapper {
      .title {
        padding-top: 100px;
        text-align: center;
        img {
          width: 200px;
          opacity: 0.8;
        }
      }
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
      .login-form {
        .md-field {
          padding-top: 10px;
          padding-bottom: 10px;
        }
        .md-field-item-title {
          width: 64px !important;
        }
        .md-field-item-content, .md-field-item-control {
          min-height: 50px !important;
          height: 72px;
        }
        .md-field-item-content {
          &::before {
            border-bottom-color: $linkFontColor !important;
          }
        }
        label,
        input {
          font-size: $FormFontSize !important;
          color: $mainFontColor;
          font-weight: lighter !important;
        }
        input {
          font-weight: normal !important;
        }
        .md-field {
          background: transparent;
        }
      }
    }
  }
}
</style>

