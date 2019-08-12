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
        <!-- <Scroll
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
        > -->
        <md-scroll-view
          ref="historyScrollView"
          :scrolling-x="false"
          @refreshing="$_onRefresh"
          @end-reached="$_onEndReached"
        >
          <!-- 下拉刷新提示 -->
          <md-scroll-view-refresh
            slot="refresh"
            slot-scope="{ scrollTop, isRefreshActive, isRefreshing }"
            :scroll-top="scrollTop"
            :is-refreshing="isRefreshing"
            :is-refresh-active="isRefreshActive"
          ></md-scroll-view-refresh>

          <!-- 历史列表 -->
          <section>
            <md-field v-if="historyList.length > 0">
              <!-- <p
                class="refresh-tips"
                v-if="showPulldownInfo"
              >下拉刷新</p>
              <p
                class="refresh-tips"
                v-if="refreshing"
              >刷新中...</p> -->
              <md-cell-item
                v-for="historyItem in historyList"
                :key="historyItem._id"
                :title="historyItem.tripWay"
                :brief="tripOrTraffic(historyItem)"
                :addon="historyItem.date && historyItem.date.substring(0, 10)"
                @click="onClickDetail(historyItem)"
                arrow
              />
              <!-- <p
                class="refresh-tips"
                v-if="loadMore || noMoreData"
              >{{loadMore? '加载更多...' : noMoreData ? '没有更多数据啦~' : ''}}</p> -->
            </md-field>
            <div
              class="no-trip"
              v-else
            >
              <p class="refresh-tips">您还没有出行记录哟~</p>
            </div>
          </section>
          <!-- 上拉加载更多信息 -->
          <md-scroll-view-more
            slot="more"
            :is-finished="noMoreData"
          >
          </md-scroll-view-more>
        </md-scroll-view>
        <!-- </Scroll> -->
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
import {
  ScrollView,
  Toast,
  Field,
  FieldItem,
  CellItem,
  ScrollViewRefresh,
  ScrollViewMore
} from "mand-mobile";
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
    NoticeBar: NoticeBar,
    [ScrollViewRefresh.name]: ScrollViewRefresh,
    [ScrollViewMore.name]: ScrollViewMore
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

    // 重置上拉加载更多动作
    resetLoadmore() {
      this.$refs.historyScrollView.finishLoadMore();
    },

    // 重置刷新动作
    resetRefresh() {
      this.$refs.historyScrollView.finishRefresh();
    },

    // 下拉刷新
    async $_onRefresh() {
      // 下拉刷新，重置上拉加载
      this.resetLoadmore();
      await this.getHistory();
      this.$refs.historyScrollView.finishRefresh();
    },

    // 上拉加载更多
    $_onEndReached() {
      // 上拉加载更多，重置下拉刷新
      this.resetRefresh();
      this.getMoreHistory();
    },

    // 重置请求信息
    resetInfo() {
      this.refreshing = true;
      this.noMoreData = false;
      this.page = 0;
    },

    // 第一次请求历史数据
    async getHistory(refresh = true) {
      if (refresh) {
        this.addLoading();
      }
      this.resetInfo();
      let res = await getHistory(this.page++, this.limit);
      if (res.code === 0) {
        // 没有出行记录
        if (res.data.noMoreData) {
          this.subLoading();
          return;
        } else {
          this.subLoading();
          this.historyList = res.data;
        }
      } else if (res.code === 1) {
        Toast.failed(res.message);
      }
      if (!refresh) {
        this.subLoading();
      }
      this.updateNoticeBar({ msg: "已更新历史信息~" });
      this.refreshing = false;
    },

    // 第二次及以后请求数据
    async getMoreHistory() {
      // 还有更多的数据，可以请求
      if (this.noMoreData) {
        return;
      }
      if (!this.noMoreData && !this.refreshing) {
        // Loading more 动画
        // this.loadMore = true;
        let res = await getHistory(this.page++, this.limit);

        if (res.code === 0) {
          // 分页数据已全部加载
          if (res.data.noMoreData) {
            this.noMoreData = true;
          } else {
            this.historyList = [...this.historyList, ...res.data];
          }
          this.$refs.scrollView.finishLoadMore();
        } else if (res.code === 1) {
          Toast.failed(res.message);
          this.$refs.scrollView.finishLoadMore();
        }
        // setTimeout(() => {
        // this.loadMore = false;
        // }, 1000);
      }
    },

    // onLoadMoreHistory() {
    //   this.getMoreHistory();
    // },

    // onShowPulldown() {
    //   console.log("trigger");
    //   this.showPulldownInfo = true;
    // },

    // onHidePulldown() {
    //   this.showPulldownInfo = false;
    // },
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
        name: "historyDetail"
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
      .scroll-wrapper,
      .md-scroll-view {
        margin-top: 10px;
        height: calc(100% - 24px);
        overflow: hidden;
        .refresh-tips {
          text-align: center;
          margin: 5px 0;
          color: $linkFontColor;
        }
        .no-trip {
          text-align: center;
        }
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

