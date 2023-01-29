import { Modal } from "antd";
import { useEffect, useState } from "react";
import { baseURL } from "../../../util/constants";
import { sendGetRequest, sendPostRequest } from "../../../util/fetchAPI";
import { showToast } from "../../../util/helper";

export default function EditProductModel({
  product,
  isModalOpen,
  setIsModalOpen,
  setIsReload,
}) {
  const [characteristic, setCharacteristic] = useState([]);
  async function getCharacteristic() {
    const response = await sendGetRequest(
      `${baseURL}/attribute/id/${product.product_id}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setCharacteristic(response.data);
    }
  }

  async function updateTotal(hash, total) {
    const postData = {
      data: {
        id: product.product_id,
        hash: hash,
        total: total,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/characteristic-product/update`,
      postData
    );
    if (response.status == "success") {
      setIsReload(true);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    getCharacteristic();
  }, [product]);

  return (
    <Modal
      title={`Editing ${product.product_name}`}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {characteristic.map((item, index) => {
        return (
          <div className="row mt-3">
            <label class="col-6 form-label mt-2">
              <h6>{item.values}</h6>
            </label>
            <input
              type="number"
              class="col-6 form-control rounded"
              placeholder="Type"
              value={item.total}
              onChange={(e) => {
                characteristic[index].total = e.target.value;
                updateTotal(item.characteristics_hash, e.target.value);
              }}
            />
          </div>
        );
      })}
    </Modal>
  );
}
