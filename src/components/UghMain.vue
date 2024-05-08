<template>
    <v-container :style="styleObj" :class="smAndDown ? 'pa-0' : ''">
        <v-card flat :width="smAndDown ? '100%' : 1080" class="mx-auto">
            <v-card-title class="pb-0 text-center">UGh<v-btn href="https://forum-ugh.june07.com" target="_blank" variant="text" size="small" icon="forum" /></v-card-title>
            <v-card-subtitle class="text-center">If you must loathe, detest, and/or be revolted, use UGh.</v-card-subtitle>
            <v-card-text>
                <p class="d-flex" :class="smAndDown ? 'text-body-2' : 'text-body-1 my-8'">
                <div>In the parlance of our times, UGh. is the tool to "downvote", "thumbs-down", "unlike", or just plain "<span class="font-weight-bold">hate</span>" everything on the Internet.</div>
                <v-spacer v-if="!smAndDown" />
                <social-share v-if="!smAndDown" size="small" text="share it" variant="plain" color="blue" />
                </p>

                <v-form ref="formRef">
                    <v-field active class="pa-4" variant="outlined" style="border-radius: 24px">
                        <div :style="styleObj" id="tui-image-editor"></div>
                        <template v-slot:label>
                            <div class="text-h5 text-red-darken-4">What?</div>
                        </template>
                    </v-field>
                    <v-textarea v-model="form.url" :rules="rules.url" class="mt-7" variant="outlined" rounded rows="1" append-inner-icon="link" no-resize placeholder="https://..." @blur="removeURLParams">
                        <template v-slot:label>
                            <span class="text-h5 text-red-darken-4">Where?</span>
                        </template>
                    </v-textarea>
                    <!-- No adjustment needed for the nice sites... this is for the stubborn ones who try to gate-keep! -->
                    <v-textarea v-model="form.text" :rules="rules.text" class="mt-2" variant="outlined" rounded counter auto-grow append-inner-icon="receipt" placeholder="I hate this because...">
                        <template v-slot:label>
                            <span class="text-h5 text-red-darken-4">Why?</span>
                        </template>
                    </v-textarea>
                </v-form>
                <div v-if="props.auth?.preferred_username" class="text-caption font-weight-light mt-n4 text-center">signed in as <span class="font-weight-bold">{{ props.auth.preferred_username }}</span></div>
            </v-card-text>
            <v-card-actions class="d-flex justify-center align-center">
                <v-btn @click="submitHandler" text="UGh." class="text-body-1 px-8" flat rounded size="large">
                    <template v-slot:append>
                        <v-img src="/ugh.svg" width="32" height="32"></v-img>
                    </template>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<style scoped>
:deep() .tui-image-editor-header-logo,
:deep() .tui-image-editor-header-buttons {
    display: none;
}

#tui-image-editor {
    border-radius: 24px;
}

:deep() .v-field__outline__start {
    flex: 0 0 29px !important;
}
</style>
<script setup>
import { Dropzone } from "dropzone"
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from 'tui-image-editor'
import { ref, nextTick, computed, inject, watch, onMounted, getCurrentInstance } from "vue"
import { useDisplay } from 'vuetify/lib/framework.mjs'
import Swal from 'sweetalert2'

import SocialShare from '@/components/SocialShare.vue'

const { MODE } = import.meta.env
const dropzone = ref()
const { $api } = getCurrentInstance().appContext.config.globalProperties
const { smAndDown } = useDisplay()
const styleObj = computed(() => ({
    maxWidth: smAndDown ? '100%' : '1080px',
    minWidth: smAndDown ? '100%' : '720px',
    height: `${props.screenCapture?.height + 150 || 500}px`,
    width: `${props.screenCapture?.width + 100 || 1080}px`,
}))
const formRef = ref()
const props = defineProps({
    screenCapture: Object,
    auth: Object
})
const imageEditor = ref()
const loadedScreenCapture = ref()
const screenCapture = computed(() => loadedScreenCapture.value || props.screenCapture)
const form = ref({
    image: true,
    text: MODE === 'production' ? '' : new Date(),
    url: 'https://amazon.com'
})
const tabId = ref()
const images = ref(props.screenCapture?.image ? [props.screenCapture.image] : [])
const rules = {
    url: [v => !!v || 'An Internet location (i.e. a URL) is what is required.'],
    text: [v => !!v || 'Words are what is required.']
}
const extensionId = inject("extensionId")
let workerPort

if (chrome.runtime) {
    workerPort = chrome.runtime.connect(extensionId)

    workerPort.onMessage.addListener(async (request) => {
        const { command } = request

        switch (command) {
            case "update":
                const sessionsUpdate = await new Promise((resolve) =>
                    chrome.runtime.sendMessage(
                        extensionId,
                        { command: "getSessions" },
                        (response) => resolve(response)
                    )
                )
                sessions.value = { ...sessions.value, ...sessionsUpdate }
                break
            case "updateNotifications":
                updateNotifications()
                break
        }
    })
}
async function submitHandler() {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    let timerInterval
    updateLoadedScreenCapture()

    // send to backend
    await $api.unlike(props.auth, {
        url: form.value.url?.split('?')[0],
        crop: screenCapture.value.crop,
        comment: form.value.text,
        images: images.value
    })

    Swal.fire({
        title: 'The world is a better place for knowing!',
        html: "I will close in <b></b> seconds.",
        text: 'Your Ugh.™ has been tracked and noted!',
        icon: 'success',
        timer: 2000,
        didOpen: () => {
            Swal.showLoading()
            let timer = Swal.getPopup().querySelector("b")
            timerInterval = setInterval(() => {
                timer.textContent = `${(Swal.getTimerLeft() / 1000).toFixed(2)}`
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then(async (result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer")
        }
        if (chrome.tabs) {
            const nocacheParam = 'nocache=true'
            const tab = await chrome.tabs.get(Number(tabId.value || screenCapture.value.tabId))

            if (!tab.url.includes(nocacheParam)) {
                const updatedUrl = tab.url + (tab.url.includes('?') ? '&' : '?') + nocacheParam
                await chrome.tabs.update(tab.id, { active: true, url: updatedUrl })
            } else {
                await chrome.tabs.update(tab.id, { active: true, url: tab.url })
            }
        }
    })
}
function updateLoadedScreenCapture() {
    loadedScreenCapture.value = {
        image: imageEditor.value.toDataURL(),
        width: imageEditor.value.getCanvasSize().width,
        height: imageEditor.value.getCanvasSize().height,
    }
    images.value = [loadedScreenCapture.value.image]
}
function removeURLParams() {
    form.value.url = form.value.url.split('?')[0]
}
async function getImagesFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ughDb')

        request.onerror = () => {
            reject(new Error('Failed to open IndexedDB.'))
        }

        request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(['images'], 'readonly')
            const objectStore = transaction.objectStore('images')
            const images = []

            transaction.oncomplete = () => {
                resolve(images)
            }

            transaction.onerror = () => {
                reject(new Error('Error reading images from IndexedDB.'))
            }

            const cursorRequest = objectStore.openCursor()

            cursorRequest.onerror = () => {
                reject(new Error('Error opening cursor.'))
            }

            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result
                if (cursor) {
                    images.push(cursor.value) // Assuming each image is stored as ArrayBuffer
                    cursor.continue()
                }
            }
        }

        request.onupgradeneeded = () => {
            // Handle database upgrade if needed
        }
    })
}
async function loadImageEditorFromIndexedDB() {
    try {
        const images = await getImagesFromIndexedDB()
        if (images.length > 0) {
            // Assuming the image is stored as ArrayBuffer in IndexedDB
            const imageBlob = new Blob([images[0]], { type: 'image/png' })
            const imageUrl = URL.createObjectURL(imageBlob)

            // Load the image into the editor
            imageEditor.value.loadImageFromURL(imageUrl, 'indexedDBImage')
        } else {
            console.log('No images found in IndexedDB.')
        }
    } catch (error) {
        console.error('Error loading image from IndexedDB:', error)
    }
}
onMounted(() => {
    const params = new URLSearchParams(document.location.search)
    const screencaptureObjectURL = params.get('screencapture')
    const share = /\/share/.test(document.location.pathname)

    document.onpaste = function (event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items
        for (let item of items) {
            if (item.kind === 'file') {
                // adds the file to your dropzone instance
                dropzone.value.addFile(item.getAsFile())
            }
        }
    }
    form.value.url = params?.get('url')?.split('?')[0]
    imageEditor.value = new ImageEditor(document.querySelector('#tui-image-editor'), {
        includeUI: {
            loadImage: {
                path: '/ugh.webp',
                name: 'SampleImage',
            }
        },
        usageStatistics: false,
    })
    dropzone.value = new Dropzone("div#tui-image-editor", {
        url: files => {
            imageEditor.value.loadImageFromFile(files[0])
            updateLoadedScreenCapture()
        }
    })
    if (screencaptureObjectURL) {
        function blobUrlToDataURL(blobUrl, callback) {
            var xhr = new XMLHttpRequest()
            xhr.onload = function () {
                var reader = new FileReader()
                reader.onloadend = function () {
                    callback(reader.result)
                }
                reader.readAsDataURL(xhr.response)
            }
            xhr.open('GET', blobUrl)
            xhr.responseType = 'blob'
            xhr.send()
        }
        blobUrlToDataURL(screencaptureObjectURL, (dataURL) => {
            imageEditor.value.loadImageFromURL(dataURL, 'screenshot')
            tabId.value = params.get('tabId')
        })
    }
    if (share) {
        loadImageEditorFromIndexedDB()
    }
    watch(() => screenCapture.value, screenCapture => {
        if (screencaptureObjectURL) return
        nextTick(() => {
            imageEditor.value.loadImageFromURL(screenCapture.image, 'screenshot')
            form.value.url = (loadedScreenCapture.value?.url || props.screenCapture?.url)?.split('?')[0]
        })
    })
})
</script>
