import { useEffect, useState } from "react";
import { sendGetRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import { useSelector } from "react-redux";
import Products from "./components/Products";
import { showToast } from "../../util/helper";
import { Link } from "react-router-dom";
export default function Wishlist() {
  const userRedux = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [reloadWishlist, setReloadWishlist] = useState(false);
  async function getProducts() {
    const response = await sendGetRequest(
      `${baseURL}/wishlist/user/${userRedux.user.user_id}`
    );
    if (response.status == "success") {
      setProducts(response.data);
    } else {
      showToast("ERROR", response.message);
    }
  }
  useEffect(() => {
    getProducts();
    setReloadWishlist(false);
  }, [reloadWishlist]);
  return (
    <div className="container-fluid">
      <div className="row px-xl-5">
        <div className="col-12">
          <nav className="breadcrumb bg-light mb-30">
            <Link className="breadcrumb-item text-dark" href="#">
              Home
            </Link>
            <span className="breadcrumb-item active">Favourite</span>
          </nav>
        </div>
      </div>

      <div className="row px-xl-5">
        <Products products={products} setUpdate={setReloadWishlist} />
      </div>
    </div>
  );
}
