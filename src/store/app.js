import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
    state: () => ({
        faq: {},
        shareData: {},
    }),
    persist: true,
})
