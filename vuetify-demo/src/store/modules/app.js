// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  calendarDrawer: null,
  contactDrawer: null,
  spaceDrawer: null,
  commerceDrawer: null,
  complianceDrawer: null,
  space: {},
  spaceId: null
}

const mutations = make.mutations(state)

const actions = make.actions(state)

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
