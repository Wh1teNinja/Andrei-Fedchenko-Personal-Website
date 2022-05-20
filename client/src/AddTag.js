import SubmitFileInput from "./SubmitFileInput";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";

import { ReactComponent as Plus } from "./images/icons/Plus.svg";

import { addTag } from "./queries/queries";

function AddTag({ setError, error, refetchTags, apiUrl }) {
  const [addingTag, setAddingTag] = useState(false);
  const [tagImage, setTagImage] = useState(null);
  const [tagName, setTagName] = useState("");
  const tagNameInput = useRef(null);

  const [postTag] = useMutation(addTag);

  const uploadTag = () => {
    const formData = new FormData();

    formData.append("image", tagImage);

    fetch(apiUrl + "/api/image", {
      method: "POST",
      mode: "cors",
      body: formData,
      headers: {
        'Authorization': "Bearer " + localStorage.getItem("jwtToken") 
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.image.filename) {
          postTag({
            context: {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("jwtToken"),
              },
            },
            variables: {
              name: tagName,
              type: "framework",
              image: res.image.filename,
            },
          })
            .then((res) => {
              setTagImage(null);
              setTagName("");
              setAddingTag(false);
              refetchTags();
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setError(["Something went wrong, try again later"]);
        console.log(err);
      });
  };

  const handleAddNewTag = () => {
    setAddingTag(true);
  };

  const onChangeTagName = (e) => {
    setTagName(e.target.value);
  };

  useEffect(() => {
    if (tagNameInput.current) tagNameInput.current.focus();
  }, [tagImage]);

  return addingTag ? (
    <div className='card tag-card tag-card-editor'>
      <SubmitFileInput
        error={error}
        setError={setError}
        file={tagImage}
        setFile={setTagImage}
        id={0}
        allowedExtensions={[
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/svg+xml",
        ]}
        displayName={false}
      />
      {tagImage ? (
        <input
          type='text'
          ref={tagNameInput}
          value={tagName}
          onChange={onChangeTagName}
          placeholder='Tag name'
          className='tag-name-input'
        />
      ) : (
        <span className='tag-card-label'>
          {tagImage ? tagImage.name : "Upload icon"}
        </span>
      )}
      <button className='upload-tag-button' onClick={uploadTag}>
        Upload
      </button>
    </div>
  ) : (
    <div className='card tag-card tag-card-editor'>
      <button onClick={handleAddNewTag} className='add-new-tag-button'>
        <Plus />
      </button>
    </div>
  );
}

export default AddTag;
