import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast, validateEmail, validatePassword } from "../../../util/helper";
import { sendPostRequest } from "../../../util/fetchAPI";
import { baseURL } from "../../../util/constants";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [registerInfo, setRegisterInfo] = useState({
    user_email: "",
    password: "",
    user_fullname: "",
    user_phone_number: "",
    user_gender: "",
    user_date_of_birth: "",
    user_address: "",
    user_rule: 0,
  });
  const [newAddress, setNewAddress] = useState({
    country: "",
    province: "",
    district: "",
    ward: "",
    specific: "",
  });

  const onRegisterHandler = async () => {
    if (
      !validateEmail(registerInfo.user_email) ||
      !validatePassword(registerInfo.password) ||
      registerInfo.user_fullname == "" ||
      registerInfo.user_phone_number == "" ||
      registerInfo.user_gender == "-- Gender --" ||
      registerInfo.user_date_of_birth == "" ||
      newAddress.country == "" ||
      newAddress.province == "" ||
      newAddress.district == "" ||
      newAddress.ward == "" ||
      newAddress.specific == ""
    ) {
      showToast("WARNING", "Invalid information");
    } else {
      const response = await sendPostRequest(
        `${baseURL}/user/register`,
        registerInfo
      );
      if (
        response.message == "The E-mail already in use" ||
        response.message == "You are filling in missing information!!"
      ) {
        showToast("ERROR", response.message);
      } else {
        showToast("SUCCESS", response.message);
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    let combinedAddress = `${newAddress.specific}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.province}, ${newAddress.country}`;
    setRegisterInfo((current) => ({
      ...current,
      user_address: combinedAddress,
    }));
  }, [newAddress]);
  return (
    <>
      <h5 className="section-title position-relative text-uppercase mb-3">
        <span className="bg-secondary pr-3">REGISTER</span>
      </h5>
      <div className="bg-light row p-30 mb-5">
        <div className="col-md-6 form-group">
          <label>E-mail</label>
          <input
            className="form-control"
            type="email"
            placeholder="example@email.com"
            onChange={(e) =>
              setRegisterInfo((current) => ({
                ...current,
                user_email: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className="col-md-6 form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="Example@123"
            onChange={(e) =>
              setRegisterInfo((current) => ({
                ...current,
                password: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-md-6 form-group">
          <label>Fullname</label>
          <input
            className="form-control"
            type="text"
            placeholder="Fullname"
            onChange={(e) =>
              setRegisterInfo((current) => ({
                ...current,
                user_fullname: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-md-6 form-group">
          <label>Phone number</label>
          <input
            className="form-control"
            type="number"
            placeholder="Phone number"
            onChange={(e) =>
              setRegisterInfo((current) => ({
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
              setRegisterInfo((current) => ({
                ...current,
                user_gender: e.target.value,
              }))
            }
            defaultChecked={0}
          >
            <option>-- Gender --</option>
            <option value={"male"}>Male</option>
            <option value={"female"}>Female</option>
          </select>
        </div>
        <div className="col-md-6 form-group">
          <label>Date of birth</label>
          <input
            className="form-control"
            type="date"
            onChange={(e) =>
              setRegisterInfo((current) => ({
                ...current,
                user_date_of_birth: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-md-3 form-group">
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
        <div className="col-md-3 form-group">
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
        <div className="col-md-3 form-group">
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
        <div className="col-md-3 form-group">
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
          <button
            className="btn btn-block btn-info font-weight-bold py-3"
            onClick={() => onRegisterHandler()}
          >
            REGISTER
          </button>
          <div className="col-md-12 text-center p-3">
            <Link to={"/login"}>Already have an account? Login here</Link>
          </div>
        </div>
        <div className="col-md-12 form-group">
          <span style={{ fontSize: 14 }}>
            *Passwords must have at least 8 characters and contain: uppercase
            letters, lowercase letters, numbers and symbols.
          </span>
        </div>
      </div>
    </>
  );
}
