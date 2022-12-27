import { defineStore } from "pinia";

export interface AppStore {
  id?: string | number;
}

export const useAppStore = defineStore({
  id: "app",
  state: (): AppStore => ({}),
  getters: {},
  actions: {},
});
