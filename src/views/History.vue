<template>
  <section class="history">
    <!-- TODO: Fix conflict between refresh wrapper and scroll -->
    <!-- Notice Bar -->
    <NoticeBar
      :ifNotice="ifNotice"
      :noticeInfo="noticeInfo"
    ></NoticeBar>
    <RefreshWrapper @onRefresh="onRefreshHistory">
      <section
        v-if="this.$route.name === 'history'"
        class="history-brief"
      >
        <div class="inner-wrapper">
          <h1>
            出行历史
            <svg-icon icon-class="history-list" />
          </h1>
          <Scroll
            ref="scroll"
            :data="historyList"
            class="scroll-wrapper"
          >
            <md-field>
              <md-cell-item
                :key="historyItem._id"
                v-for="historyItem in historyList"
                :title="historyItem.tripWay"
                :brief="tripOrTraffic(historyItem)"
                :addon="historyItem.date.substring(0, 10)"
                @click="onClickDetail(historyItem)"
                arrow
              />
            </md-field>
          </Scroll>
        </div>
      </section>
    </RefreshWrapper>
    <router-view></router-view>
  </section>
</template>

<script>
import RefreshWrapper from "@/components/RefreshWrapper.vue";
import Scroll from "@/components/BetterScroll/Scroll.vue";
import { mapGetters, mapActions } from "vuex";
import { getHistory } from "@/api/trip";
import NoticeBar from "@/components/NoticeBar.vue";
import { ScrollView, Toast, Field, FieldItem, CellItem } from "mand-mobile";
export default {
  name: "history",
  components: {
    Map: Map,
    RefreshWrapper: RefreshWrapper,
    [ScrollView.name]: ScrollView,
    [Toast.name]: Toast,
    [CellItem.name]: CellItem,
    [Field.name]: Field,
    Scroll: Scroll,
    NoticeBar: NoticeBar
  },
  mounted() {
    this.getHistory();
  },
  data() {
    return {
      historyList: []
    };
  },

  methods: {
    async getHistory() {
      this.addLoading();
      let res = await getHistory();
      if (res.code === 0) {
        this.historyList = res.data;
        this.subLoading();
      } else if (res.code === 1) {
        Toast.failed(res.message);
        this.subLoading();
      }
    },
    async refreshHistory(finishRefresh) {
      let res = await getHistory();
      if (res.code === 0) {
        this.historyList = res.data;
        this.updateNoticeBar({ msg: "更新历史信息成功！" });
      } else if (res.code === 0) {
        this.updateNoticeBar({ msg: "更新历史信息失败" });
      }
      finishRefresh();
    },
    onRefreshHistory(finishRefresh) {
      this.refreshHistory(finishRefresh);
    },
    tripOrTraffic(historyItem) {
      if (historyItem.type === "trip") {
        return `行程${historyItem.distance}公里`;
      } else if (historyItem.type === "traffic") {
        return `${historyItem.startPlace} - ${historyItem.endPlace}`;
      }
    },
    onClickDetail(historyDetail) {
      // 可以通过vuex设置historyDetailNow
      // this.setHistoryDetail(historyDetail);
      this.$router.push({
        name: "historyDetail",
        params: { historyDetail }
      });
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

