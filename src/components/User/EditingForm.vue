<template>
  <section class="editing-form">
    <BackHeader
      :title="`修改${editing.title}`"
      rightText="确定"
      @onClickRight="onSubmitForm"
    />
    <!-- 昵称/用户名/个性签名 -->
    <SettingInfoSection v-if="editing.key == 'realname' || editing.key == 'nickname' || editing.key == 'brief'">
      <md-field>
        <md-input-item
          v-model="inputValue"
          :title="`${editing.title}`"
          is-amount
          :maxlength="editing.length"
        ></md-input-item>
      </md-field>
    </SettingInfoSection>
    <!-- 性别
    <SettingInfoSection v-else-if="editing.key === 'gender'">
      <md-field>

      </md-field>
    </SettingInfoSection> -->
    <!-- 生日
    <SettingInfoSection v-else-if="editing.key === 'birthday'">
      <md-field>
      </md-field>
    </SettingInfoSection> -->

  </section>
</template>

<script>
import BackHeader from "@/components/BackHeader.vue";
import SettingInfoSection from "@/components/SettingInfoSection.vue";
import { updateUser } from "@/api/user";
import { Field, CellItem, Toast, InputItem } from "mand-mobile";
import { mapGetters, mapActions } from "vuex";

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
      inputValue: ""
    };
  },
  mounted() {
    this.inputValue = this.editing.value;
  },
  computed: {
    ...mapGetters(["user", "editing"])
  },
  methods: {
    async onSubmitForm() {
      // 更新
      let res = await updateUser(this.editing.key, this.inputValue.trim());
      if (res.code === 0) {
        // 成功后重新获取用户数据
        Toast.succeed(res.message);
        this.getUser();
        this.$router.go(-1);
      } else if (res.code === 1) {
        // 更新失败
        Toast.failed(res.message);
      }
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