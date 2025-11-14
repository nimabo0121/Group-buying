<template>
  <div class="error-dialog">
    <h2>錯誤訊息</h2>
    <div
      style="width: 100%; height: 50%"
      class="d-flex justify-center align-end"
    >
      <h2 class="text-wrap" :style="{ color: props.color }" style="width: 100%">
        {{ props.title }}
      </h2>
    </div>
    <div style="width: 100%; height: 50%" class="d-flex justify-end align-end">
      <v-btn @click="DialogData({}, 25)" class="state-yes"> 關閉 </v-btn>
    </div>
  </div>
</template>
<script setup>
import { inject } from "vue";

const props = defineProps({
  title: String,
  color: String,
  APIErrorMsg: Object,
});
// console.log("props", props.title);
const DialogData = inject("DialogData");

const emit = defineEmits(["done"]);
// console.log(props);
</script>
<style scoped>
.text-wrap {
  white-space: normal;
  overflow-wrap: break-word;
  margin: 0;
  text-align: center;
}
</style>
