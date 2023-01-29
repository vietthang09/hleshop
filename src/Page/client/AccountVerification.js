import { useLocation } from "react-router";
import AccountVerificationForm from "./components/AccountVerificationForm";

export default function AccountVerification() {
  const location = useLocation();
  return (
    <div className="container-fluid">
      <div className="row px-xl-5 d-flex justify-content-center">
        <div className="col-lg-6">
          <AccountVerificationForm user_email={location.state.user_email} />
        </div>
      </div>
    </div>
  );
}
