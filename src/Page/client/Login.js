import React from "react";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5 d-flex justify-content-center">
          <div className="col-lg-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
