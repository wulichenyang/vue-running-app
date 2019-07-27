<template>
  <section class="user">
    <section class="bg-wrapper">
      <img
        src="../assets/img/user-bg.png"
        alt="背景墙"
      >
    </section>
    <section class="user-wrapper">
      <div class="user-inner">
        <WrapperBox>
          {{
            user
          }}
        </WrapperBox>
        <WrapperBox
          title="我的信息"
        >
          {{
            user
          }}
        </WrapperBox>
        <WrapperBox
          title="更多功能"
        >
          {{
            user
          }}
        </WrapperBox>
      </div>
    </section>
  </section>
</template>



<script>
import Scroll from "@/components/BetterScroll/Scroll.vue";
import WrapperBox from "@/components/User/WrapperBox.vue";
import { mapGetters, mapActions } from "vuex";
import { getUser } from "@/api/user";
import NoticeBar from "@/components/NoticeBar.vue";
import { ScrollView, Toast, Field, FieldItem, CellItem } from "mand-mobile";
export default {
  name: "history",
  components: {
    Map: Map,
    WrapperBox: WrapperBox,
    [ScrollView.name]: ScrollView,
    [Toast.name]: Toast,
    [CellItem.name]: CellItem,
    [Field.name]: Field,
    Scroll: Scroll,
    NoticeBar: NoticeBar
  },
  mounted() {
    if (!this.user) {
      // Vuex 里没有缓存 user 数据时请求数据
      this.getUser();
    }
  },

  data() {
    return {};
  },

  methods: {
    ...mapActions(["getUser", "addLoading", "subLoading", "updateNoticeBar"])
  },
  computed: {
    ...mapGetters(["ifNotice", "noticeInfo", "user"])
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";
.user {
  height: 100%;
  .bg-wrapper {
    width: 100%;
    height: auto;
    img {
      width: 100%;
      height: auto;
    }
  }
  .user-wrapper {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 64px;
    .user-inner {
      padding: 0 14px;
    }
  }
}
</style>
