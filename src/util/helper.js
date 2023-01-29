import { toast } from "react-toastify";
import { baseURL } from "./constants";

export const showToast = (type, content) => {
  switch (type) {
    case "WARNING":
      toast.warning(content, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
    case "SUCCESS":
      toast.success(content, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
    case "INFOR":
      toast.info(content, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
    case "ERROR":
      toast.error(content, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;

    default:
      break;
  }
};

export const getVoucherStatus = (id) => {
  // status:
  //     not found: 0
  //     not started: 1
  //     ended: 2
  //     ready: 3
  //     code is out: 4
  switch (id) {
    case 0:
      return "Invalid voucher";
    case 1:
      return "It's not time to use the voucher yet";
    case 2:
      return "Expired voucher";
    case 3:
      return "Successfully applied voucher";
    case 4:
      return "Voucher is out";

    default:
      break;
  }
};

export const formatdolla = (n, currency) => {
  return (
    currency +
    n.toFixed(2).replace(/./g, function(c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    })
  );
};

export const calculateDiscountByPercent = (total, discount) => {
  return total - (total / 100) * discount;
};

export const calculateTotalPrice = (cart) => {
  let total = 0;
  if (cart != undefined) {
    cart.map((item) => {
      total += item.totalprice;
    });
  }
  return total;
};

export const divPriceToArray = (maximum) => {
  var maximum_price = maximum;
  const convert_const = Math.pow(10, Math.floor(Math.log10(maximum_price)));
  maximum_price = Math.round(maximum_price / convert_const) * convert_const;
  const step = maximum_price / 4;
  var price_arr = [];
  for (let index = 0; index <= maximum_price; index += step) {
    if (index + step >= maximum_price) {
      price_arr.push({
        text: `Over $${index}`,
        data: { min: index, max: 0 },
      });
      break;
    }
    price_arr.push({
      text: `$${index} - $${index + step}`,
      data: { min: index, max: index + step },
    });
  }
  return price_arr;
};

export const formatdate = (date) => {
  var d = new Date(date);

  return (
    d.getHours() +
    ":" +
    d.getMinutes() +
    ":" +
    d.getSeconds() +
    " " +
    d.getDate() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getFullYear() 
  );
};

export const formatbirthday = (date) => {
  var d = new Date(date);

  return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
};

export function validateEmail(input) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

export function validatePassword(input) {
  var validRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
  if (input.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

export function generateHash(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
