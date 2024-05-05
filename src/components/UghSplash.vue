<template>
    <v-card class="d-flex flex-column align-center mx-auto" flat>
        <v-img src="/lego.png" width="256" height="256"></v-img>
        <v-card-title :class="smAndDown ? 'text-h5' : 'text-h2'" class="font-weight-bold">
            <span class="font-italic">Everything <span :class="store.showInstallButtons ? 'cross text-red-darken-4' : ''">is </span> special...</span>
            <span v-if="!store.showInstallButtons" class="emojii">⭐👍🏾❤️</span>
            <span v-else class="emojii">😒👎💔</span>
        </v-card-title>
        <v-card-subtitle :class="smAndDown ? 'text-body-1' : ''" class="text-wrap text-h5">
            <span v-if="!smAndDown">The way to </span>
            <span><span class="font-weight-bold">DIS</span>like and <span class="font-weight-bold">DIS</span>approve everything!</span>
        </v-card-subtitle>
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
.emojii {
    word-spacing: 0.5em;
}

.cross {
    position: relative;
    display: inline-block;
}
.cross::before,
.cross::after {
    content: '';
    width: 130%;
    position: absolute;
    right: -30%;
    top: 55%;
}

.cross::before {
    border-bottom: 7px solid black;
    -webkit-transform: skewY(-20deg);
    transform: skewY(-20deg);
}

.cross::after {
    border-bottom: 7px solid black;
    -webkit-transform: skewY(35deg);
    transform: skewY(35deg);
}
</style>
<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useAppStore } from "../store/app"

const store = useAppStore()
const { smAndDown } = useDisplay()
const installMethods = [{
    name: 'Chrome', href: 'https://chromewebstore.google.com/detail/jnndolgphmohopnenfacapkadpmpifjb/preview?hl=en&authuser=0', text: 'chrome', icon: '/chrome_32x32.png'
}, {
    name: 'Edge', href: 'https://chromewebstore.google.com/detail/jnndolgphmohopnenfacapkadpmpifjb/preview?hl=en&authuser=0', text: 'edge', icon: '/edge_32x32.png'
}]
</script>
