<template>
  <section
    id="pie"
    class="pie"
  ></section>
</template>

<script>
import G2 from "@antv/g2";

export default {
  name: "pie",
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    // TODO: 思考挂载过程 => mounted两次
    this.initPie(this.data);
  },
  data() {
    return {
    };
  },
  methods: {
    initPie(data) {
      if(data.length === 0) {
        return;
      }
      console.log(data)
      var chart = new G2.Chart({
        container: "pie",
        forceFit: true,
      });
      chart.source(data, {
        percent: {
          formatter: function formatter(val) {
            val = val * 100 + "%";
            return val;
          }
        }
      });
      chart.coord("theta", {
        radius: 0.75,
        innerRadius: 0.6
      });
      chart.tooltip({
        showTitle: false,
        itemTpl:
          '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      // 辅助文本
      chart.guide().html({
        position: ["50%", "50%"],
        html:
          '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">主机<br><span style="color:#8c8c8c;font-size:20px">200</span>台</div>',
        alignX: "middle",
        alignY: "middle"
      });
      var interval = chart
        .intervalStack()
        .position("percent")
        .color("item")
        .label("percent", {
          formatter: function formatter(val, item) {
            return item.point.item + ": " + val;
          }
        })
        .tooltip("item*percent", function(item, percent) {
          percent = percent * 100 + "%";
          return {
            name: item,
            value: percent
          };
        })
        .style({
          lineWidth: 1,
          stroke: "#fff"
        });
      chart.render();
      interval.setSelected(data[0]);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.pie {
  // TODO: fix height
  position: relative;
  min-height: 400px;
  padding: 20px;
  canvas {
    min-height: 100%;
  }
}
</style>