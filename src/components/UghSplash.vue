<template>
    <v-card :class="smAndDown ? 'mobile' : ''" class="h-100 d-flex flex-column align-center justify-center mx-auto" flat>
        <v-img src="/lego.webp" width="256" max-height="256"></v-img>
        <v-card-title :class="smAndDown ? 'text-h5' : 'text-h2'" class="font-weight-bold">
            <span class="font-italic">Everything <span :class="showInstallButtons ? 'cross text-red-darken-4' : ''">is </span> special...</span>
            <span v-if="!showInstallButtons" class="emojii">⭐👍🏾❤️</span>
            <span v-else class="emojii">😒👎💔</span>
        </v-card-title>
        <v-card-subtitle :class="{ 'text-body-1': smAndDown, animate__headShake: showInstallButtons, 'animate__delay-0': showInstallButtons, 'animate__animated animate__headShake': showInstallButtons }" class="d-flex text-wrap text-h5">
            <span v-if="!smAndDown">The way to </span>
            <span class="ml-1"><span class="font-weight-bold">DIS</span>like and <span class="font-weight-bold">DIS</span>approve everything!</span>
        </v-card-subtitle>
        <v-card-actions class="d-flex flex-column justify-start" width="100%" style="height: 200px; ">
            <v-btn class="px-4" variant="tonal" :color="!showInstallButtons ? 'yellow-darken-2' : 'grey-darken-2'" text="Install" size="x-large" rounded="lg" @click="showInstallButtons = !showInstallButtons" :style="showInstallButtons ? 'opacity: 0.5' : ''">
                <template v-slot:prepend>
                    <span class="material-symbols-outlined" style="font-size: 24px">
                        download
                    </span>
                </template>
            </v-btn>
            <div v-if="showInstallButtons" class="d-flex my-2">
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
.v-card-subtitle {
    opacity: unset;
}
.v-card-subtitle:not(.animate__headShake) {
    animation: backInUp;
    animation-duration: 2s;
}
.animate__delay-0 {
    animation-delay: 0s !important;
}

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

.mobile .cross::before,
.mobile .cross::after {
    top: 50%;
    border-bottom: 4px solid black;
}
</style>
<script setup>
import 'animate.css'
import { ref } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const showInstallButtons = ref(false)
const { smAndDown } = useDisplay()
const installMethods = [{
    name: 'Chrome', href: 'https://chromewebstore.google.com/detail/jnndolgphmohopnenfacapkadpmpifjb/preview?hl=en&authuser=0', text: 'chrome', icon: '/chrome_32x32.png'
}, {
    name: 'Edge', href: 'https://chromewebstore.google.com/detail/jnndolgphmohopnenfacapkadpmpifjb/preview?hl=en&authuser=0', text: 'edge', icon: '/edge_32x32.png'
}]
</script>
