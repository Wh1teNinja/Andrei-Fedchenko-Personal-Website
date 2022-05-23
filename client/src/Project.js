import "./Project.css";

import { useState, useRef } from "react";
import TagIcon from "./TagIcon";

import { ReactComponent as Cross } from "./images/icons/Cross.svg";
import { ReactComponent as ArrowLeft } from "./images/icons/Arrow-left.svg";
import { ReactComponent as ArrowRight } from "./images/icons/Arrow-right.svg";

function Project({ data, closePopUp, apiUrl }) {
  const popUpWrapper = useRef(null);

  const hidePopUpHandler = (e) => {
    if (e.target === popUpWrapper.current) closePopUp();
  };

  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () => {
    setImageIndex((i) => Math.min(i + 1, data.images.length - 1));
  };

  const prevImage = () => {
    setImageIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div
      onClick={hidePopUpHandler}
      ref={popUpWrapper}
      className='project-pop-up pop-up'
    >
      <div className='project-wrapper'>
        <div className='project-header'>
          <h4>{data.title}</h4>
          <button onClick={closePopUp}>
            <Cross />
          </button>
        </div>
        <div className='project-images-slider'>
          <img
            className='project-image'
            src={apiUrl + "/api/image/" + data.images[imageIndex]}
            alt={"project screenshot " + 1}
          />
          <div className='project-images-slider-buttons'>
            <button
              onClick={prevImage}
              className='project-slider-button slider-button-left'
            >
              <ArrowLeft />
            </button>
            <button
              onClick={nextImage}
              className='project-slider-button slider-button-right'
            >
              <ArrowRight />
            </button>
          </div>
          <ul className='slider-dots'>
            {data.images.map((image, i) => (
              <li
                key={i}
                className={'slider-dot ' + (imageIndex === i ? "active-slider-dot" : "inactive-slider-dot")}
                onClick={() => setImageIndex(i)}
              ></li>
            ))}
          </ul>
        </div>
        <span
          className={
            "project-data-line " +
            (data.githubUrl ? "" : "project-data-line-no-data")
          }
        >
          <label>Github: </label>
          <a href={data.githubUrl}>{data.githubUrl}</a>
        </span>
        <span
          className={
            "project-data-line " + (data.projectUrl ? "" : "project-data-line-no-data")
          }
        >
          <label>Url: </label> <a href={data.projectUrl}>{data.projectUrl}</a>
        </span>
        <div className='project-data-line project-description'>
          <label>Description: </label>
          <p>{data.description}</p>
        </div>
        <ul className='project-tags'>
          {data.tags.map((tag) => (
            <li key={tag.id}>
              <TagIcon tag={tag} apiUrl={apiUrl}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Project;
