import { createRouter, createWebHistory } from 'vue-router';
import BillManagement from '../components/BillManagement.vue';
import PaymentDetail from '../components/PaymentDetail.vue';

const routes = [
  {
    path: '/bill-management',
    name: 'BillManagement',
    component: BillManagement,
  },
  {
    path: '/payment-detail/:billId',
    name: 'PaymentDetail',
    component: PaymentDetail,
    props: true,  // 使 billId 可以作为 props 传递给组件
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
