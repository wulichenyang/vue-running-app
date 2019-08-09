<template>
  <section class="user">
    <section class="bg-wrapper">
      <img
        src="../assets/img/user-bg.png"
        alt="背景墙"
      >
    </section>
    <Scroll class="user-wrapper">
      <div class="user-inner">
        <WrapperBox>
          <div
            class="user-header"
            @click="onEditInfo"
          >

            <!-- 头像 -->
            <img
              :src="user && user.avatar !== '' ? `/img/avatar/${user.avatar}` :'/img/avatar/head.jpg'"
              alt="头像"
            >

            <!-- 中间信息 -->
            <div class="user-info">
              <h2>{{user && user.nickname}}</h2>
              <p>{{user && user.brief}}</p>
            </div>

            <!-- 设置按钮 -->
            <div @click.stop="onClickSetting">
              <svg-icon
                class="place-svg"
                icon-class="setting"
              />
            </div>

          </div>
          <ul class="detail-number">
            <li
              :key="item.key"
              v-for="item in detailNumberList"
            >
              <span>{{item.number}}</span>
              <span>{{item.brief}}</span>
            </li>
          </ul>
        </WrapperBox>

        <!-- 我的信息 -->
        <WrapperBox title="我的信息">
          <IconList
            :iconList="detailList"
            :onClickCallback="onClickIcon"
          >
          </IconList>
        </WrapperBox>

        <!-- 待续模块 -->
        <WrapperBox title="敬请期待">
          <IconList :iconList="moreList">
          </IconList>
        </WrapperBox>
      </div>
    </Scroll>
    <transition name="right-left">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>



<script>
import Scroll from "@/components/BetterScroll/Scroll.vue";
import WrapperBox from "@/components/User/WrapperBox.vue";
import IconList from "@/components/User/IconList.vue";
import { mapGetters, mapActions } from "vuex";
// import { getUser } from "@/api/user";
import NoticeBar from "@/components/NoticeBar.vue";
import { ScrollView, Toast, Field, FieldItem, CellItem } from "mand-mobile";
export default {
  name: "user",
  components: {
    Map: Map,
    WrapperBox: WrapperBox,
    IconList: IconList,
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
    return {
      detailNumberList: [
        {
          key: 0,
          number: 52,
          brief: "好友"
        },
        {
          key: 1,
          number: 15,
          brief: "关注"
        },
        {
          key: 2,
          number: 225,
          brief: "粉丝"
        },
        {
          key: 3,
          number: 12,
          brief: "圈子"
        }
      ],
      detailList: [
        {
          key: 0,
          name: "mileage",
          brief: "信息总览",
          link: "userDetail"
        },
        {
          key: 1,
          name: "trend",
          brief: "出行趋势",
          link: "userTrend"
        },
        {
          key: 2,
          name: "Analysis",
          brief: "数据分析",
          link: "userAnalysis"
        },
        {
          key: 3,
          name: "Medal",
          brief: "成就殿堂"
        }
      ],
      moreList: [
        {
          key: 1,
          name: "p1",
          brief: "出行计划"
        },
        {
          key: 2,
          name: "p2",
          brief: "好友排名"
        },
        {
          key: 3,
          name: "p3",
          brief: "路况分析"
        },
        {
          key: 4,
          name: "p4",
          brief: "交通补助"
        },
        {
          key: 5,
          name: "p5",
          brief: "体重管理"
        },
        {
          key: 6,
          name: "p6",
          brief: "周报"
        },
        {
          key: 7,
          name: "p7",
          brief: "风险管理"
        },
        {
          key: 8,
          name: "p8",
          brief: "运动课堂"
        },
        {
          key: 9,
          name: "p9",
          brief: "智能硬件"
        },
        {
          key: 10,
          name: "p10",
          brief: "心悦会员"
        }
      ]
    };
  },

  methods: {
    ...mapActions(["getUser", "addLoading", "subLoading", "updateNoticeBar"]),
    onClickIcon(link) {
      if (link) {
        this.$router.push({
          name: link
        });
      }
    },
    onEditInfo() {
      this.$router.push({
        name: "userInfoDetail"
      });
    },
    onClickSetting() {
      this.$router.push({
        name: "setting"
      });
    }
  },
  computed: {
    ...mapGetters(["ifNotice", "noticeInfo", "user"])
  }
};
</script>
<style lang="scss">
@import "../assets/css/var.scss";
.user {
  position: relative;
  height: 100%;
  overflow: hidden;
  .bg-wrapper {
    width: 100%;
    height: 100%;
    background-color: $mainBgGrayColor;
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
      .user-header {
        display: flex;
        position: relative;
        margin-bottom: 20px;
        img {
          margin-top: 10px;
          margin-left: 10px;
          width: $avatarSize;
          height: $avatarSize;
          margin-right: 18px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: $avatarShadowSearchColor;
        }
        .user-info {
          flex: 1;
          margin-top: 10px;
          overflow: hidden;
          h2 {
            font-size: $tipTopFontSize;
          }
          p {
            margin-top: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .svg-icon {
          width: $iconFontSize !important;
          height: $iconFontSize !important;
          margin-top: 10px;
          margin-right: 20px;
        }
      }
      ul.detail-number {
        display: flex;
        justify-content: space-between;
        li {
          width: 25%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
.right-left-enter,
.right-left-leave-to {
  transform: translateX(100%);
}
.right-left-enter-active,
.right-left-leave-active {
  transition: ease 0.4s all;
}
</style>
