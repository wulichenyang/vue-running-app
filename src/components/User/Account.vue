<template>
  <section class="user-account">
    <BackHeader title="账号与安全" />
    <SettingInfoSection>
      <md-field>
        <md-cell-item
          title="登录密码"
          arrow
          @click="onEditText(title = '密码', key = 'password' , value = undefined, length = 20)"
          addon="修改"
        />
      </md-field>
    </SettingInfoSection>

    <transition name="right-left">
      <router-view></router-view>
    </transition>

  </section>
</template>

<script>
import BackHeader from "@/components/BackHeader.vue";
import SettingInfoSection from "@/components/SettingInfoSection.vue";
import { Field, CellItem, Toast, Selector, DatePicker } from "mand-mobile";
import { mapGetters, mapActions } from "vuex";
import { updateUser } from "../../api/user";
import { localDate } from "@/utils/time.js";

// TODO: Add Better-Scroll in some pages
export default {
  name: "setting",
  components: {
    BackHeader: BackHeader,
    SettingInfoSection: SettingInfoSection,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [Selector.name]: Selector
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "editing"])
  },
  methods: {
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
    // TODO:
    // - fix taking photo for avatar
    // - diable submit button

    // async onChooseGender({ text, value }) {
    //   console.log(value);
    //   let res = await updateUser("gender", value);
    //   if (res.code === 0) {
    //     this.getUser();
    //   } else {
    //     Toast.failed(res.message);
    //   }
    // },
    ...mapActions(["setUserEditing", "getUser"])
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-account {
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
  // .md-selector {
  //   zoom: 0.5;
  // }
}
</style>