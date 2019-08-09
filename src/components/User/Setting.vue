<template>
  <section class="user-setting">
    <BackHeader title="设置" />
    <SettingInfoSection>
      <md-field>
        <md-cell-item
          title="个人信息"
          arrow
          @click="onEditInfo"
        />
        <md-cell-item
          title="账号与安全"
          arrow
          @click="onClickAccount"
        />
      </md-field>
    </SettingInfoSection>

    <SettingInfoSection>
      <md-field>
        <md-cell-item
          title="关于"
          arrow
          @click="onEditText(title = '用户名', key = 'realname' , value = user && user.realname, length = 6)"
        />
      </md-field>
    </SettingInfoSection>

    <!-- 登出 -->
    <!-- TODO 退出后有残余信息 -->
    <ConfirmButton
      text="退出账号"
      @onClickButton="onConfirmLogout"
    ></ConfirmButton>

    <transition name="right-left">
      <router-view></router-view>
    </transition>

  </section>
</template>

<script>
import ConfirmButton from "@/components/ConfirmButton.vue";
import BackHeader from "@/components/BackHeader.vue";
import SettingInfoSection from "@/components/SettingInfoSection.vue";
import { Field, CellItem, Toast, Dialog } from "mand-mobile";
import { mapGetters, mapActions } from "vuex";
import cookie from "@/utils/cookie";
import { access_token } from "@/configs";

export default {
  name: "setting",
  components: {
    BackHeader: BackHeader,
    SettingInfoSection: SettingInfoSection,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    ConfirmButton: ConfirmButton
  },
  props: {},
  data() {
    return {
      posting: false
    };
  },
  computed: {
    ...mapGetters(["user", "editing"])
  },
  methods: {
    onEditInfo() {
      this.$router.push({
        name: "userInfoDetail"
      });
    },
    // 修改文本
    onEditText(title, key, value, length) {
      this.setUserEditing({
        title,
        key,
        value,
        length
      });
      this.$router.push({
        name: "editingForm"
      });
    },
    onClickAccount() {
      this.$router.push({
        name: "account"
      });
    },

    // TODO:
    // - fix taking photo for avatar
    // - diable submit button
    onConfirmLogout() {
      Dialog.confirm({
        title: "退出",
        content: "确认退出吗",
        cancelText: "取消",
        confirmText: "确定",
        onConfirm: () => {
          this.logout();
        }
      });
    },
    logout() {
      // 清空Vuex里所有信息
      cookie.removeCookie(access_token);
      this.$router.push({ name: "login" });
      this.clearAllInfo();
      Toast.succeed("您已退出");
    },
    ...mapActions(["setUserEditing", "getUser", "clearAllInfo"])
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-setting {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
  transition: all ease 0.4s;
  background-color: $mainBgGrayColor;
  .md-field {
    zoom: 0.5;
    padding: 0;
    .md-cell-item-right {
    }
  }
  .start-btn-wrapper {
    position: absolute;
    left: 40px;
    right: 40px;
    bottom: 20px;
    z-index: 1000;
    button {
      box-sizing: border-box;
      width: 100%;
    }
  }
}
.md-popup-box {
  width: 100%;
  margin: 40px;
  .md-dialog-content {
    width: initial !important;
    margin: 0 auto;
    zoom: 0.5;
  }
}
</style>