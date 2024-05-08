import { openDB } from 'idb'

const broadcastChannel = 'BroadcastChannel' in self ? new BroadcastChannel('messages') : null
let iDb

async function initDB() {
    iDb = await openDB('ughDb', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('images')) {
                db.createObjectStore('images', { autoIncrement: true })
            }
        }
    })
}

self.addEventListener('install', event => {
    event.waitUntil(initDB())
})

if (broadcastChannel) {
    broadcastChannel.onmessage = async (event) => {
        if (event.data === 'getImages') {
            const images = await getImages()
            broadcastChannel.postMessage({ images })
        }
    }
}

self.addEventListener('fetch', event => {
    if (event.request.method === 'POST' && event.request.url.endsWith('/share')) {
        event.respondWith(
            (async () => {
                const formData = await event.request.formData()
                let title, text, url

                for (const [key, value] of formData.entries()) {
                    if (value instanceof File && value.type.startsWith('image/')) {
                        const imageArrayBuffer = await value.arrayBuffer()
                        await storeImage(imageArrayBuffer)
                    } else if (key === 'text') {
                        text = value
                    } else if (key === 'title') {
                        title = value
                    } else if (key === 'url') {
                        url = value
                    }
                }
                const redirectUrl = new URL(`/#share&title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, self.location.origin)
                const redirectResponse = new Response(redirectUrl.href, { status: 303, headers: { 'Location': redirectUrl.href } })
                console.log(redirectUrl)
                return redirectResponse
            })()
        )
    } else if (event.request.method === 'GET') {
        console.log(event.request)
        // Handle GET request specifically
        event.respondWith(
            fetch(event.request.url, {
                method: 'POST',
                headers: { /* Add any necessary headers */ },
                body: JSON.stringify({ /* Add any necessary data */ }),
            })
        )
    } else {
        console.log(event.request)
        // Handle other HTTP methods as needed
    }
})

async function storeImage(imageArrayBuffer) {
    const tx = iDb.transaction('images', 'readwrite')
    const store = tx.objectStore('images')
    await store.add(imageArrayBuffer)
    await tx.complete
}
async function getImages() {
    const tx = iDb.transaction('images', 'readonly')
    const store = tx.objectStore('images')
    const images = []

    return new Promise((resolve, reject) => {
        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result
            if (cursor) {
                images.push(cursor.value) // Add image to array
                cursor.continue() // Move to next image
            } else {
                // All images have been collected
                resolve(images)
            }
        }

        tx.onerror = function (event) {
            reject(event.target.error)
        }
    })
}

console.log('Worker started... yaya!')