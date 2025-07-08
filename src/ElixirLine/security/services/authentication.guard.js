import {useAuthenticationStore} from "./authentication.store.js";

/**
 * Authentication guard
 * @param to The route we are navigating to
 * @param from The route we are navigating from
 * @param next The callback function to continue the
 * @returns {*}
 */
export const authenticationGuard = (to, from, next) => {
    const store = useAuthenticationStore();

    console.log('[GUARD] Navegando a:', to.fullPath);

    if (!store.isSignedIn && localStorage.getItem('token')) {
        console.log('[GUARD] Restaurando sesión desde localStorage...');
        store.initialize();
    }

    const isPublic = to.path.startsWith('/elixir-line/sign-in') || to.path.startsWith('/elixir-line/sign-up');

    if (!isPublic && !store.isSignedIn) {
        console.warn('[GUARD] Acceso denegado. Redirigiendo a login');
        return next({ name: 'sign-in' });
    }

    next();
};