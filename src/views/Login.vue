<template>
  <div
    class="login"
    @keyup.enter="onLogin"
  >
    <!-- Notice Bar -->
    <!-- <NoticeBar :ifNotice="ifNotice" :noticeInfo="noticeInfo"></NoticeBar> -->
    <section class="login-bg-wrapper">
      <div class="login-wrapper">
        <!-- Title -->
        <div class="title">
          <img src="../assets/img/logo1.png" />
        </div>
        <!-- Login Form-->
        <div class="login-form">
          <md-field>
            <md-input-item
              @keyup="onPhoneCheck"
              title="手机号"
              type="phone"
              v-model="phone"
              align="left"
            ></md-input-item>
            <p
              class="error"
              v-show="phoneError"
            >{{phoneError}}</p>
            <md-input-item
              @keyup="onPasswordCheck"
              title="密码"
              type="password"
              v-model="password"
              align="left"
            ></md-input-item>
            <p
              class="error"
              v-show="passwordError"
            >{{passwordError}}</p>
          </md-field>
        </div>
        <!-- Login Button -->
        <section class="button-group">
          <ConfirmButton
            text="注册"
            @onClickButton="toSignUp"
          ></ConfirmButton>
          <ConfirmButton
            text="登录"
            @onClickButton="onLogin"
          ></ConfirmButton>
        </section>
      </div>
    </section>
  </div>
</template>
<script>
import { InputItem, Field, Toast } from "mand-mobile";
import NoticeBar from "@/components/NoticeBar.vue";
import ConfirmButton from "@/components/ConfirmButton.vue";
import { mapGetters, mapActions } from "vuex";
import md5 from "md5";
import { login } from "../api/user";
import { access_token } from "../configs";
import cookie from "../utils/cookie";

const phoneTest = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
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
      password: "",
      phoneError: "",
      passwordError: "",
      posting: false
    };
  },
  computed: {
    // ...mapGetters(["ifNotice"])
  },
  mounted() {},
  methods: {
    setCookie(token) {
      // TODO: 修改为：多账号同时登录token保存
      // 移除之前的账号token信息
      if (cookie.getCookie(access_token) !== "") {
        cookie.removeCookie(access_token);
      }
      cookie.setCookie(access_token, token, 24 * 30); // 30 天
    },
    // TODO listen to enter key
    async onLogin() {
      if (this.onPhoneCheck() && this.onPasswordCheck()) {
        console.log("logging");
        this.posting = true;
        let res = await login(this.phone, md5(this.password));
        // Success
        if (res.code === 0) {
          // TODO posting
          this.posting = false;
          this.resetForm();
          // 清除之前的vuex
          this.clearAllInfo();
          // 清除之前的token，并设置新cookie
          this.setCookie(res.data.token);
          Toast.succeed(res.message);
          this.$router.push({ path: "/" });
        } else if (res.code === 1) {
          // Fail
          this.posting = false;
          Toast.failed(res.message);
        }
      }
    },

    resetForm() {
      this.phone = "";
      this.password = "";
    },

    onPhoneCheck() {
      if (this.phone.length !== 11) {
        this.phoneError = "* 请填写11位手机号";
        return false;
      } else if (!phoneTest.test(this.phone)) {
        this.phoneError = "* 手机号格式错误";
        return false;
      } else {
        this.phoneError = "";
        return true;
      }
    },
    onPasswordCheck() {
      if (this.password.length === 0) {
        this.passwordError = "* 密码不能为空";
        return false;
      } else if (this.password.length < 4) {
        this.passwordError = "* 请填写超过3位的密码";
        return false;
      } else {
        this.passwordError = "";
        return true;
      }
    },
    toSignUp() {
      this.$router.push({ path: "signup" });
    },
    ...mapActions(["clearAllInfo"])
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
        p.error {
          margin-top: 5px;
        }
        .md-field {
          padding-top: 10px;
          padding-bottom: 10px;
        }
        .md-field-item-title {
          width: 64px !important;
        }
        .md-field-item-content,
        .md-field-item-control {
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
          font-size: $formFontSize !important;
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
      .button-group {
        display: flex;
        text-align: center;
        justify-content: space-between;
        padding-left: 40px;
        padding-right: 40px;
        .start-btn-wrapper {
          flex: 0.45;
          width: 45%;
          .start-btn {
            width: 100%;
          }
        }
        .start-btn-wrapper:nth-child(1) {
          .start-btn {
            background-color: transparent !important;
            color: $mainFontColor;
            border: $buttonBorder;
          }
        }
      }
    }
  }
}
</style>

