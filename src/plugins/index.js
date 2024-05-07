/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import api from './api.plugin'
import keycloakPlugin from './keycloak.plugin'
import ghostPlugin from './ghost.plugin'
import clipboard from './clipboard.plugin'

const {
    VITE_APP_KEYCLOAK_URL,
    VITE_APP_KEYCLOAK_REALM,
    VITE_APP_KEYCLOAK_CLIENT_ID,
} = import.meta.env

pinia.use(piniaPluginPersistedstate)

const queryParams = new URLSearchParams(window.location.search)
const checkSSO = queryParams.get('checkSSO')

export function registerPlugins(app) {
    app.use(keycloakPlugin, {
        keycloakConfig: {
            url: VITE_APP_KEYCLOAK_URL,
            realm: VITE_APP_KEYCLOAK_REALM,
            clientId: VITE_APP_KEYCLOAK_CLIENT_ID
        },
        /**
         * a hack since the iframe implementation doesn't work with Chromium Extensions and cookies...
         * https://stackoverflow.com/questions/60622192/keycloak-session-cookies-are-missing-within-the-token-request-with-the-new-chro
         * https://community.auth0.com/t/another-post-regarding-third-party-cookie-deprecation-in-chrome/126993
         * 
         */
        onLoad: !chrome?.runtime?.id ? 'check-sso' : checkSSO ? 'login-required' : undefined,
        checkLoginIframe: !chrome?.runtime?.id ? true : false,
        silentCheckSsoRedirectUri: !chrome?.runtime?.id ? `${location.origin}/silent-check-sso.html` : undefined
    })
        .use(pinia)
        .use(ghostPlugin)
        .use(vuetify)
        .use(api)
    app.provide('clipboard', clipboard)
}
