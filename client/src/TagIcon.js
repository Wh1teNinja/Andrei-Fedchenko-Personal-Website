import { ReactSVG } from "react-svg";

function TagIcon({ tag, tagFullIcon = false }) {
  return (
    <div className={"wrapper tag-icon-wrapper " + (tagFullIcon ? "h-fit-content" : "")}>
      {tag.image.endsWith(".svg") ? (
        <ReactSVG
          src={
            "http://localhost:" +
            (process.env.PORT || 4200) +
            "/api/image/" +
            tag.image
          }
          beforeInjection={(svg) => {
            svg.classList.add(tagFullIcon ? "tag-img" : "tag-icon");
          }}
        />
      ) : (
        <img
          src={
            "http://localhost:" +
            (process.env.PORT || 4200) +
            "/api/image/" +
            tag.image
          }
          className={tagFullIcon ? "tag-img" : "tag-icon"}
          alt={tag.name + " icon"}
          width='32'
        />
      )}
    </div>
  );
}

export default TagIcon;
