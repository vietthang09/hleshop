import { combineReducers } from "redux"
import cardReducer from "./cardReducer"
import layoutReducer from "./layoutReducer"
import userReducer from "./userReducer"

const rootReducer = combineReducers({
    user: userReducer,
    cart: cardReducer,
    layoutReducer
})

export default rootReducer