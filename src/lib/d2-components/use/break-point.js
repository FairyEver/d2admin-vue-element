import { computed, ref, watch } from 'vue'
import { keys, values, fromPairs, mapKeys } from 'lodash-es'
import { useWindowSize } from './window-size.js'
import { useConfigForD2Components } from './config.js'

/**
 * Get breakpoint status
 * @param {Object} breakPoints break point setting, if do not set this parameter, use global config
 * @returns {Object} status {String} breakPoint now active break point name
 * @returns {Object} status {String} ...breakPoints.keys active state of each breakpoint
 * @returns {Object} status {String} min less than the minimum breakpoint
 */
export function useBreakPoint (breakPoints) {
  const $D2COM = useConfigForD2Components()
  
  const config = breakPoints || $D2COM.breakPoints

  const names = keys(config)
  const numbers = values(config).sort((a, b) => a - b)
  const dict = fromPairs(numbers.map((e, i) => [e, names[i]]))

  const { width } = useWindowSize()

  const status = fromPairs(names.map(e => [e, ref(false)]))

  const isMin = computed(() => breakPoint.value === 'min')

  const breakPointWidthActive = computed(() => {
    return numbers.reduce((r, e) => width.value >= e ? e : r, 0)
  })

  const breakPoint = computed(() => {
    return dict[breakPointWidthActive.value] || 'min'
  })

  function statusUpdate (name) {
    mapKeys(status, e => e.value = false)
    if (names.includes(name)) {
      status[name].value = true
    }
  }

  function filter (minValue, breakPointsValue = {}) {
    return computed(() => breakPoint.value)
  }

  watch(breakPoint, () => {
    statusUpdate(breakPoint.value)
  })

  return {
    filter,
    breakPoint,
    min: isMin,
    ...status
  }
}
