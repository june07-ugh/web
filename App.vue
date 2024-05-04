<template>
    <v-app>
        <v-main class="h-100 d-flex justify-center align-center">
            <v-container>
                <ugh-splash v-if="!screenCapture" />
                <ugh-main v-if="screenCapture" :screenCapture="screenCapture" :auth="auth" @signin="signin" @signup="signup" />
            </v-container>
        </v-main>
    </v-app>
</template>
<script setup>
const { MODE, VITE_APP_EXTENSION_ID } = import.meta.env

import { ref, onMounted, provide, getCurrentInstance } from "vue"
import cookie from 'cookie'

import UghMain from "./src/components/UghMain.vue"
import UghSplash from "./src/components/UghSplash.vue"

const { $keycloak, $api } = getCurrentInstance().appContext.config.globalProperties
const auth = ref()
const screenCapture = ref()
const extensionId = chrome?.runtime?.id || VITE_APP_EXTENSION_ID

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
const signin = () => $keycloak.value.login({ redirectUri: `${window.location.origin}/dist/index.html` })
const signup = () => $keycloak.value.login({ redirectUri: `${window.location.origin}`, action: 'register' })
onMounted(() => {
})

doAuth()

provide('extensionId', extensionId)
</script>
