<template>
  <div class="account-page">
    <!-- 內容區 -->
    <div class="account-content">
      <!-- 頭貼區塊 -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img
            :src="formData.pictureUrl || 'https://via.placeholder.com/150'"
            alt="使用者頭貼"
            class="avatar-image"
          >
        </div>
        <div class="display-name">
          {{ formData.displayName || '訪客' }}
        </div>
        <!-- <div class="user-id">
          ID: {{ formData.uuid || '-' }}
        </div> -->
      </div>

      <v-divider class="my-6" />

      <!-- 編輯表單 -->
      <v-form ref="formRef" v-model="formValid" class="edit-form">
        <!-- 暱稱 -->
        <div class="form-section">
          <div class="section-title">
            <v-icon class="mr-2" color="primary">
              mdi-account-circle
            </v-icon>
            基本資訊
          </div>
          <v-text-field
            v-model="formData.displayName"
            label="暱稱"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account"
          />
        </div>

        <!-- 聯絡資訊 -->
        <div class="form-section">
          <div class="section-title">
            <v-icon class="mr-2" color="primary">
              mdi-phone
            </v-icon>
            聯絡資訊
          </div>
          <v-text-field
            v-model="formData.profile.phone"
            label="手機號碼"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required, rules.phone]"
            prepend-inner-icon="mdi-cellphone"
            placeholder="0912345678"
          />
        </div>

        <!-- 收件人資訊 -->
        <div class="form-section">
          <div class="section-title">
            <v-icon class="mr-2" color="primary">
              mdi-map-marker
            </v-icon>
            收件人資訊
          </div>
          <v-text-field
            v-model="formData.profile.name"
            label="收件人姓名"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-box"
            class="mb-4"
          />
          <v-textarea
            v-model="formData.profile.address"
            label="收件地址"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-home"
            rows="3"
            placeholder="請輸入完整地址"
          />
        </div>
      </v-form>

      <!-- 儲存按鈕 -->
      <div class="action-buttons">
        <v-btn
          variant="outlined"
          size="large"
          @click="resetForm"
        >
          重設
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          size="large"
          :disabled="!formValid || !isFormChanged"
          :loading="saving"
          @click="saveProfile"
        >
          儲存變更
        </v-btn>
      </div>
    </div>

    <!-- 成功提示 -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Userdata } from '@/utils/api/apiClient';

const formRef = ref(null);
const formValid = ref(false);
const saving = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const originalData = ref(null);
const formData = reactive({
  uuid: '',
  lineUserId: '',
  displayName: '',
  pictureUrl: '',
  statusMessage: '',
  profile: {
    name: '',
    phone: '',
    address: ''
  },
  createdAt: '',
  updatedAt: '',
  isProfileComplete: false
});

// 表單驗證規則
const rules = {
  required: value => !!value || '此欄位為必填',
  phone: value => {
    const pattern = /^09\d{8}$/;
    return pattern.test(value) || '請輸入有效的手機號碼 (09開頭的10位數字)';
  }
};

// 檢查表單是否有變更
const isFormChanged = computed(() => {
  if (!originalData.value) return false;
  
  return (
    formData.displayName !== originalData.value.displayName ||
    formData.profile.name !== originalData.value.profile.name ||
    formData.profile.phone !== originalData.value.profile.phone ||
    formData.profile.address !== originalData.value.profile.address
  );
});

// 載入使用者資料
const loadUserData = async () => {
  try {
    const res = await Userdata();
    if (res.data.users) {
      const userData = res.data.users;
      
      // 複製入 formData
      Object.assign(formData, {
        uuid: userData.uuid,
        lineUserId: userData.lineUserId,
        displayName: userData.displayName,
        pictureUrl: userData.pictureUrl,
        statusMessage: userData.statusMessage,
        profile: {
          name: userData.profile.name,
          phone: userData.profile.phone,
          address: userData.profile.address
        },
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        isProfileComplete: userData.isProfileComplete
      });
      
      // 儲存原始資料
      originalData.value = JSON.parse(JSON.stringify(formData));
    }
  } catch (error) {
    console.error('載入使用者資料失敗:', error);
    showSnackbar('載入資料失敗', 'error');
  }
};

// 重設表單
const resetForm = () => {
  if (originalData.value) {
    Object.assign(formData, JSON.parse(JSON.stringify(originalData.value)));
  }
};

// 儲存資料
const saveProfile = async () => {
  if (!formRef.value) return;
  
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  
  saving.value = true;
  
  try {
    // 這裡應該調用更新 API
    // const res = await UpdateUserProfile(formData);
    
    // 模擬 API 請求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 更新原始資料
    originalData.value = JSON.parse(JSON.stringify(formData));
    formData.updatedAt = new Date().toISOString();
    
    // 更新 sessionStorage
    sessionStorage.setItem('userProfile', JSON.stringify(formData));
    
    showSnackbar('資料儲存成功', 'success');
  } catch (error) {
    console.error('儲存資料失敗:', error);
    showSnackbar('儲存資料失敗', 'error');
  } finally {
    saving.value = false;
  }
};

// 顯示提示訊息
const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadUserData();
});
</script>

<style lang="scss" scoped>
.account-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px 16px 40px;
}

.account-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 32px;

  .avatar-wrapper {
    position: relative;
    margin-bottom: 16px;
    width: 150px;
    height: 150px;
    flex-shrink: 0;

    .avatar-image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 5px solid #667eea;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      display: block;
    }
  }

  .display-name {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }

  .user-id {
    font-size: 14px;
    color: #666;
  }
}

.edit-form {
  .form-section {
    margin-bottom: 12px;

    .section-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 16px;
    }
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 8px;
    margin-bottom: 8px;

    .info-label {
      font-weight: 600;
      color: #666;
    }

    .info-value {
      color: #333;
      word-break: break-all;
      text-align: right;
      max-width: 60%;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;

  .v-btn {
    flex: 1;
  }
}

@media (min-width: 768px) {
  .account-page {
    padding: 40px 24px;
  }

  .account-content {
    padding: 48px 40px;
  }

  .avatar-section {
    padding: 32px 0 40px;

    .avatar-wrapper {
      width: 180px;
      height: 180px;

      .avatar-image {
        width: 100%;
        height: 100%;
      }
    }

    .display-name {
      font-size: 28px;
    }
  }
}
</style>