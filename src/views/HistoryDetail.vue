<template>
  <section class="history-detail">
    {{
      historyDetail
    }}
  </section>
</template>

<script>
import Scroll from "@/components/BetterScroll/Scroll.vue";

// import Map from "@/components/Map.vue";
// import { getHistory } from "@/api/trip";
import { mapActions, mapGetters } from "vuex";
import { ScrollView, Toast, Field, FieldItem, CellItem } from "mand-mobile";
export default {
  name: "history",
  components: {
    Map: Map,
    [ScrollView.name]: ScrollView,
    [Toast.name]: Toast,
    [CellItem.name]: CellItem,
    [Field.name]: Field,
    Scroll: Scroll
  },
  mounted() {
    this.historyDetail = this.$route.params.historyDetail;
  },
  data() {
    return {

    };
  },
  methods: {

  },
  computed: {
    ...mapGetters(["historyDetail"])
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";

.history-detail {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: $mainBgColor;
  z-index: 1000;
}
</style>

