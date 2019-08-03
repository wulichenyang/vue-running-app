<template>
  <section class="about">
    <BackHeader title="关于" />
    <SettingInfoSection>
      <p>关于你的一切~</p>
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

// TODO: Add Better-Scroll in some pages
export default {
  name: "about",
  components: {
    BackHeader: BackHeader,
    SettingInfoSection: SettingInfoSection,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "editing"])
  },
  methods: {
    ...mapActions(["setUserEditing", "getUser"])
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.about {
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