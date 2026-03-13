import { defineClientConfig } from "vuepress/client";
import ChartJS from "/Users/chensifang/code/loop/node_modules/@vuepress/plugin-markdown-chart/dist/client/components/ChartJS.js";
import ECharts from "/Users/chensifang/code/loop/node_modules/@vuepress/plugin-markdown-chart/dist/client/components/ECharts.js";
import FlowChart from "/Users/chensifang/code/loop/node_modules/@vuepress/plugin-markdown-chart/dist/client/components/FlowChart.js";
import MarkMap from "/Users/chensifang/code/loop/node_modules/@vuepress/plugin-markdown-chart/dist/client/components/MarkMap.js";
import Mermaid from "/Users/chensifang/code/loop/node_modules/@vuepress/plugin-markdown-chart/dist/client/components/Mermaid.js";

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("ChartJS", ChartJS)
    app.component("ECharts", ECharts);
    app.component("FlowChart", FlowChart);
    app.component("MarkMap", MarkMap);
    app.component("Mermaid", Mermaid);
  },
});
