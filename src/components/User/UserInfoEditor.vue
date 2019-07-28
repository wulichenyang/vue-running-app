<template>
  <section class="user-info-editor">
    <BackHeader title="个人信息" />
    <SettingInfoSection>
      <md-field>
        <md-cell-item
          title="头像"
          addon="可用8000.34"
          arrow
        />
        <md-cell-item
          title="用户名"
          :addon="user.realname"
          arrow
        />
        <md-cell-item
          title="昵称"
          :addon="user.nickname"
          arrow
        />
        <md-cell-item
          title="性别"
          :addon="user.gender === 0 ? '女' : user.gender === 1 ? '男' : '未知'"
          arrow
        />
        <md-cell-item
          title="年龄"
          :addon="user.age === 0 ? '未知': user.age"
          arrow
        />
        <md-cell-item
          title="个性签名"
          :addon="user.brief"
          arrow
        />
        <md-cell-item
          title="地址"
          :addon="user.address"
          arrow
        />
      </md-field>
    </SettingInfoSection>

  </section>
</template>

<script>
import BackHeader from "@/components/BackHeader.vue";
import SettingInfoSection from "@/components/SettingInfoSection.vue";
import { Field, CellItem } from "mand-mobile";
import { mapGetters } from "vuex";

export default {
  name: "userInfoEditor",
  components: {
    BackHeader: BackHeader,
    SettingInfoSection: SettingInfoSection,
    [Field.name]: Field,
    [CellItem.name]: CellItem
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {}
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-info-editor {
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