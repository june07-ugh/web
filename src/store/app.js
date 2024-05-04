import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
    state: () => ({
        showInstallButtons: false,
    }),
    persist: true,
})
