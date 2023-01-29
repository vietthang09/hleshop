import * as CONSTANTS from "../../util/constants";
import { getCookie, setCookie } from "../../util/localStorageHandle";

const initState = {
  cartAr: [],
};

const cardReducer = (state = initState, action) => {
  const _cartData = JSON.parse(getCookie(CONSTANTS.cartCookie));
  if (_cartData) {
    state.cartAr = _cartData;
  }
  switch (
    action.type // day la cac action de thay doi state
  ) {
    case "BUY_PRODUCT":
      const productInCart = state.cartAr.find(
        (p) =>
          p.product_id == action.payload.product_id &&
          JSON.stringify(p.characteristics) ==
            JSON.stringify(action.payload.characteristics)
      );

      if (productInCart) {
        let newCard = state.cartAr;
        const objIndex = newCard.findIndex(
          (obj) => obj.product_id === action.payload.product_id
        );
        if (newCard[objIndex].quantity === undefined) {
          newCard[objIndex].quantity = action.payload.quantity;
        } else {
          newCard[objIndex].quantity =
            newCard[objIndex].quantity + action.payload.quantity;
          newCard[objIndex].totalprice =
            newCard[objIndex].quantity * newCard[objIndex].price;
        }
        state.cartAr = [...newCard];
      } else {
        state.cartAr = [...state.cartAr, action.payload];
      }
      setCookie(CONSTANTS.cartCookie, JSON.stringify(state.cartAr));
      return state;
    case "DELETE_PRODUCT":
      let newCard = state.cartAr;
      const objIndex = newCard.findIndex(
        (obj) =>
          obj.product_id == action.payload.product_id &&
          JSON.stringify(obj.characteristics) ==
            JSON.stringify(action.payload.characteristics)
      );
      newCard.splice(objIndex, 1);
      state.cartAr = [...newCard];
      if (state.cartAr.length == 0) {
        localStorage.removeItem(CONSTANTS.cartCookie);
      } else {
        setCookie(CONSTANTS.cartCookie, JSON.stringify(state.cartAr));
      }
      return state;
    default:
      return state;
  }
};

export default cardReducer;
