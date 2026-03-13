import { defineClientConfig } from '@vuepress/client'
import { memoryData, sideTableData } from './table-structure-data'

declare global {
  interface Window {
    renderTableStructure?: (data: unknown, containerId: string, options?: { layout?: string }) => void
  }
}

const TABLE_CONFIG: Record<
  string,
  { data: unknown; options?: { layout?: string } }
> = {
  'memory-container': { data: memoryData },
  'sidetable-container': { data: sideTableData, options: { layout: 'hierarchical' } },
}

function runTableStructureScripts() {
  const fn = (window as Window).renderTableStructure
  if (typeof fn !== 'function') return

  Object.entries(TABLE_CONFIG).forEach(([containerId, { data, options }]) => {
    const el = document.getElementById(containerId)
    if (!el || el.dataset.rendered === '1') return
    try {
      fn(data, containerId, options)
      el.dataset.rendered = '1'
    } catch (e) {
      console.error('Error rendering table structure:', e)
    }
  })
}

export default defineClientConfig({
  enhance({ router }) {
    if (typeof window === 'undefined') return

    const loadAndRun = () => {
      if (typeof (window as Window).renderTableStructure === 'function') {
        runTableStructureScripts()
        return
      }
      const script = document.createElement('script')
      script.src = '/components/table-structure-component.js'
      script.async = false
      script.onload = () => runTableStructureScripts()
      document.head.appendChild(script)
    }

    loadAndRun()

    router.afterEach(() => {
      setTimeout(runTableStructureScripts, 150)
    })
  },
})
