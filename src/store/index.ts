import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./states";
import accounts from "./modules/accounts";
import dialogs from "./modules/dialogs";
import dialogsPreviews from "./modules/dialogs-previews";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  state: {},
  mutations: {},
  actions: {},
  modules: { accounts, dialogs, dialogsPreviews }
});
