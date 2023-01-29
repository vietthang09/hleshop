import RegisterForm from "./components/RegisterForm";

export default function Register() {
  return(
    <>
      <div className="container-fluid">
        <div className="row px-xl-5 d-flex justify-content-center">
          <div className="col-lg-6">
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
}
