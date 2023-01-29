import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { baseURL } from "../../../util/constants";
import { sendPostRequest } from "../../../util/fetchAPI";
import { showToast } from "../../../util/helper";
export default function EditUserModel({
  isModalOpen,
  setIsModalOpen,
  userInfo,
  setUserInfo,
  setIsReload,
}) {
  const handleSubmit = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  let unCombinedAddress = userInfo.user_address.split(", ", 5);
  const [newAddress, setNewAddress] = useState({
    country: unCombinedAddress[4],
    province: unCombinedAddress[3],
    district: unCombinedAddress[2],
    ward: unCombinedAddress[1],
    specific: unCombinedAddress[0],
  });

  async function updateUser() {
    if (
      userInfo.user_fullname == "" ||
      userInfo.user_email == "" ||
      userInfo.user_phone_number == "" ||
      userInfo.user_address == "" ||
      userInfo.user_date_of_birth == ""
    ) {
      showToast("WARNING", "Invalid information!");
    } else {
      const postData = {
        data: userInfo,
      };
      const response = await sendPostRequest(
        `${baseURL}/user/update`,
        postData
      );
      if (response.status == "success") {
        showToast("SUCCESS", "User edited successfully!");
        setIsModalOpen(false);
        setIsReload(true);
      } else {
        showToast("ERROR", "There are some mistake!");
      }
    }
  }
  useEffect(() => {
    let combinedAddress = `${newAddress.specific}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.province}, ${newAddress.country}`;
    setUserInfo((current) => ({
      ...current,
      user_address: combinedAddress,
    }));
  }, [newAddress]);
  return (
    <Modal
      title={`Editing ${userInfo.user_fullname}`}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="submit" type="primary" success onClick={updateUser}>
          Submit
        </Button>,
      ]}
    >
      <div className="bg-light p-30 mb-5">
        <div className="row">
          <div className="col-md-6 form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              type="text"
              value={userInfo.user_fullname}
              onChange={(e) =>
                setUserInfo((current) => ({
                  ...current,
                  user_fullname: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>E-mail</label>
            <input
              className="form-control"
              type="text"
              value={userInfo.user_email}
              onChange={(e) =>
                setUserInfo((current) => ({
                  ...current,
                  user_email: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>Phone number</label>
            <input
              className="form-control"
              type="number"
              value={userInfo.user_phone_number}
              onChange={(e) =>
                setUserInfo((current) => ({
                  ...current,
                  user_phone_number: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>Gender</label>
            <select
              className="form-control"
              name="gender"
              onChange={(e) =>
                setUserInfo((current) => ({
                  ...current,
                  user_gender: e.target.value,
                }))
              }
            >
              <option value={"male"} selected={userInfo.user_gender == "male"}>
                Male
              </option>
              <option
                value={"female"}
                selected={userInfo.user_gender == "female"}
              >
                Female
              </option>
            </select>
          </div>
          <div className="col-md-6 form-group">
            <label>Country</label>
            <input
              className="form-control"
              type="text"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress((current) => ({
                  ...current,
                  country: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>Province</label>
            <input
              className="form-control"
              type="text"
              value={newAddress.province}
              onChange={(e) =>
                setNewAddress((current) => ({
                  ...current,
                  province: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>District</label>
            <input
              className="form-control"
              type="text"
              value={newAddress.district}
              onChange={(e) =>
                setNewAddress((current) => ({
                  ...current,
                  district: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>Ward</label>
            <input
              className="form-control"
              type="text"
              value={newAddress.ward}
              onChange={(e) =>
                setNewAddress((current) => ({
                  ...current,
                  ward: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-12 form-group">
            <label>Specific</label>
            <input
              className="form-control"
              type="text"
              value={newAddress.specific}
              onChange={(e) =>
                setNewAddress((current) => ({
                  ...current,
                  specific: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-12 form-group">
            <label>Date of birth</label>
            <input
              className="form-control"
              type="date"
              value={new Date(userInfo.user_date_of_birth).toLocaleDateString(
                "en-CA"
              )}
              onChange={(e) =>
                setUserInfo((current) => ({
                  ...current,
                  user_date_of_birth: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
