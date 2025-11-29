<!-- 步驟 3: 選擇取貨方式 -->
<template>
  <div>
    <v-card-title class="text-h6 primary--text d-flex align-center">
      <v-icon class="mr-2">
        mdi-map-marker-outline
      </v-icon>
      選擇取貨方式
    </v-card-title>
    <v-card-text class="pa-4">
      <v-radio-group
        :model-value="pickupType"
        hide-details
        @update:model-value="handlePickupTypeChange"
      >
        <v-radio
          v-for="method in availablePickupMethods"
          :key="method.value"
          :value="method.value"
          color="primary"
          class="mb-3"
        >
          <template #label>
            <div>
              <div class="font-weight-medium">
                {{ method.label }}
              </div>
              <div
                v-if="method.description"
                class="text-caption text-medium-emphasis"
              >
                {{ method.description }}
              </div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
      
      <!-- 到店取貨資訊 -->
      <v-card
        v-if="pickupType === 'in_store' && inStoreInfo"
        variant="outlined"
        class="mt-4"
      >
        <v-card-text>
          <div class="text-body-2">
            <div class="d-flex align-center mb-2">
              <v-icon
                size="small"
                class="mr-2"
              >
                mdi-store
              </v-icon>
              <span class="font-weight-medium">取貨地址</span>
            </div>
            <div class="ml-7 mb-2">
              {{ inStoreInfo.address }}
            </div>
            <div
              v-if="inStoreInfo.note"
              class="ml-7 text-caption text-medium-emphasis"
            >
              <v-icon
                size="small"
                class="mr-1"
              >
                mdi-information-outline
              </v-icon>
              {{ inStoreInfo.note }}
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 定點取貨選擇器 -->
      <v-select
        v-if="pickupType === 'pickup_point'"
        :model-value="pickupPoint"
        :items="pickupPoints"
        label="選擇定點"
        variant="outlined"
        class="mt-4"
        item-title="text"
        item-value="value"
        @update:model-value="$emit('update:pickupPoint', $event)"
      >
        <template #item="{ props: itemProps, item }">
          <v-list-item
            v-bind="itemProps"
            :title="item.raw.text"
            :subtitle="getPickupPointSubtitle(item.raw)"
          >
            <template #prepend>
              <v-icon>mdi-map-marker</v-icon>
            </template>
          </v-list-item>
        </template>
      </v-select>
      
      <!-- 選中的定點詳細資訊 -->
      <v-card
        v-if="pickupType === 'pickup_point' && selectedPointDetails"
        variant="outlined"
        class="mt-3"
      >
        <v-card-text>
          <div class="text-body-2">
            <div class="d-flex align-center mb-2">
              <v-icon
                size="small"
                class="mr-2"
              >
                mdi-map-marker
              </v-icon>
              <span class="font-weight-medium">{{ selectedPointDetails.address }}</span>
            </div>
            <div
              v-if="selectedPointDetails.description"
              class="text-caption mb-2 ml-7"
            >
              {{ selectedPointDetails.description }}
            </div>
            <div
              v-if="selectedPointDetails.availableDays"
              class="d-flex align-center text-caption ml-7 mb-1"
            >
              <v-icon
                size="small"
                class="mr-2"
              >
                mdi-calendar
              </v-icon>
              <span>{{ selectedPointDetails.availableDays.join('、') }}</span>
            </div>
            <div
              v-if="selectedPointDetails.availableTime"
              class="d-flex align-center text-caption ml-7"
            >
              <v-icon
                size="small"
                class="mr-2"
              >
                mdi-clock-outline
              </v-icon>
              <span>{{ selectedPointDetails.availableTime }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-alert
        v-if="!canNext && availablePickupMethods.length > 0"
        type="info"
        variant="tonal"
        class="mt-4"
      >
        {{ pickupType === "pickup_point" ? "請選擇取貨定點" : "請選擇取貨方式" }}
      </v-alert>
      
      <v-alert
        v-if="availablePickupMethods.length === 0"
        type="warning"
        variant="tonal"
        class="mt-4"
      >
        目前沒有可用的取貨方式
      </v-alert>
    </v-card-text>
    <v-card-actions class="px-4 pb-4">
      <v-btn
        variant="outlined"
        @click="$emit('prev')"
      >
        <v-icon start>
          mdi-chevron-left
        </v-icon>
        上一步
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        :disabled="!canNext"
        @click="$emit('next')"
      >
        下一步
        <v-icon end>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  pickupType: {
    type: String,
    default: null
  },
  pickupPoint: {
    type: String,
    default: null
  },
  pickupPoints: {
    type: Array,
    default: () => []
  },
  pickupMethods: {
    type: Array,
    default: () => []
  },
  storeSettings: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:pickupType', 'update:pickupPoint', 'next', 'prev', 'cancel'])

const closeOrderDialog = inject('closeOrderDialog', null)

const handleCancel = () => {
  if (closeOrderDialog) {
    closeOrderDialog()
  } else {
    emit('cancel')
  }
}

// 可用的取貨方式
const availablePickupMethods = computed(() => {
  if (props.pickupMethods?.length > 0) {
    return props.pickupMethods
  }
  // 預設選項（若 API 未載入）
  return [
    { value: 'in_store', label: '到店取貨', description: '親自到店面領取商品' }
  ]
})

// 到店取貨資訊
const inStoreInfo = computed(() => {
  if (!props.storeSettings?.settings?.pickupMethods?.inStore) return null
  return props.storeSettings.settings.pickupMethods.inStore
})

// 選中的定點詳細資訊
const selectedPointDetails = computed(() => {
  if (!props.pickupPoint || !props.pickupPoints) return null
  return props.pickupPoints.find(p => p.value === props.pickupPoint)
})

// 取得定點的副標題
const getPickupPointSubtitle = (point) => {
  const parts = []
  if (point.availableDays) {
    parts.push(point.availableDays.join('、'))
  }
  if (point.availableTime) {
    parts.push(point.availableTime)
  }
  return parts.join(' ')
}

// 處理取貨方式變更
const handlePickupTypeChange = (value) => {
  emit('update:pickupType', value)
  // 如果切換到其他方式，清空定點選擇
  if (value !== 'pickup_point' && props.pickupPoint) {
    emit('update:pickupPoint', null)
  }
}

const canNext = computed(() => {
  if (!props.pickupType) return false
  if (props.pickupType === 'pickup_point') return !!props.pickupPoint
  return true
})
</script>
