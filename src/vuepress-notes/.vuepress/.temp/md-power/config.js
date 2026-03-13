import { defineClientConfig } from 'vuepress/client'
import VPCopyButton from '/Users/chensifang/code/loop/node_modules/vuepress-plugin-md-power/lib/client/components/VPCopyButton.vue'
import Tabs from '/Users/chensifang/code/loop/node_modules/vuepress-plugin-md-power/lib/client/components/Tabs.vue'
import CodeTabs from '/Users/chensifang/code/loop/node_modules/vuepress-plugin-md-power/lib/client/components/CodeTabs.vue'
import { setupMarkHighlight } from '/Users/chensifang/code/loop/node_modules/vuepress-plugin-md-power/lib/client/composables/mark.js'

import '/Users/chensifang/code/loop/node_modules/vuepress-plugin-md-power/lib/client/styles/index.css'

export default defineClientConfig({
  enhance({ router, app }) {
    app.component('VPCopyButton', VPCopyButton)
    app.component('Tabs', Tabs)
    app.component('CodeTabs', CodeTabs)
  },
  setup() {
        setupMarkHighlight("eager")

  }
})
