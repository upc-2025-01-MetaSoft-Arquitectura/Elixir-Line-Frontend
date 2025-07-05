import {createRouter, createWebHistory} from "vue-router";
import SignInComponent from "../ElixirLine/security/pages/sign-in.component.vue";
import PageNotFoundComponent from "../public/pages/page-not-found.component.vue";
import LayoutElixirLineComponent from "../public/pages/layout-elixir-line.component.vue";
import TabsWinemakingViewComponent
    from "../ElixirLine/winemaking-process/views/tabs-winemaking-view.component.vue";
import SupplyManagement from "../ElixirLine/supply-management/pages/supply-management.vue";
import ProfileViewsConfigurationComponent from "../ElixirLine/profile/views/profile-views-configuration.component.vue";
import SignUpComponent from "../ElixirLine/security/pages/sign-up.component.vue";
import {authenticationGuard} from "../ElixirLine/security/services/authentication.guard.js";


const router = createRouter({
    history: createWebHistory(),
    routes: [

        //ruta por defecto para redirigir a la página de inicio home-elixir line
        {path: '/:pathMatch(.*)*', redirect: '/elixir-line/sign-in'},

        {path: '/page-not-found',           name: 'PageNotFound',             component: PageNotFoundComponent,            meta: { title: 'Page Not Found' }},

        {path: '/elixir-line/sign-in' ,       name: 'sign-in', component: SignInComponent, meta: { title: 'Login'}},
        {path: '/elixir-line/sign-up', name: 'sign-up', component: SignUpComponent, meta: { title: 'Sign Up'}},


        //ruta para la página de inicio home-elixir line
        {
            path: '/elixir-line/:id', name: 'ElixirLineHome', component: LayoutElixirLineComponent,
            children:[
                {path: 'vinicultor/winemaking', name: 'WinemakingProcess', component: TabsWinemakingViewComponent,     meta: { title: 'Winemaking' }},
                {path:'vinicultor/supplies', name: 'SuppliesManagement', component: SupplyManagement, meta: { title: 'Supplies' }},
                {path: 'vinicultor/profile/settings', name: 'ProfileSettings', component: ProfileViewsConfigurationComponent, meta: { title: 'Profile Settings'}},

            ], meta: { title: 'Wine Batches' },

        },


    ]
});


router.beforeEach(authenticationGuard);


router.beforeEach((to, from, next) => {
    let baseTitle = 'ElixirLine';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})




export default router;