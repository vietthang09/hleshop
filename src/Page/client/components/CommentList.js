import product1 from "../../../img/product1.jpg";
import { formatdate } from "../../../util/helper";
export default function CommentList(props) {
  return props.comments.map((val, index) => (
    <div className="media mb-4" key={index}>
      <img
        src={product1}
        alt="Image"
        className="img-fluid mr-3 mt-1"
        style={{ width: "45px" }}
      />
      <div className="media-body">
        <h6>
          {val.user_fullname}
          <small>
            {" "}
            - <i>{formatdate(val.created_at)}</i>
          </small>
        </h6>
        <div className="text-primary mb-2">
          {[...Array(5)].map((star, innerIndex) => {
            index += 1;
            return (
              <i
                key={innerIndex}
                className={`${
                  innerIndex < val.comment_star ? "fas" : "far"
                } fa-star`}
              ></i>
            );
          })}
        </div>
        <p>{val.comment_content}</p>
      </div>
    </div>
  ));
}
