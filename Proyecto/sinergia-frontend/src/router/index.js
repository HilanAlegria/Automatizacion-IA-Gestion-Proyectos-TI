
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; 

import UserLogin from '@/views/UserLogin.vue'; 
import ProjectDashboard from '@/views/ProjectDashboard.vue'; 
import IAChatScrum from '@/views/IAChatScrum.vue';
import IAChatXP from '@/views/IAChatXP.vue';
import ReportsViewer from '@/views/ReportsViewer.vue';
import SinergiaLayout from '@/components/layout/SinergiaLayout.vue'; 

const routes = [
  {
    path: '/UserLogin',
    name: 'UserLogin', 
    component: UserLogin,
    meta: { requiresAuth: false } 
  },
  {
    path: '/',
    component: SinergiaLayout, 
    meta: { requiresAuth: true }, 
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: ProjectDashboard,
      },
      {
        path: 'ia/scrum',
        name: 'ChatScrum',
        component: IAChatScrum,
      },
      {
        path: 'ia/xp',
        name: 'ChatXP',
        component: IAChatXP,
      },
      {
        path: 'reports',
        name: 'Reports',
        component: ReportsViewer,
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'Dashboard' } 
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), 
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'UserLogin' }); 
  } else if (to.name === 'UserLogin' && authStore.isLoggedIn) {
    next({ name: 'Dashboard' }); 
  } else {
    next();
  }
});

export default router;