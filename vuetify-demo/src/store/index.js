/**
 * Vuetify Vue CLI Preset
 *
 * store/index.js
 *
 * vuex documentation: https://vuex.vuejs.org/
 */

// Vue
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// Utilities
// https://davestewart.github.io/vuex-pathify/#/
import pathify from '@/plugins/vuex-pathify'
pathify.options.mapping = 'standard'
pathify.options.deep = 2

// Modules
// https://vuex.vuejs.org/guide/modules.html
import * as modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [pathify.plugin, createPersistedState()]
})

// A reusable const for making root commits and dispatches
// https://vuex.vuejs.org/guide/modules.html#accessing-global-assets-in-namespaced-modules
export const ROOT_DISPATCH = Object.freeze({ root: true })
