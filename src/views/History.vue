<template>
  <section class="history">
    <div class="inner-wrapper">
      <h1>
        出行历史
        <svg-icon icon-class="history-list" />
      </h1>
      <md-scroll-view
        ref="scrollView"
        @scroll="$_onScroll"
        :scrolling-x="false"
      >
        <md-field>
          <md-cell-item
            :key="historyItem._id"
            v-for="historyItem in historyList"
            :title="historyItem.tripWay"
            :brief="tripOrTraffic(historyItem)"
            :addon="historyItem.date.substring(0, 10)"
            arrow
          />
        </md-field>
      </md-scroll-view>
    </div>
  </section>
</template>


<script>
// TODO: fix scroll all
import Map from "@/components/Map.vue";
import { getHistory } from "@/api/trip";
import { mapActions } from "vuex";
import { ScrollView, Toast, Field, FieldItem, CellItem } from "mand-mobile";
export default {
  name: "history",
  components: {
    Map: Map,
    [ScrollView.name]: ScrollView,
    [Toast.name]: Toast,
    [CellItem.name]: CellItem,
    [Field.name]: Field
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
    tripOrTraffic(historyItem) {
      if (historyItem.type === "trip") {
        return `行程${historyItem.distance}公里`;
      } else if (historyItem.type === "traffic") {
        return `${historyItem.startPlace} - ${historyItem.endPlace}`;
      }
    },
    ...mapActions(["addLoading", "subLoading"])
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";

.history {
  .inner-wrapper {
    padding: 20px;
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
  }
}
</style>

