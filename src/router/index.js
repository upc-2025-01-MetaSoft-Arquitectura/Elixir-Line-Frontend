import {createRouter, createWebHistory} from "vue-router";
import SignInComponent from "../ElixirLine/security/pages/sign-in.component.vue";
import PageNotFoundComponent from "../public/pages/page-not-found.component.vue";
import LayoutElixirLineComponent from "../public/pages/layout-elixir-line.component.vue";
import WinemakingViewComponent
    from "../ElixirLine/winemaking-process/views/winemaking-view.component.vue";
import SupplyManagement from "../ElixirLine/supply-management/pages/supply-management.vue";
import ProfileViewsConfigurationComponent from "../ElixirLine/profile/views/profile-views-configuration.component.vue";


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
                {path: '/vinicultor/winemaking',      name: 'WinemakingProcess', component: WinemakingViewComponent,     meta: { title: 'Winemaking'}},
                {path:'/vinicultor/supplies', name: 'SuppliesManagement', component: SupplyManagement, meta: { title: 'Supplies'}},
                {path: '/vinicultor/profile/settings', name: 'ProfileSettings', component: ProfileViewsConfigurationComponent, meta: { title: 'Profile Settings'}},



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