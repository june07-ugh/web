<template>
    <v-card :class="smAndDown ? 'mobile' : ''" class="h-100 d-flex flex-column align-center justify-center mx-auto" flat>
        <v-img src="/ugh.svg" width="256" max-height="256"></v-img>
        <v-card-title :class="smAndDown ? 'text-h5' : 'text-h2'" class="font-weight-bold">
            Welcome
        </v-card-title>
        <v-card-subtitle :class="{ 'text-body-1': smAndDown, animate__headShake: showInstallButtons, 'animate__delay-0': showInstallButtons, 'animate__animated animate__headShake': showInstallButtons }" class="d-flex text-wrap text-h5">
            to
        </v-card-subtitle>
        <v-card-text>
            <span v-if="!smAndDown">The way to </span>
            <span class="ml-1"><span class="font-weight-bold">DIS</span>like and <span class="font-weight-bold">DIS</span>approve everything!</span>
        </v-card-text>
        <v-card-actions class="d-flex flex-column justify-start" width="100%" style="height: 200px; ">
            <div class="d-flex my-2">
                <div class="d-flex" v-for="link of links">
                    <v-btn variant="tonal" color="yellow-darken-2" :href="link.href" :text="link.text" rounded="lg" class="px-4 mr-2" :prepend-icon="link.icon" />
                </div>
            </div>
        </v-card-actions>
    </v-card>
</template>
<style scoped>
</style>
<script setup>
import 'animate.css'
import { ref } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const showInstallButtons = ref(false)
const { smAndDown } = useDisplay()
const links = [{
    name: 'Forum', href: 'https://forum-ugh.june07.com', text: 'forum', icon: 'forum'
}]
</script>
