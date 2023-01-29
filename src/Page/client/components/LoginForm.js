import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../../util/constants";
import { sendPostRequest } from "../../../util/fetchAPI";
import { showToast, validateEmail } from "../../../util/helper";
import cookie from "react-cookies";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/actions/loginUser";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    user_email: "",
    password: "",
  });

  const onLoginHandler = async () => {
    if (
      !validateEmail(loginInfo.user_email) ||
      loginInfo.user_email == "" ||
      loginInfo.password == ""
    ) {
      showToast("WARNING", "Invalid account");
    } else {
      const response = await sendPostRequest(
        `${baseURL}/user/login`,
        loginInfo
      );
      if (
        response.message === "Invalid account" ||
        response.message === "Incorrect password"
      ) {
        showToast("ERROR", response.message);
      } else {
        switch (response.data.status) {
          case 0:
            cookie.save("token", JSON.stringify(response.token));
            cookie.save("user", response.data);
            dispatch(loginUser(response.data));
            showToast("SUCCESS", "Login successful");
            navigate("/");
            break;
          case 1:
            showToast("WARNING", "Your account is banded");
            break;
          case 2:
            cookie.save("token", JSON.stringify(response.token));
            cookie.save("user", response.data);
            dispatch(loginUser(response.data));
            navigate("/account-verification", {
              state: {
                user_email: loginInfo.user_email,
              },
            });
            break;

          default:
            break;
        }
      }
    }
  };
  return (
    <>
      <h5 className="section-title position-relative text-uppercase mb-3">
        <span className="bg-secondary pr-3">LOGIN</span>
      </h5>
      <div className="bg-light p-30 mb-5">
        <div className="row">
          <div className="col-md-12 form-group">
            <label>E-mail</label>
            <input
              className="form-control"
              type="email"
              placeholder="example@email.com"
              onChange={(e) =>
                setLoginInfo((current) => ({
                  ...current,
                  user_email: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="col-md-12 form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setLoginInfo((current) => ({
                  ...current,
                  password: e.target.value,
                }))
              }
              required
            />
          </div>
          <button
            className="btn btn-block btn-info font-weight-bold py-3"
            onClick={() => onLoginHandler()}
          >
            LOGIN
          </button>
          <div className="col-md-12 text-center p-3">
            <Link to={"/register"}>Don't have an account? Register here</Link>
          </div>
        </div>
      </div>
    </>
  );
}
