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
          <div class="user-header">
            <img
              src="../assets/img/head.jpeg"
              alt="头像"
            >
            <div class="user-info">
              <h2>{{user.realname}}</h2>
              <p>账号: {{user.phone}}</p>
            </div>
          </div>
          <ul class="detail-number">
            <li>
              <span>53</span>
              <span>好友</span>
            </li>
            <li>
              <span>23</span>
              <span>关注</span>
            </li>
            <li>
              <span>124</span>
              <span>粉丝</span>
            </li>
            <li>
              <span>3</span>
              <span>圈子</span>
            </li>
          </ul>
        </WrapperBox>
        <WrapperBox title="我的信息">
          <IconList :iconList="detailList">
          </IconList>
        </WrapperBox>
        <WrapperBox title="更多功能">
          <IconList :iconList="moreList">
          </IconList>
        </WrapperBox>
      </div>
    </section>
  </section>
</template>



<script>
import Scroll from "@/components/BetterScroll/Scroll.vue";
import WrapperBox from "@/components/User/WrapperBox.vue";
import IconList from "@/components/User/IconList.vue";
import { mapGetters, mapActions } from "vuex";
import { getUser } from "@/api/user";
import NoticeBar from "@/components/NoticeBar.vue";
import { ScrollView, Toast, Field, FieldItem, CellItem } from "mand-mobile";
export default {
  name: "history",
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
      detailList: [
        {
          name: "mileage",
          brief: "信息总览"
        },
        {
          name: "trend",
          brief: "出行趋势"
        },
        {
          name: "Analysis",
          brief: "数据分析"
        },
        {
          name: "Medal",
          brief: "成就殿堂"
        }
      ],
      moreList: [
        {
          name: "p1",
          brief: "出行计划"
        },
        {
          name: "p2",
          brief: "好友排名"
        },
        {
          name: "p3",
          brief: "路况分析"
        },
        {
          name: "p4",
          brief: "交通补助"
        },
        {
          name: "p5",
          brief: "体重管理"
        },
        {
          name: "p6",
          brief: "周报"
        },
        {
          name: "p7",
          brief: "风险管理"
        },
        {
          name: "p8",
          brief: "运动课堂"
        },
        {
          name: "p9",
          brief: "智能硬件"
        },
        {
          name: "p10",
          brief: "心悦会员"
        }
      ]
    };
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
      .user-header {
        display: flex;
        margin-bottom: 20px;
        img {
          margin-top: 10px;
          margin-left: 10px;
          width: $avatarSize;
          height: $avatarSize;
          margin-right: 18px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: $boxShadowSearchColor;
        }
        .user-info {
          flex: 1;

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
</style>
