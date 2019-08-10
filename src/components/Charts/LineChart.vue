<template>
  <section
    :id="id"
    class="line-chart"
  ></section>
</template>

<script>
import G2 from "@antv/g2";

export default {
  name: "lineChart",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: 'line-chart'
    }
  },
  // mounted() {
  //   this.initLineChart(this.data);
  // },
  data() {
    return {};
  },
  watch: {
    data(newData) {
      this.initLineChart(newData);
    }
  },
  methods: {
    initLineChart(data) {
      if (this.data.length === 0) {
        return;
      }
      console.log(data);
      var chart = new G2.Chart({
        container: this.id,
        forceFit: true,
        height: 400,
        padding: [100, 50, 30, 45] // 上右下左
      });
      chart.source(data);
      chart.tooltip({
        follow: false,
        crosshairs: "y",
        htmlContent: function htmlContent(title, items) {
          var alias = {
            '步行': "步行里程数",
            '跑步': "跑步里程数",
            '骑行': "骑行里程数",
            '驾车': "驾车里程数",
            '公交': "公交里程数",
            '打车': "打车里程数",
            '公交/地铁': "公交/地铁里程数",
            '出租车': "出租车里程数",
            '单车/电车': "单车/电车里程数",
          };
          var html = '<div class="custom-tooltip">';
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var color = item.color;
            var name = alias[item.name];
            var value = item.value;
            var domHead =
              '<div class="custom-tooltip-item" style="border-left-color:' +
              color +
              '">';
            var domName =
              '<div class="custom-tooltip-item-name">' + name + "</div>";
            var domValue =
              '<div class="custom-tooltip-item-value">' + value + "</div>";
            var domTail = "</div>";
            html += domHead + domName + domValue + domTail;
          }
          return html + "</div>";
        }
      });
      chart.axis("x", {
        label: {
          textStyle: {
            fill: "#aaaaaa"
          }
        }
      });
      chart.axis("value", {
        label: {
          textStyle: {
            fill: "#aaaaaa"
          },
          formatter: function formatter(text) {
            return text.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
          }
        }
      });
      chart.legend(false);
      chart
        .line()
        .position("x*y")
        .color("type");
      chart.render();
      chart.showTooltip({
        x: document.getElementById(this.id).offsetWidth - 20,
        y: 100
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.line-chart {
  // TODO: fix height
  position: relative;
  min-height: 200px;
  // padding: 20px
  .custom-tooltip {
    margin: 16px 16px 0 16px;
    width: 100% !important;
    height: 10% !important;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .custom-tooltip-item {
    width: 150px;
    height: 50px;
    position: relative;
    float: left;
    margin-left: 20px;
    border-left-style: solid;
    border-left-width: 5px;
  }

  .custom-tooltip-item:first-child {
    margin-left: 0;
  }

  .custom-tooltip-item-name {
    width: 80%;
    height: 20px;
    position: absolute;
    top: 0px;
    left: 10px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  .custom-tooltip-item-value {
    width: 80%;
    height: 24px;
    position: absolute;
    bottom: 0px;
    left: 10px;
    color: #262626;
    font-size: 22px;
    /*font-weight: bold*/
  }
}
</style>