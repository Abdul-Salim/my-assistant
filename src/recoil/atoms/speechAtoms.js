import { isEmpty } from "lodash";
import { atom } from "recoil";

export const speech = atom({
  key: "cartState",
  default: [],
  effects: [
    ({ onSet }) => {
      onSet((value) => {
        localStorage.setItem("cartState", JSON.stringify(value));
      });
    },
    ({ setSelf }) => {
      const cart = localStorage.getItem("cartState");
      if (!isEmpty(cart)) setSelf(JSON.parse(cart));
    },
  ],
});

export const cartRoute = atom({
  key: "cartRoute",
  default: { active: "", completed: [] },
});
