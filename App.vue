<template>
    <v-app>
        <v-main>
            <v-container class="h-100 d-flex justify-center">
                <FAQ v-if="/\/faq/.test(route.path)" />
                <ugh-install v-else-if="!screenCapture && /\/install/.test(route.path)" />
                <ugh-splash v-else-if="!screenCapture && !/\/share/.test(route.path)" />
                <ugh-main v-else :screenCapture="screenCapture" :auth="auth" @signin="signin" @signup="signup" />
            </v-container>
        </v-main>
        <v-snackbar text :timeout="-1" v-model="snackbar.active" style="opacity: 0.9" @click="snackbarCloseHandler">
            <v-row>
                <v-col cols="1" class="d-flex align-center justify-center">
                    <v-icon :icon="snackbar.icon" :color="snackbar.iconColor" />
                </v-col>
                <v-col cols="10" class="d-flex align-center justify-center">
                    <span v-if="error">{{ snackbar.message }}</span>
                    <span v-else @click="reload" class="font-weight-light" v-bind:class="smAndDown ? 'caption' : ''" style="cursor: pointer">App update available.</span>
                </v-col>
                <v-col cols="1" class="d-flex align-center justify-center">
                    <v-btn variant="plain" :size="smAndDown ? 'x-small' : ''" @click="snackbarCloseHandler"> x </v-btn>
                </v-col>
            </v-row>
        </v-snackbar>
    </v-app>
</template>
<script setup>
import { ref, onMounted, provide, getCurrentInstance } from "vue"
import cookie from 'cookie'
import { useAppStore } from "./src/store/app"

import FAQ from "./src/components/FAQ.vue"
import UghMain from "./src/components/UghMain.vue"
import UghSplash from "./src/components/UghSplash.vue"
import UghInstall from "./src/components/UghInstall.vue"

const { MODE, VITE_APP_EXTENSION_ID } = import.meta.env
const { $keycloak, $api } = getCurrentInstance().appContext.config.globalProperties
const auth = ref()
const screenCapture = ref()
const extensionId = chrome?.runtime?.id || VITE_APP_EXTENSION_ID
const route = ref({})
const broadcast = ref()
const store = useAppStore()
const version = ref()
const snackbarDefault = {
    active: false,
    icon: 'info',
    message: undefined,
}
const snackbar = ref({ ...snackbarDefault })
const lastBuild = ref()
const versionCheckIntervalId = ref()
const buildInfo = ref()

async function doAuth(redirect) {
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
        if (redirect) {
            window.location.href = redirect
        }
    } else {
        await $api.info()
        auth.value = {
            session: cookie.parse(document.cookie)?.['connect.sid']?.match(/s:([^\.]*)/)[1]
        }
    }
}
const checkVersion = async () => {
    buildInfo.value = await $api.buildInfo()

    if (!buildInfo.value?.build_date) {
        return
    }
    version.value = buildInfo.value.commit_sha
    if (lastBuild.value && lastBuild.value?.build_date !== buildInfo.value.build_date) {
        snackbar.value.active = true
        // TODO: put some extra check here...
        resetLocalStorage.value = true
    } else {
        lastBuild.value = buildInfo.value
    }
}
function snackbarCloseHandler() {
    snackbar.value.active = false
    setTimeout(() => {
        snackbar.value = { ...snackbarDefault }
        if (error) {
            error.value = false
        }
    })
}
function reload() {
    const url = new URL(window.location.href)
    url.searchParams.set('cache', Date.now())
    window.location.href = url.toString()
}
checkVersion()
versionCheckIntervalId.value = setInterval(checkVersion, 60000)
const signin = () => $keycloak.value.login({ redirectUri: route.value.params?.get('redirect') || window.location.origin })
const signup = () => $keycloak.value.login({ redirectUri: route.value.params?.get('redirect') || window.location.origin, action: 'register' })
async function webShareInit() {
    broadcast.value = new BroadcastChannel("messages")
    broadcast.value.onmessage = async (event) => {
        if (MODE !== "production") {
            console.log(event)
        } else if (typeof event.data === 'object' && event.data.image) {
            store.shareData.images = event.data.images
        }
    }
}
webShareInit()
doAuth()
onMounted(() => {
    route.value.path = window.location.pathname
    route.value.params = new URLSearchParams(window.location.search)

    if (/\/install/.test(route.value.path)) {
        doAuth()
    } else if (/\/signup/.test(route.value.path)) {
        signup()
    } else if (/\/signin/.test(route.value.path)) {
        signin()
    }
})

provide('extensionId', extensionId)
</script>
