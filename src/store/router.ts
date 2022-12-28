import { defineStore } from "pinia";
import type { Route } from "/#/router";
import { pagesMap } from "/@/router/routes";

export interface routerStore {
  routes: Map<string, Route> | undefined;
  currentRouter: Route | undefined;
}

export const useRouterStore = defineStore({
  id: "app-router",
  state: (): routerStore => ({
    routes: undefined,
    currentRouter: undefined,
  }),
  getters: {
    getRoutes(state) {
      return state.routes;
    },
    getCurrentRoute(state) {
      return state.currentRouter;
    },
  },
  actions: {
    setup() {
      this.setRoutes();
    },
    setRoutes() {
      this.routes = pagesMap;
    },
    setCurrentRoute(path: string) {
      this.currentRouter = this.routes?.get(path) || undefined;
    },
  },
});
