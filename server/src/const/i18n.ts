import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "dayjs/locale/en";
import "dayjs/locale/ja";
import { DictKeys, SupportedLanguages } from "@/app/type";
dayjs.extend(advancedFormat);

export const en: Record<DictKeys, string> = {
  "header.left": "ddd",
  "header.center": "MMMM D",
  "header.right": "YYYY",

  "prevNextMonth.month": "MMMM",
  "prevNextMonth.monthYear": "MMMM YYYY",
};

export const ja: Record<DictKeys, string> = {
  "header.left": "YYYY年",
  "header.center": "M月D日",
  "header.right": "（ddd）",

  "prevNextMonth.month": "M月",
  "prevNextMonth.monthYear": "YYYY年M月",
};

function getDict(key: DictKeys, lang: SupportedLanguages): string {
  switch (lang) {
    case "en":
      return en[key];
    case "ja":
      return ja[key];
  }
}

export function formatI18n(
  date: dayjs.Dayjs,
  key: DictKeys,
  lang: SupportedLanguages,
): string {
  return date.locale(lang).format(getDict(key, lang));
}

export function getDayOfWeekStr(day: number, lang: SupportedLanguages): string {
  return dayjs().locale(lang).day(day).format("ddd");
}

