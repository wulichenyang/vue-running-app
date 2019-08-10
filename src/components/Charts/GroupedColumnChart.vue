<template>
  <section
    id="grouped-column-chart"
    class="grouped-column-chart"
  ></section>
</template>

<script>
import G2 from "@antv/g2";

export default {
  name: "groupedColumnChart",
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  // mounted() {
  //   // TODO: 思考挂载过程 => mounted两次
  //   console.log("wer", this.data);
  //   this.initChart(this.data);
  // },
  data() {
    return {};
  },
  watch: {
    data(newData) {
      this.initChart(newData);
    }
  },
  methods: {
    initChart(data) {
      if (data.length === 0) {
        return;
      }
      console.log(data);
      var chart = new G2.Chart({
        container: "grouped-column-chart",
        forceFit: true,
        height: 400,
        padding: ["auto", 60, "auto", 60]
      });
      chart.source(data);
      chart.scale("y", {
        alias: "里程",
        // max: 75,
        min: 0,
        tickCount: 4
      });
      // chart.scale("x", {
        // });
      // Date like year-month-day formate will be parsed as linear data date。
      // So you must set the date scale's type as 'cat'.
      chart.scale({
        x: {
          type: "timeCat" // 为属性定义别名
        }
      });
      chart.axis("x", {
        label: {
          textStyle: {
            fill: "#aaaaaa"
          }
        },
        tickLine: {
          alignWithLabel: false,
          length: 0
        }
      });

      chart.axis("y", {
        label: {
          textStyle: {
            fill: "#aaaaaa"
          }
        },
        title: {
          offset: 50
        }
      });

      chart.legend({
        position: "top-center"
      });
      chart
        .interval()
        .position("x*y")
        .color("name")
        .opacity(1)
        .adjust([
          {
            type: "dodge",
            marginRatio: 1 / 32
          }
        ]);
      chart.render();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.grouped-column-chart {
  // TODO: fix height
  position: relative;
  min-height: 200px;
  // padding: 20px
}
</style>