import * as VueRouter from 'vue-router';

// 路由规则描述数组
const routes = [
    {
        path: '/',
        redirect: '/WindowMain/Chat'
    },
    {
        path: '/main',
        component: () => import('../views/window/WindowMain.vue'),
        children: [
            { path: 'chat', component: () => import('../views/window/main/ChatIndex.vue') },
            { path: 'contact', component: () => import('../views/window/main/ContactIndex.vue') },
            { path: 'collection', component: () => import('../views/window/main/CollectionIndex.vue') }
        ]
    },
    {
        path: '/setting',
        component: () => import('../views/window/WindowSetting.vue'),
        children: [{ path: 'AccountSetting', component: () => import('../views/window/setting/AccountSetting.vue') }]
    },
    {
        path: '/user',
        component: () => import('../views/window/WindowUserInfo.vue')
    }
];

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});
