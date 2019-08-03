<template>
  <div
    class="signup"
    @keyup.enter="onSignup"
  >
    <!-- Notice Bar -->
    <!-- <NoticeBar :ifNotice="ifNotice" :noticeInfo="noticeInfo"></NoticeBar> -->
    <section class="signup-bg-wrapper">
      <div class="signup-wrapper">
        <!-- Title -->
        <div class="title">
          <img src="../assets/img/logo1.png" />
        </div>
        <!-- Signup Form-->
        <div class="signup-form">
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
        <!-- Signup Button -->
        <ConfirmButton
          text="注册"
          @onClickButton="onSignup"
        ></ConfirmButton>
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
import { signup } from "../api/user";

const phoneTest = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
export default {
  name: "signup",
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
    async onSignup() {
      if (this.onPhoneCheck() && this.onPasswordCheck()) {
        console.log("signing");
        this.posting = true;
        let res = await signup(this.phone, md5(this.password));
        // Success
        if (res.code === 0) {
          // TODO posting
          this.posting = false;
          this.resetForm();
          Toast.succeed(res.message);
          this.$router.push({ path: "login" });
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
      } else if (this.password.length > 20) {
        this.passwordError = "* 密码不要超过20位";
        return false;
      } else {
        this.passwordError = "";
        return true;
      }
    },
    ...mapActions([])
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";

.signup {
  width: 100%;
  height: 100%;
  .signup-bg-wrapper {
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
    .signup-wrapper {
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
      .signup-form {
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
      .start-btn-wrapper {
        padding-left: 40px;
        padding-right: 40px;
        .start-btn {
          width: 100%;
        }
      }
    }
  }
}
</style>

