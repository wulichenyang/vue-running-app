<template>
  <section class="editing-form">
    <BackHeader
      :title="`修改${editing.title}`"
      rightText="确定"
      @onClickRight="onSubmitForm"
    />

    <!-- 昵称/用户名/个性签名 -->
    <SettingInfoSection v-if="editing && editing.key == 'realname' || editing && editing.key == 'nickname' || editing.key == 'brief'">
      <md-field>
        <md-input-item
          v-model="inputValue"
          :title="`${editing.title}`"
          is-amount
          :maxlength="editing.length"
        ></md-input-item>
      </md-field>
    </SettingInfoSection>

    <!-- 修改密码 -->
    <SettingInfoSection v-else-if="editing.key === 'password'">
      <md-field>
        <md-input-item
          v-model="prevPassword"
          :title="`旧${editing.title}`"
          type="password"
          is-amount
          :maxlength="editing.length"
        ></md-input-item>
      </md-field>
      <md-field>
        <md-input-item
          v-model="newPassword"
          :title="`新${editing.title}`"
          type="password"
          is-amount
          :maxlength="editing.length"
        ></md-input-item>
      </md-field>
    </SettingInfoSection>

  </section>
</template>

<script>
import BackHeader from "@/components/BackHeader.vue";
import SettingInfoSection from "@/components/SettingInfoSection.vue";
import { updateUser, checkPrevPassword } from "@/api/user";
import { Field, CellItem, Toast, InputItem } from "mand-mobile";
import { mapGetters, mapActions } from "vuex";
import md5 from "md5";

export default {
  name: "editingForm",
  components: {
    BackHeader: BackHeader,
    SettingInfoSection: SettingInfoSection,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [Toast.name]: Toast,
    [InputItem.name]: InputItem
  },
  props: {},
  data() {
    return {
      // 昵称/用户名/个性签名
      inputValue: "",
      // 新旧密码
      prevPassword: "",
      newPassword: "",
      submitting: false // 表单提交中
    };
  },
  mounted() {
    this.inputValue = this.editing.value;
  },
  computed: {
    ...mapGetters(["user", "editing"])
  },
  methods: {
    checkPassword(prevPassword, newPassword) {
      let err = null;
      if (prevPassword === newPassword) {
        err = "新密码和旧密码相同";
      } else if (prevPassword.length === 0 || newPassword.length === 0) {
        err = "密码不能为空";
      } else if (prevPassword.length < 4 || newPassword.length < 4) {
        err = "请填写超过3位的密码";
      } else if (prevPassword.length > 20 || newPassword.length > 20) {
        err = "密码不要超过20位";
      }
      return err;
    },

    clearPassword() {
      this.prevPassword = "";
      this.newPassword = "";
    },

    async updateUserInfo() {
      // 提交中返回
      if (this.submitting) {
        return;
      }
      this.submitting = true;
      // 修改用户信息
      let res = await updateUser(this.editing.key, this.inputValue);
      if (res.code === 0) {
        // 成功后重新获取用户数据
        Toast.succeed(res.message);
        this.getUser();
        this.$router.go(-1);
      } else if (res.code === 1) {
        // 更新失败
        Toast.failed(res.message);
      }
      // 重置提交中flag
      this.submitting = false;
      // 清除密码表单
      if (this.editing.key === "password") {
        this.clearPassword();
      }
    },

    async onSubmitForm() {
      if (this.editing.key === "password") {
        // 检查两个密码格式
        let err = this.checkPassword(this.prevPassword, this.newPassword);
        if (err) {
          Toast.failed(err);
          return;
        }
        // 检查之旧密码是否正确
        let res = await checkPrevPassword(md5(this.prevPassword));
        if (res.code === 1) {
          // 旧密码不正确
          Toast.failed("旧密码不正确");
          return;
        }
        // 允许更改密码
        this.inputValue = md5(this.newPassword);
      }

      // 更新用户信息
      this.updateUserInfo();
    },
    ...mapActions(["getUser"])
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.editing-form {
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
  }
}
</style>