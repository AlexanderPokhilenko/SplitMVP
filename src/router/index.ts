import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "News",
    component: () => import("../views/News.vue")
  },
  {
    path: "/sign",
    name: "Sign",
    component: () => import("../views/Sign.vue")
  },
  {
    path: "/comments",
    name: "Comments",
    component: () => import("../views/Comments.vue")
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue")
  },
  {
    path: "/dialogs/:id?",
    name: "Dialogs",
    component: () => import("../views/Dialogs.vue"),
    props: route => {
      const id = Number.parseInt(route.params.id, 10);
      if (Number.isNaN(id)) {
        return null;
      }
      return { id };
    }
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
