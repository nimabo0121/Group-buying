/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// router
import router from "./router";
import { hostLog } from "@/composables/JointAPI.js";
hostLog(`版本_v1.0`);

const app = createApp(App);

registerPlugins(app);

app.use(router);
app.mount("#app");
