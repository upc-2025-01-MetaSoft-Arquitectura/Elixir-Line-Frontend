import {createRouter, createWebHistory} from "vue-router";
import SignInComponent from "../ElixirLine/security/pages/sign-in.component.vue";
import PageNotFoundComponent from "../public/pages/page-not-found.component.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [

        //ruta por defecto para redirigir a la página de inicio home-elixir line
        {path: '/:pathMatch(.*)*', redirect: '/elixir-line/login'},

        {path: '/page-not-found',           name: 'PageNotFound',             component: PageNotFoundComponent,            meta: { title: 'Page Not Found' }},

        {path: '/elixir-line/login' ,       name: 'Login', component: SignInComponent, meta: { title: 'Login'}},

    ]
});


router.beforeEach((to, from, next) => {
    let baseTitle = 'ElixirLine';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})




export default router;