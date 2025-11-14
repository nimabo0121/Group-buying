import { isGuiNumberValid, isNationalIdentificationNumberValid } from 'taiwan-id-validator';
import { useI18n } from 'vue-i18n';

export const validatorFunc = () => {

    const { t } = useI18n();

    // 重量檢核
    function weightValidator(value) {
        if (/^\d+(\.\d+)?$/.test(value.toString()) || value.toString() == '')
            return true;
        else
            return t('errorMsg.inputInvalid');
    }

    // 數字檢核
    function numberValidator(value) {
        if (/^[0-9]*$/.test(value.toString()))
            return true;
        else
            return t('errorMsg.inputInvalid');
    }

    // 英數字檢核
    function letterValidator(value) {
        if (/^[A-Za-z0-9]*$/.test(value.toString()))
            return true;
        else
            return t('errorMsg.inputInvalid');
    }

    // 身分證/統一編號檢核
    function idNumberValidator(value) {
        if (isNationalIdentificationNumberValid(value) || isBusinessIdNumber(value))
            return true;
        else
            return t('errorMsg.inputInvalid');
    }

    // 電話號碼檢核
    function phoneNumberValidator(value) {
        if (/^09[0-9]{8}$/.test(value) || /^0[0-9]{1}[0-9]{6,8}$/.test(value))
            return true;
        else
            return t('errorMsg.inputInvalid');
    }

    // 統一編號邏輯檢查
    function isBusinessIdNumber(value) {
        const multiplier = [1, 2, 1, 2, 1, 2, 4, 1];

        const n = value;
        const regex = /^\d{8}$/;

        if (!regex.test(n)) return false;

        const intRadix = 10;
        const checksum = zipWith(
            multiplier,
            n.split('').map(c => parseInt(c, intRadix)),
            multiply
        )
            .map(n => (n % 10) + Math.floor(n / 10))
            .reduce(add, 0);

        const divisor = 5;

        return (
            checksum % divisor === 0 ||
            (parseInt(n.charAt(6), intRadix) === 7 && (checksum + 1) % divisor === 0)
        );
    }

    function zipWith(a1, a2, f) {
        const length = Math.min(a1.length, a2.length);
        const result = [];

        for (let i = 0; i < length; i++) result[i] = f(a1[i], a2[i]);

        return result;
    }

    function add(a, b) {
        return a + b;
    }

    function multiply(a, b) {
        return a * b;
    }

    return {
        weightValidator,
        numberValidator,
        letterValidator,
        idNumberValidator,
        phoneNumberValidator
    }
}
