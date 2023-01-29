export default function Stars({ stars }) {
  return (
    <div className="text-primary mr-2">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <i
            key={index}
            className={`${index <= stars ? "fas" : "far"} fa-star`}
          ></i>
        );
      })}
    </div>
  );
}
