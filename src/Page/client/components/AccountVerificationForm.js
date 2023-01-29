import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPostRequest } from "../../../util/fetchAPI";
import { baseURL } from "../../../util/constants";
import { showToast } from "../../../util/helper";
import { useSelector } from "react-redux";
import cookie from "react-cookies";

export default function AccountVerificationForm(props) {
  const Ref = useRef(null);
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.user);
  const [isSend, setIsSend] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [inputPin, setInputPin] = useState("");
  const [timer, setTimer] = useState("00:00:00");
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };
  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };
  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("00:00:30");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };
  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 30);
    return deadline;
  };
  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  const onRequestCodeHandler = async () => {
    let postData = {
      user_email: props.user_email,
    };
    await sendPostRequest(`${baseURL}/auth/generate-pin`, postData);
  };

  const onSendPinHandler = async () => {
    let postData = {
      user_email: props.user_email,
      pin: inputPin,
    };
    var response = await sendPostRequest(
      `${baseURL}/auth/verify-email`,
      postData
    );
    if (response.status == "success") {
      if (response.data.affectedRows != 0) {
        var user = userRedux.user;
        user.status = 0;
        cookie.save("user", user);
        showToast("SUCCESS", "Email verification successful");
        navigate("/");
      }
    } else {
      showToast("ERROR", response.message);
    }
  };
  useEffect(() => {
    if (isResend) {
      onRequestCodeHandler();
      setIsResend(false);
    }
  }, [isResend]);
  return (
    <>
      <div className="bg-light p-30 mb-5">
        <div className="row">
          {isSend ? (
            <>
              <div className="col-md-12 text-center">
                <h4 className="mb-3 text-center my-5">
                  <span className="pr-3">Verify your email address</span>
                </h4>
                <span>
                  We emailed you a six-digit code to "{props.user_email}".
                  <br />
                  Enter the code below to confirm your email address
                </span>
              </div>
              <div className="col-md-12 py-5">
                <div className="row d-flex justify-content-center">
                  <div className="col-md-3">
                    <input
                      className="form-control text-center"
                      type="number"
                      onChange={(e) => setInputPin(e.target.value)}
                      onKeyPress={(e) =>
                        e.target.value.length > 5 && e.preventDefault()
                      }
                    />
                  </div>
                  <button
                    className="btn btn-info"
                    onClick={() => onSendPinHandler()}
                  >
                    Send
                  </button>
                </div>
              </div>
              <div className="col-md-12 text-center">
                {timer == "00:00:00" ? (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      onClickReset();
                      setIsResend(true);
                    }}
                  >
                    Resend
                  </span>
                ) : (
                  <span>{timer}</span>
                )}
              </div>
            </>
          ) : (
            <div className="col-md-12 text-center">
              <Link to="" className="text-decoration-none">
                <span className="h1 text-uppercase text-info bg-dark px-2">
                  Multi
                </span>
                <span className="h1 text-uppercase text-white bg-info px-2 ml-n1">
                  Shop
                </span>
              </Link>
              <h4 className="mb-3 text-center my-5">
                <span className="pr-3">Verify your email address</span>
              </h4>
              <span>
                Please confirm that you want to use this as your HLE Ecommerce
                account email address.
                <br /> Once it's done you will be able to start buying!
              </span>
              <button
                className="btn btn-block btn-info font-weight-bold py-3 mt-5"
                onClick={() => {
                  onRequestCodeHandler();
                  setIsSend(true);
                  onClickReset();
                }}
              >
                Verify my email
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
