import fs from 'node:fs'
import { terser } from 'rollup-plugin-terser'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from "vite-plugin-pwa"

const cert = fs.existsSync('./localdev.crt') ? fs.readFileSync('./localdev.crt') : undefined
const key = fs.existsSync('./localdev.key') ? fs.readFileSync('./localdev.key') : undefined
const { NODE_ENV } = process.env

// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls,
            },
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
        vuetify({
            autoImport: true,
        }),
        viteCompression({
            algorithm: 'brotliCompress'
        }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            manifest: {
                "name": "Ugh",
                "short_name": "Ugh",
                "icons": [
                    {
                        "src": "/android-chrome-512x512.webp",
                        "sizes": "512x512",
                        "type": "image/webp"
                    },
                    {
                        "src": "/maskable_icon_x192.webp",
                        "sizes": "192x192",
                        "type": "image/webp",
                        "purpose": "maskable"
                    },
                    {
                        "src": "/maskable_icon_x512.webp",
                        "sizes": "512x512",
                        "type": "image/webp",
                        "purpose": "maskable"
                    }
                ],
                "screenshots": [
                    {
                        "src": "/screenshot-1280x720.jpeg",
                        "sizes": "1280x720",
                        "type": "image/jpeg",
                        "form_factor": "wide",
                        "label": "tOptOp Desktop"
                    }, {
                        "src": "/screenshot-640x320.jpeg",
                        "sizes": "640x320",
                        "type": "image/jpeg",
                        "label": "tOptOp Desktop (640x320)"
                    }
                ],
                "theme_color": "#ffffff",
                "background_color": "#ffffff",
                "start_url": NODE_ENV === 'production' ? "https://ugh.june07.com.com" : "https://dev-ugh.keycloak.june07.com",
                "display": "standalone",
                "protocol_handlers": [
                    {
                        "protocol": "web+ugh",
                        "url": "/ugh?protocolHandler=%s"
                    }
                ],
                "share_target": {
                    "action": "/share",
                    "method": "POST",
                    "enctype": "multipart/form-data",
                    "params": {
                        "title": "title",
                        "text": "text",
                        "url": "url",
                        "files": [
                            {
                                "name": "screenshot",
                                "accept": ["image/jpeg", "image/png", "image/gif", "image/webp", "image/*"]
                            }
                        ]
                    }
                }
            },
            minify: NODE_ENV === 'production' ? true : false,
            workbox: {
                importScripts: ['sw.js'],
            }
        }),
    ],
    define: { 'process.env': {} },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },
    server: {
        port: 3003,
        https: {
            cert,
            key
        },
    },
    build: {
        minify: 'terser',
        rollupOptions: {
            plugins: [
                terser({
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    },
                    mangle: true,
                }),
            ],
        },
    }
})
