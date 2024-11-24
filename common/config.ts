import { useLocalStorage } from '@vueuse/core';
import { ref } from 'vue'

export interface Config {
    tailwindColors: Record<string, Record<string, string>>; // Custom Tailwind color configuration
    brandName: string; // The name of the brand or application
    tagline: string; // A short tagline or slogan for the application
    apiKey: string; // API key used for authenticating requests
    apiURL: string; // Base URL for the application's API
    gtmID?: string; // Optional Google Tag Manager ID
    favicon: string; // Path to the application's favicon
    metaDescription: string; // SEO description for the application
    metaKeywords: string; // SEO keywords for the application
}





export const typingConfig = useLocalStorage('typing_config', {
    playSoundAtBeginning: false, // 在单词出现时播放读音
    playSoundAtTypeSuccess: false, // 单词输入成功时播放读音
    autoSwitchToNextAfterSuccess: false // 单词输入成功时自动切换下一个
})


export function defineConfig(config: Config): Config {
    return config;
}