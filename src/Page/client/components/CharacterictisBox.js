import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { buyProduct } from "../../../redux/actions/buyProduct";
import { calculateDiscountByPercent, showToast } from "../../../util/helper";

export default function CharacterictisBox({ productInfo, characterictis }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.user);
  const [count, setCount] = useState(0);
  const [selectedCharacterictis, setSelectedCharacterictis] = useState();

  function onSelectCharacterictis(characterictis) {
    setSelectedCharacterictis(characterictis);
    setCount(0);
  }
  function onBuyProduct() {
    if (userRedux.user != undefined && userRedux.user != null) {
      if (selectedCharacterictis == undefined) {
        showToast("WARNING", "Please select enough product characteristics");
      } else {
        const product_current = {
          product_id: productInfo.product_id,
          product_image: productInfo.product_image,
          product_name: productInfo.product_name,
          price: productInfo.product_discount
            ? calculateDiscountByPercent(
                productInfo.product_price,
                productInfo.product_discount
              )
            : productInfo.product_price,
          quantity: count,
          characteristics: selectedCharacterictis,
          totalprice: productInfo.product_discount
            ? calculateDiscountByPercent(
                productInfo.product_price,
                productInfo.product_discount
              ) * count
            : productInfo.product_price * count,
        };
        dispatch(buyProduct(product_current));
        navigate("/shoppingcart");
      }
    } else {
      showToast("INFOR", "You need to be logged in to perform this action");
    }
  }
  return (
    <div>
      {characterictis.map((item, index) => {
        return (
          <span
            className={`border p-2 mr-3 ${selectedCharacterictis != undefined &&
              selectedCharacterictis.values == item.values &&
              "border-info"}`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelectCharacterictis(item)}
          >
            {item.values}
          </span>
        );
      })}
      <span className="d-block mt-3">
        {selectedCharacterictis != undefined &&
          `${selectedCharacterictis.total} ${
            selectedCharacterictis.total > 1 ? "products are" : "product is"
          } available`}
      </span>
      <div className="d-flex align-items-center mt-2 mb-4 pt-2">
        <div className="input-group quantity mr-3" style={{ width: "130px" }}>
          <div className="input-group-btn">
            <button
              className="btn btn-info btn-minus"
              onClick={() => {
                count > 0 && setCount(count - 1);
              }}
            >
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <input
            type="text"
            id="mix"
            className="form-control mix bg-secondary border-0 text-center"
            onChange={(e) => setCount(e.target.value)}
            value={count}
          />
          <div className="input-group-btn">
            <button
              className="btn btn-info btn-plus"
              onClick={() => {
                !(count >= selectedCharacterictis.total) && setCount(count + 1);
              }}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <button
          className="btn btn-info px-3"
          disabled={
            (selectedCharacterictis == undefined ||
              selectedCharacterictis.total == 0 ||
              count == 0) &&
            true
          }
          onClick={() => onBuyProduct()}
        >
          <i className="fa fa-shopping-cart mr-1"></i> Add To Cart
        </button>
      </div>
    </div>
  );
}
