<template>
    <v-card class="d-flex flex-column align-center mx-auto" flat>
        <v-img src="/lego.png" width="256" height="256"></v-img>
        <v-card-title class="text-h2 font-weight-bold"><span class="font-italic">Everything is special...</span>
            <span class="happy-emojii">⭐👍🏾❤️</span>
        </v-card-title>
        <v-card-subtitle class="text-wrap text-h5">Browser extension and web app to DISLIKE and DISAPPROVE 😒👎💔</v-card-subtitle>
        <v-card-actions class="d-flex flex-column justify-start" width="100%" style="height: 200px; ">
            <v-btn class="px-4" variant="tonal" :color="!store.showInstallButtons ? 'yellow-darken-2' : 'grey-darken-2'" text="Install" size="x-large" rounded="lg" @click="store.showInstallButtons = !store.showInstallButtons" :style="store.showInstallButtons ? 'opacity: 0.5' : ''">
                <template v-slot:prepend>
                    <span class="material-symbols-outlined" style="font-size: 24px">
                        download
                    </span>
                </template>
            </v-btn>
            <div v-if="store.showInstallButtons" class="d-flex my-2">
                <div class="d-flex" v-for="method of installMethods">
                    <v-btn variant="tonal" color="yellow-darken-2" :href="method.href" :text="method.text" rounded="lg" class="px-4 mr-2">
                        <template v-slot:prepend>
                            <v-img :src="method.icon" width="24" height="24" class="mx-1" />
                        </template>
                    </v-btn>
                </div>
            </div>
        </v-card-actions>
    </v-card>
</template>
<style scoped>
.happy-emojii {
    word-spacing: 0.5em;
}
</style>
<script setup>
import { ref, computed, onMounted } from "vue"
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useAppStore } from "../store/app"

const store = useAppStore()
const { smAndDown } = useDisplay()
const installMethods = [{
    name: 'Chrome', href: 'https://chromewebstore.google.com/detail/jnndolgphmohopnenfacapkadpmpifjb/preview?hl=en&authuser=0', text: 'chrome', icon: '/chrome_32x32.png'
}, {
    name: 'Edge', href: 'https://chromewebstore.google.com/detail/jnndolgphmohopnenfacapkadpmpifjb/preview?hl=en&authuser=0', text: 'edge', icon: '/edge_32x32.png'
}]
onMounted(() => {
    const params = new URLSearchParams(document.location.search)
})
</script>
