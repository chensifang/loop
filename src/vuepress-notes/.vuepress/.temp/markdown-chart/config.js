import { defineClientConfig } from "vuepress/client";
import Mermaid from "/Users/chensifang/code/loop/node_modules/@vuepress/plugin-markdown-chart/lib/client/components/Mermaid.js";

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("Mermaid", Mermaid);
  },
});
