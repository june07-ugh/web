import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
    state: () => ({
        shareData: {},
    }),
    persist: true,
})
