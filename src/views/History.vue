<template>
  <section class="history">
    <section
      v-if="this.$route.name === 'history'"
      class="history-brief"
    >
      <!-- Notice Bar -->
      <NoticeBar
        :ifNotice="ifNotice"
        :noticeInfo="noticeInfo"
      ></NoticeBar>
      <div class="inner-wrapper">
        <h1>
          出行历史
          <svg-icon icon-class="history-list" />
        </h1>
        <Scroll
          ref="scroll"
          :data="historyList"
          class="scroll-wrapper"
          :listenScroll="true"
          :pullup="true"
          :pulldown="true"
          @scrollToEnd="onLoadMoreHistory"
          @pulldown="getHistory(refresh=true)"
          @onShowPulldown="onShowPulldown"
          @onHidePulldown="onHidePulldown"
        >
          <md-field>
            <p v-if="showPulldownInfo">下拉刷新</p>
            <p v-if="refreshing">刷新中...</p>
            <md-cell-item
              :key="historyItem._id"
              v-for="historyItem in historyList"
              :title="historyItem.tripWay"
              :brief="tripOrTraffic(historyItem)"
              :addon="historyItem.date.substring(0, 10)"
              @click="onClickDetail(historyItem)"
              arrow
            />
            <p v-if="loadMore || noMoreData">{{loadMore? '加载更多...' : noMoreData ? '没有更多数据啦~' : ''}}</p>
          </md-field>
        </Scroll>
      </div>
    </section>
    <router-view></router-view>
  </section>
</template>

<script>
import Scroll from "@/components/BetterScroll/Scroll.vue";
import { mapGetters, mapActions } from "vuex";
import { getHistory } from "@/api/trip";
import NoticeBar from "@/components/NoticeBar.vue";
import { ScrollView, Toast, Field, FieldItem, CellItem } from "mand-mobile";
export default {
  name: "history",
  components: {
    Map: Map,
    // RefreshWrapper: RefreshWrapper,
    [ScrollView.name]: ScrollView,
    [Toast.name]: Toast,
    [CellItem.name]: CellItem,
    [Field.name]: Field,
    Scroll: Scroll,
    NoticeBar: NoticeBar
  },
  mounted() {
    //TODO: in vuex
    // if(!this.historyList) {

    // }
    this.getHistory();
  },
  data() {
    return {
      showPulldownInfo: false,
      historyList: [],
      // 下拉加载更多
      refreshing: false,
      // 上拉加载更多
      loadMore: false,
      page: 0,
      limit: 10,
      noMoreData: false
    };
  },

  methods: {
    async getHistory(refresh = false) {
      if (!refresh) {
        this.addLoading();
      }
      this.refreshing = true;
      this.noMoreData = false;
      this.page = 0;
      let res = await getHistory(this.page++, this.limit);
      if (res.code === 0) {
        this.historyList = res.data;
      } else if (res.code === 1) {
        Toast.failed(res.message);
      }
      if (!refresh) {
        this.subLoading();
      }
      this.updateNoticeBar({ msg: "已更新历史信息~" });
      this.refreshing = false;
    },

    async getMoreHistory() {
      // 还有更多的数据，可以请求
      if (!this.noMoreData && !this.refreshing) {
        // Loading more 动画
        this.loadMore = true;
        let res = await getHistory(this.page++, this.limit);

        if (res.code === 0) {
          // 分页数据已全部加载
          if (res.data.noMoreData) {
            this.noMoreData = true;
          } else {
            this.historyList = [...this.historyList, ...res.data];
          }
        } else if (res.code === 1) {
          Toast.failed(res.message);
        }
        setTimeout(() => {
          this.loadMore = false;
        }, 1000);
      }
    },

    onLoadMoreHistory() {
      this.getMoreHistory();
    },
    
    onShowPulldown() {
      console.log('trigger')
      this.showPulldownInfo = true
    },

    onHidePulldown() {
      this.showPulldownInfo = false
    },
    // async refreshHistory(finishRefresh) {
    //   let res = await getHistory();
    //   if (res.code === 0) {
    //     this.historyList = res.data;
    //     this.updateNoticeBar({ msg: "更新历史信息成功！" });
    //   } else if (res.code === 0) {
    //     this.updateNoticeBar({ msg: "更新历史信息失败" });
    //   }
    //   finishRefresh();
    // },
    // onRefreshHistory(finishRefresh) {
    //   this.refreshHistory(finishRefresh);
    // },
    tripOrTraffic(historyItem) {
      if (historyItem.type === "trip") {
        return `行程${historyItem.distance}公里`;
      } else if (historyItem.type === "traffic") {
        return `${historyItem.startPlace} - ${historyItem.endPlace}`;
      }
    },
    onClickDetail(historyDetail) {
      // 可以通过vuex设置historyDetailNow
      this.setHistoryDetail(historyDetail);
      this.$router.push({
        name: "historyDetail",
      });
      // 通过 params 传值给 route 但不能持久化存储
      // this.$router.push({
      //   name: "historyDetail",
      //   params: { historyDetail }
      // });
    },
    ...mapActions([
      "addLoading",
      "subLoading",
      "setHistoryDetail",
      "updateNoticeBar"
    ])
  },
  computed: {
    ...mapGetters(["ifNotice", "noticeInfo"])
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.history {
  height: 100%;
  .history-brief {
    height: 100%;
    .inner-wrapper {
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      h1 {
        font-size: $titleFontSize;
        color: $confirmBtnColor;
        overflow: hidden;
      }
      svg {
        filter: drop-shadow($confirmBtnColor 999px 0);
        transform: translateX(-999px);
      }
      .scroll-wrapper {
        margin-top: 10px;
        height: calc(100% - 24px);
        overflow: hidden;
        .md-field {
          padding: 0;
        }
        .md-cell-item-title {
          font-size: $titleFontSize;
        }
        .md-cell-item-body {
          padding: 6px 0 0 0;
          min-height: 68px !important;
        }
        .md-cell-item-brief,
        .md-cell-item-right {
          font-size: $briefFontSize;
          i {
            font-size: $briefFontSize !important;
          }
        }
        .md-cell-item-right {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

