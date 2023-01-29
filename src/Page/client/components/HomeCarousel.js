import slide1 from "../../../img/banner.png";
import slide2 from "../../../img/banner1.png";
import slide3 from "../../../img/banner2.png";
import offer1 from "../../../img/banner3.png";
import offer2 from "../../../img/banner4.png";

export default function HomeCarousel() {
  return (
    <div className="row px-xl-5">
      <div className="col-lg-8">
        <div
          id="header-carousel"
          className="carousel slide carousel-fade mb-30 mb-lg-0"
          data-ride="carousel"
        >
          <ol className="carousel-indicators">
            <li
              data-target="#header-carousel"
              data-slide-to="0"
              className="active"
            ></li>
            <li data-target="#header-carousel" data-slide-to="1"></li>
            <li data-target="#header-carousel" data-slide-to="2"></li>
          </ol>
          <div className="carousel-inner">
            <div
              className="carousel-item position-relative active"
              style={{ height: "430px" }}
            >
              <img
                className="position-absolute w-100 h-100"
                src={slide1}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              className="carousel-item position-relative"
              style={{ height: "430px" }}
            >
              <img
                className="position-absolute w-100 h-100"
                src={slide2}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              className="carousel-item position-relative"
              style={{ height: "430px" }}
            >
              <img
                className="position-absolute w-100 h-100"
                src={slide3}
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="product-offer mb-30" style={{ height: "200px" }}>
          <img className="img-fluid" src={offer1} alt="" />
        </div>
        <div className="product-offer mb-30" style={{ height: "200px" }}>
          <img className="img-fluid" src={offer2} alt="" />
        </div>
      </div>
    </div>
  );
}
