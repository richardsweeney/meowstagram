import { ofetch } from "ofetch";

export const api = ofetch.create({
  baseURL: "https://api.thecatapi.com/v1",
  headers: {
    "x-api-key": import.meta.env.VITE_CAT_API_KEY,
  },
});
