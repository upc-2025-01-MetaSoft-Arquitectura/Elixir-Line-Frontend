import {createRouter, createWebHistory} from "vue-router";
import SignInComponent from "../ElixirLine/security/pages/sign-in.component.vue";
import PageNotFoundComponent from "../public/pages/page-not-found.component.vue";
import LayoutElixirLineComponent from "../public/pages/layout-elixir-line.component.vue";
import TabsWinemakingViewComponent from "../ElixirLine/winemaking-process/views/tabs-winemaking-view.component.vue";
import SupplyManagement from "../ElixirLine/supply-management/pages/supply-management.vue";
import ProfileViewsConfigurationComponent from "../ElixirLine/profile/views/profile-views-configuration.component.vue";
import TaskManagement from "../ElixirLine/task-management/pages/task-management.vue";
import CalendarManagement from "../ElixirLine/calendar/pages/calendar-management.vue";
import EvidenceManager from "../ElixirLine/evidence-management/pages/evidence-manager.vue";
import tabsEvidenceViewComponent from "../ElixirLine/evidence-management/views/tabs-evidence-view.component.vue";
import WinemakingMap from "../ElixirLine/winemaking-map/page/winemaking-map.vue";
import DashboardComponent from "../ElixirLine/dashboard/pages/dashboard-component.vue";
import dashboardComponent from "../ElixirLine/dashboard/pages/dashboard-component.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [

        //ruta por defecto para redirigir a la página de inicio home-elixir line
        {path: '/:pathMatch(.*)*', redirect: '/elixir-line/login'},

        {path: '/page-not-found',           name: 'PageNotFound',             component: PageNotFoundComponent,            meta: { title: 'Page Not Found' }},

        {path: '/elixir-line/login' ,       name: 'Login', component: SignInComponent, meta: { title: 'Login'}},


        //ruta para la página de inicio home-elixir line
        {
            path: '/elixir-line/:id/home', name: 'ElixirLineHome', component: LayoutElixirLineComponent,
            children:[
                {path: '/vinicultor/winemaking',      name: 'WinemakingProcess', component: TabsWinemakingViewComponent,     meta: { title: 'Winemaking'}},
                {path:'/vinicultor/supplies', name: 'SuppliesManagement', component: SupplyManagement, meta: { title: 'Supplies'}},
                {path: '/vinicultor/profile/settings', name: 'ProfileSettings', component: ProfileViewsConfigurationComponent, meta: { title: 'Profile Settings'}},
                {path: '/elixir-line/:userId/dashboard', name: 'dashboard-component', component: dashboardComponent, meta: { title: 'Dashboard' }},
                { path: '/vinicultor/tasks', name: 'Tasks', component: TaskManagement, meta: { title: 'Tasks' } } ,
                { path: '/vinicultor/Calendar', name: 'Calendar', component: CalendarManagement, meta: { title: 'Calendar' } },
                { path: '/vinicultor/map', name: 'Map', component: WinemakingMap, meta: { title: 'Map' } },
                {path: '/vinicultor/evidence', name: 'EvidenceManagement', component: tabsEvidenceViewComponent, meta: { title: 'EvidenceManagement'}},
                


            ], meta: { title: 'Wine Batches' },

        },


    ]
});


router.beforeEach((to, from, next) => {
    let baseTitle = 'ElixirLine';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})




export default router;