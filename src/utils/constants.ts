export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const PaymentTypes: { [key: string]: string } = {
    "card": "online",
    "cash": "cash"
  }

export const cardCategory: { [key: string]: string } = {
  "софт-скил": "card__category_soft",
  "хард-скил": "card__category_hard",
  "кнопка": "card__category_button",
  "дополнительное": "card__category_additional",
  "другое": "card__category_other"
}