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
  // updated() {
  //   // TODO: 思考挂载过程 => mounted两次
  //   console.log(this.data);
  //   this.initPie(this.data);
  // },
  data() {
    return {};
  },
  watch: {
    data(newData) {
      console.log(123);
      this.initPie(newData);
    }
  },
  methods: {
    initPie(data) {
      if (data.length === 0) {
        return;
      }
      console.log(data);
      var chart = new G2.Chart({
        container: "pie",
        forceFit: true,
        height: 400,
        padding: ["auto", 50, "auto", 50]
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
  min-height: 200px;
  // padding: 20px
}
</style>