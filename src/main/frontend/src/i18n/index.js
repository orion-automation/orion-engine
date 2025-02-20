import Vue from "vue";
import VueI18n from "vue-i18n";
// 从语言包文件中导入语言包对象
import zh from "./zh";
import en from "./en";
import de from "./de";
import jp from "./jp";
import {getI18nLocale} from "@/utils/auth";

Vue.use(VueI18n);
const messages = {
    zh,
    en,
    de,
    jp,
};
const i18n = new VueI18n({
    messages,
    locale: getI18nLocale() || (["zh", "en", "de", "jp"].includes(navigator.language) ? navigator.language : "zh")
});
export default i18n;
