import Vue from 'vue';
import VueRouter from 'vue-router';

import publicRoutes from '@/router/publicRoutes'
import dashboardRoutes from "@/router/dashboardRoutes";

Vue.use(VueRouter);





const routes = [...publicRoutes, ...dashboardRoutes];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
