import { useReducer, useRef, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { getTags, updateProject, deleteProject } from "./queries/queries";

import "./UpdateProject.css";

import TrashCan from "./images/icons/Trash-can.svg";
import { ReactComponent as ArrowLeft } from "./images/icons/Arrow-left.svg";
import { ReactComponent as ArrowRight } from "./images/icons/Arrow-right.svg";

import TagIcon from "./TagIcon";
import Loading from "./Loading";

import SubmitFileInput from "./SubmitFileInput";

function UpdateProject({ setError, initProjectData, hidePopUp, refetchProjects, apiUrl }) {
  const { loading, data: allTagsData } = useQuery(getTags);

  const allTags = loading || !allTagsData ? [] : allTagsData.getTags;

  const [title, titleUpdater] = useReducer((state, action) => {
    return action.value || action.target.value;
  }, initProjectData.title);
  const [description, descriptionUpdater] = useReducer((state, action) => {
    return action.value || action.target.value;
  }, initProjectData.description || "");
  const [videoUrl, videoUrlUpdater] = useReducer((state, action) => {
    return action.value || action.target.value;
  }, initProjectData.videoUrl || "");
  const [githubUrl, githubUrlUpdater] = useReducer((state, action) => {
    return action.value || action.target.value;
  }, initProjectData.githubUrl || "");
  const [projectUrl, projectUrlUpdater] = useReducer((state, action) => {
    return action.value || action.target.value;
  }, initProjectData.projectUrl || "");
  const [tags, tagsUpdater] = useReducer((state, action) => {
    switch (action.type) {
      case "push":
        return state.concat(action.value);
      case "remove":
        return state.slice(0, action.pos).concat(state.slice(action.pos + 1));
      default:
        return state;
    }
  }, initProjectData.tagsIds);
  const [images, imagesUpdater] = useReducer((state, action) => {
    switch (action.type) {
      case "push":
        return state.concat(action.value);
      case "replace":
        return state
          .slice(0, action.pos)
          .concat(action.value)
          .concat(state.slice(action.pos + 1));
      case "move":
        const movedImage = state[action.from];

        let newImages = state
          .slice(0, action.from)
          .concat(state.slice(action.from + 1));

        return newImages
          .slice(0, action.to)
          .concat(movedImage)
          .concat(newImages.slice(action.to));
      case "remove":
        return state.slice(0, action.pos).concat(state.slice(action.pos + 1));
      default:
        return state;
    }
  }, initProjectData.images || []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageOnClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleCurrentImageOnScroll = (e) => {
    setCurrentImageIndex(Math.floor(projectImagesList.current.scrollLeft / 220));
  };

  const projectImagesList = useRef(null);

  const handleScrollOnWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImageIndex((i) => {
      projectImagesList.current.scrollLeft = (i + Math.sign(e.deltaY)) * 220;
      return i;
    });
  };

  const handleSlider = (e, offset) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImageIndex((i) => {
      projectImagesList.current.scrollLeft = (i + offset) * 220;
      return i;
    });
  };

  useEffect(() => {
    if (projectImagesList.current) {
      projectImagesList.current.addEventListener("wheel", handleScrollOnWheel, {
        passive: false,
      });
    }
  }, [projectImagesList.current]);

  const handleOnClickTag = (e, tag) => {
    e.preventDefault();

    if (tags.includes(tag.id)) {
      tagsUpdater({ type: "remove", pos: tags.findIndex((id) => id === tag.id) });
    } else {
      tagsUpdater({ type: "push", value: tag.id });
    }
  };

  const [removeProject] = useMutation(deleteProject);

  const handleDelete = (e) => {
    e.preventDefault();
    
    removeProject({
      context: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        },
      },
      variables: {
        id: initProjectData.id,
      },
    }).then((res) => {
      hidePopUp();
      refetchProjects();
    }).catch((err) => {
      console.log(err);
    });
  };

  const [editProject] = useMutation(updateProject);

  const handleUpdate = (e) => {
    e.preventDefault();

    const uploadImages = images.map((image) => {
      if (typeof image === "object") {
        let formData = new FormData();

        formData.append("image", image);

        return fetch(
          apiUrl + "/api/image",
          {
            method: "POST",
            mode: "cors",
            body: formData,
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.image.filename) {
              return res.image.filename;
            }
          })
          .catch((err) => {
            setError(
              "We couldn't upload some of the images, please try again later."
            );
            console.log(err);
            return image;
          });
      } else return image;
    });

    Promise.all(uploadImages).then((newImages) => {
      editProject({
        context: {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          },
        },
        variables: {
          id: initProjectData.id,
          title,
          description,
          videoUrl,
          githubUrl,
          projectUrl,
          tagsIds: tags,
          images: newImages,
        },
      })
        .then((res) => {
          hidePopUp();
          refetchProjects();
        })
        .catch((err) => console.log(err));
    });
  };

  const popUpWrapper = useRef(null);

  const hidePopUpHandler = (e) => {
    if (e.target === popUpWrapper.current) hidePopUp();
  };

  const handleDragEnd = (result) => {
    if (result.destination) {
      imagesUpdater({
        type: "move",
        from: result.source.index,
        to: result.destination.index,
      });
    }
  };

  return (
    <div
      onClick={hidePopUpHandler}
      ref={popUpWrapper}
      className='update-project-pop-up pop-up'
    >
      <form className='update-project-form'>
        <input
          className='update-project-title-input'
          placeholder='Title'
          type='text'
          value={title}
          onChange={titleUpdater}
        />
        <div className='update-project-images'>
          <div className='slider-buttons'>
            <button
              onClick={(e) => handleSlider(e, -1)}
              className='slider-button slider-button-left'
            >
              <ArrowLeft />
            </button>
            <button
              onClick={(e) => handleSlider(e, 1)}
              className='slider-button slider-button-right'
            >
              <ArrowRight />
            </button>
          </div>
          <div
            className='images-list-editor'
            ref={projectImagesList}
            onScroll={handleCurrentImageOnScroll}
          >
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId='images-list' direction='horizontal'>
                {(provided) => (
                  <ul
                    className='images-list'
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {images.map((image, index) => {
                      let imageId;
                      if (image) {
                        imageId =
                          typeof image === "object" ? image.lastModified : image;
                      } else {
                        imageId = "empty-image";
                      }
                      return (
                        <Draggable
                          key={imageId}
                          draggableId={"" + imageId}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              onClick={() => handleImageOnClick(index)}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={
                                "images-list-project-image-card card " +
                                (index === currentImageIndex
                                  ? "images-list-project-image-card-highlighted"
                                  : "")
                              }
                            >
                              <img
                                className='images-list-project-image'
                                src={
                                  typeof image === "object"
                                    ? URL.createObjectURL(image)
                                    : apiUrl +
                                      "/api/image/" +
                                      image
                                }
                                alt={"project screenshot " + index}
                              />
                              <button
                                className='image-card-delete-button'
                                onClick={() =>
                                  imagesUpdater({
                                    type: "remove",
                                    pos: index,
                                  })
                                }
                              >
                                <img
                                  className='delete-button-icon'
                                  alt='delete icon'
                                  src={TrashCan}
                                />
                              </button>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            <div
              className={
                "images-list-project-image-card card add-project-screenshot-card " +
                (currentImageIndex === images.length
                  ? "images-list-project-image-card-highlighted"
                  : "")
              }
            >
              <SubmitFileInput
                setError={setError}
                setFile={(value) =>
                  imagesUpdater({
                    type: "push",
                    value,
                  })
                }
                id={1}
                allowedExtensions={[
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "image/svg+xml",
                ]}
                displayName={false}
              />
            </div>
          </div>
          <img
            className='images-list-project-image'
            src={
              typeof images[Math.min(currentImageIndex, images.length - 1)] ===
              "object"
                ? URL.createObjectURL(
                    images[Math.min(currentImageIndex, images.length - 1)]
                  )
                : apiUrl +
                  "/api/image/" +
                  images[Math.min(currentImageIndex, images.length - 1)]
            }
            alt={
              "project screenshot " + Math.min(currentImageIndex, images.length - 1)
            }
          />
        </div>
        <input
          className='update-project-video-url-input'
          type='text'
          placeholder='Youtube video url'
          value={videoUrl}
          onChange={videoUrlUpdater}
        />
        <input
          className='update-project-github-url-input'
          type='text'
          placeholder='Github url'
          value={githubUrl}
          onChange={githubUrlUpdater}
        />
        <input
          className='update-project-url-input'
          type='text'
          placeholder='Project url'
          value={projectUrl}
          onChange={projectUrlUpdater}
        />
        <textarea
          className='update-project-description-input'
          maxLength={400}
          placeholder='Description'
          type='text'
          value={description}
          onChange={descriptionUpdater}
        />
        <div className='update-project-tags-picker'>
          {loading || !allTagsData ? (
            <Loading />
          ) : (
            allTags.map((tag) => {
              const chosenTag = tags.includes(tag.id);

              return (
                <button
                  onClick={(e) => handleOnClickTag(e, tag)}
                  className={
                    chosenTag
                      ? "update-project-tag-picker"
                      : "update-project-tag-picker tag-picker-off"
                  }
                >
                  <TagIcon tag={tag} tagFullIcon={true} apiUrl={apiUrl}/>
                </button>
              );
            })
          )}
        </div>
        <div className='update-project-buttons'>
          <button
            className='update-project-button update-project-delete-button'
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className='update-project-button update-project-update-button'
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            className='update-project-button update-project-cancel-button'
            onClick={(e) => {
              e.preventDefault();
              hidePopUp();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProject;
