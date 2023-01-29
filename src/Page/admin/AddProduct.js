import { useState } from "react";
import CreateProductDescription from "./components/CreateProductDescription";
import CreateProductInfo from "./components/CreateProductInfo";

export default function AddProduct() {
  const [productInfo, setProductInfo] = useState({
    id: "",
    name: "",
    trademark: "",
    categoryId: "",
    price: 0,
    discount: 0,
    image: "",
    imageDes1: "",
    imageDes2: "",
    description: "",
    total: 0,
  });

  const [errorList, setErrorList] = useState({
    name: false,
    trademark: false,
    categoryId: false,
    price: false,
    image: false,
    imageDes: false,
    characteristics: false,
    description: false,
  });

  const [update, setUpdate] = useState(false);
  return (
    <div className="container-fluid">
      <div className="row gx-5">
        <div className="col">
          <CreateProductInfo
            productInfo={productInfo}
            setProductInfo={setProductInfo}
            update={update}
            errorList={errorList}
            setErrorList={setErrorList}
          />
        </div>
        <div className="mx-2"></div>
        <div className="col">
          <CreateProductDescription
            productInfo={productInfo}
            setProductInfo={setProductInfo}
            update={update}
            setUpdate={setUpdate}
            errorList={errorList}
            setErrorList={setErrorList}
          />
        </div>
      </div>
    </div>
  );
}
