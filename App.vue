<template>
    <v-app>
        <v-main>
            <v-container class="h-100 d-flex justify-center align-center">
                <ugh-install v-if="!screenCapture && route.path === '/install'" @signup="signup" />
                <ugh-splash v-else-if="!screenCapture" />
                <ugh-main v-else-if="screenCapture" :screenCapture="screenCapture" :auth="auth" @signin="signin" @signup="signup" />
            </v-container>
        </v-main>
    </v-app>
</template>
<script setup>
import { ref, onMounted, provide, getCurrentInstance } from "vue"
import cookie from 'cookie'

import UghMain from "./src/components/UghMain.vue"
import UghSplash from "./src/components/UghSplash.vue"
import UghInstall from "./src/components/UghInstall.vue"

const { VITE_APP_EXTENSION_ID } = import.meta.env
const { $keycloak, $api } = getCurrentInstance().appContext.config.globalProperties
const auth = ref()
const screenCapture = ref()
const extensionId = chrome?.runtime?.id || VITE_APP_EXTENSION_ID
const route = ref({})

async function doAuth() {
    await $keycloak.value.isLoaded
    if ($keycloak.value.isAuthenticated) {
        auth.value = {
            token: $keycloak.value.token,
            preferred_username: $keycloak.value.tokenParsed.preferred_username,
        }
        chrome.runtime?.sendMessage(extensionId, {
            command: "authenticated",
            data: auth.value
        })
        await $api.forumAuth(auth.value)
    } else {
        await $api.info()
        auth.value = {
            session: cookie.parse(document.cookie)?.['connect.sid']?.match(/s:([^\.]*)/)[1]
        }
    }
}
const signin = () => $keycloak.value.login({ redirectUri: route.value.params?.get('redirect') || `${window.location.origin}/dist/index.html` })
const signup = () => $keycloak.value.login({ redirectUri: route.value.params?.get('redirect') || `${window.location.origin}`, action: 'register' })
onMounted(() => {
    route.value.path = window.location.pathname
    route.value.params = new URLSearchParams(window.location.search)

    if (route.value.path === '/signup') {
        signup()
    }
    if (route.value.path === '/signin') {
        signin()
    }
})

doAuth()

provide('extensionId', extensionId)
</script>
