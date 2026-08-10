import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./components/routes/Cats.vue"),
    },
    {
      path: "/cat/:id",
      component: () => import("./components/routes/Cat.vue"),
    },
    {
      path: "/breeds",
      component: () => import("./components/routes/Breeds.vue"),
    },
    {
      path: "/favourites",
      component: () => import("./components/routes/Favourites.vue"),
    },
    {
      path: "/images",
      component: () => import("./components/routes/Images.vue"),
    },
  ],
  scrollBehavior: () => ({ top: 0, behavior: "smooth" }),
});

app.use(router);
app.use(VueQueryPlugin, { queryClient });
app.mount("#app");
