<template>
  <AConfigProvider :locale="locale == 'zh' ? zhCN : null">
    <div class="flex flex-col w-full text-white" style="background: #080808">
      <!-- Header -->
      <header class="text-white shadow-md">
        <div
          style="height: var(--header-height)"
          class="mx-auto flex justify-between items-center px-8"
        >
          <!-- Logo -->
          <NuxtLink to="/">
            <img
              src="/logo.svg"
              alt="Logo"
              class="h-8 w-auto pr-2 max-w-[120px] md:max-w-none"
            />
          </NuxtLink>

          <!-- Navigation -->
          <div class="flex items-center space-x-4">
            <!-- Tabs for PC -->
            <nav class="flex space-x-2 mx-8">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                @click="navigateTab(index, tab)"
                class="text-white hover:text-yellow-300 transition px-4 py-2 rounded-lg text-sm font-medium text-nowrap"
                :class="[
                  'block w-full text-left px-4 py-2 text-sm',
                  $route.path === tab.path ? 'underline text-custom-200' : '',
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>

            <div>
              <template v-if="loginStore.isLogin">
                <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
                  <UAvatar
                    size="medium"
                    :src="loginStore.userInfo?.avatar"
                    :alt="loginStore.userInfo?.username"
                    class="cursor-pointer hover:opacity-80 transition user-avatar w-10 h-10"
                  />

                  <template #item="{ item }">
                    <div
                      @click="item.onclick"
                      class="flex w-full items-center"
                      style="column-gap: 6px"
                    >
                      <UIcon :name="item.icon" class="w-5 h-5 text-gray-500" />
                      <span>{{ item.label }}</span>
                    </div>
                  </template>
                </UDropdown>
              </template>
              <template v-else>
                <button
                  class="bg-custom-500 hover:bg-custom-600 text-white px-4 py-2 rounded transition"
                  @click="openLogin"
                >
                  登录
                </button>
              </template>
            </div>
          </div>
        </div>
      </header>

      <div style="min-height: 80vh">
        <slot></slot>
      </div>

      <UModal
        v-model="showLoginModal"
        :overlay="false"
        title="User Login"
        :closable="true"
        class="dark-modal"
      >
        <div class="p-6 space-y-6 bg-gray-800 rounded-md">
          <!-- Login Title -->
          <h2 class="text-lg font-bold text-gray-200">登录</h2>

          <!-- Username Input -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-400 pb-2">
              账号
            </label>
            <UInput
              id="username"
              v-model="username"
              placeholder="输入账号"
              :maxLength="15"
              :minLength="5"
              required
              class="dark-input"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-400 pb-2">
              密码
            </label>
            <UInput
              id="password"
              v-model="password"
              placeholder="输入密码"
              type="password"
              :maxLength="15"
              :minLength="5"
              required
              class="dark-input"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4">
            <UButton
              class="text-custom-400 hover:underline"
              @click="goSignup"
              variant="link"
            >
              注册
            </UButton>

            <div style="flex: 1"></div>

            <UButton
              class="px-6 text-gray-400 hover:text-white"
              @click="showLoginModal = false"
              variant="link"
            >
              取消
            </UButton>
            <UButton
              class="px-6 bg-custom-500 hover:bg-custom-600 text-white"
              @click="handleLogin"
              :loading="loginLoading"
            >
              登录
            </UButton>
          </div>
        </div>
      </UModal>
    </div>
  </AConfigProvider>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Api from "@/common/api/axios";
import {
  doLoginAction,
  useLoginStatusStore,
  initLoginStoreUserInfo,
  doLogout,
} from "@/common/store/login";
import { message } from "ant-design-vue";
import { langOptions } from "@/common/i18n";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import Footer from "@/components/Footer.vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

const { locale, locales, setLocale } = useI18n();

if (locale.value == "zh") {
  dayjs.locale("zh-cn");
}

const { t } = useI18n();

// Router navigation
const router = useRouter();

const loginStore = useLoginStatusStore();

const items = [
  [
    {
      label: "我的信息",
      icon: "i-heroicons-information-circle",
      onclick: async () => {
        router.push({ path: "/userInfo" });
      },
    },
    {
      label: "退出",
      icon: "i-heroicons-arrow-right-start-on-rectangle",
      onclick: async () => {
        doLogout();
      },
    },
  ],
];

// Tabs Configuration
const tabs = [
  { label: "词库", path: "/lib" },
  { label: "音标", path: "/phonetic" },
  { label: "记录", path: "/statistics" },
  { label: "成就", path: "/achievement" },
];

// State management
const showTabsMenu = ref(false); // Mobile tabs dropdown state
const showLoginModal = ref(false); // Login modal state

// Login form state
const username = ref("");
const password = ref("");

// Navigation function
const navigateTab = (index, tab) => {
  showTabsMenu.value = false;
  router.push({ path: tab.path });
};

// Handle login

function openLogin() {
  // 确保输入组件为失焦状态

  if (window.isTypingFocused) {
    window.isTypingFocused.value = false;
  }

  showLoginModal.value = true;
}

const loginLoading = ref(false);

const handleLogin = async () => {
  if (username.value.length < 5 || username.value.length > 15) {
    alert("Username must be 5-15 characters long.");
    return;
  }
  if (password.value.length < 5 || password.value.length > 15) {
    alert("Password must be 5-15 characters long.");
    return;
  }

  try {
    loginLoading.value = true;

    let res = await Api.login({
      username: username.value,
      password: password.value,
    });

    doLoginAction(res.data);

    message.success("Login Successful");
    // Simulate login success
    showLoginModal.value = false;
  } catch (e) {
    loginLoading.value = false;
  } finally {
    loginLoading.value = false;
  }
};

function goSignup() {
  showLoginModal.value = false;
  router.push({ path: "/signup" });
}

function langClick(item) {
  setLocale(item.value);
  window.location.reload();
}

initLoginStoreUserInfo();
</script>

<style scoped>
/* Dropdown z-index */
.z-50 {
  z-index: 50;
}
</style>

<style>
html,
body,
#__nuxt {
  height: 100%;
  background-color: #080808;
}
.user-avatar img {
  height: 100%;
}

.hide-scrollbar {
  /* 对于 WebKit 和 Blink 浏览器（Chrome, Safari, Edge） */
  overflow: -moz-scrollbars-none;
  /* Firefox */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* Internet Explorer 和 Edge */

  /* 隐藏 WebKit 和 Blink 浏览器的滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
}

:root {
  --header-height: 84px;
}
</style>

<style scoped>
.dark-modal {
  background-color: #1f2937; /* 深灰色背景 */
  color: #e5e7eb; /* 浅灰文字 */
  border: 1px solid #374151; /* 深色边框 */
  border-radius: 8px;
}

/* Input Style */
</style>
