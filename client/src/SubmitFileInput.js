import { ReactComponent as Upload } from "./images/icons/Upload.svg";
import "./SubmitFileInput.css";
import { useRef, useEffect, useState } from "react";

function SubmitFileInput({
  id,
  allowedExtensions = [],
  file,
  setFile,
  displayName = true,
  style = {},
  setError = () => {},
}) {
  const [dropOver, setDropOver] = useState(false);
  const [fileName, setFileName] = useState(null);

  const inputRef = useRef(null);
  const dropArea = useRef(null);

  const dropHandlerEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDropOver(true);
  };

  const dropHandlerLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDropOver(false);
  };

  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const dt = e.dataTransfer;
    if (dt && dt.files) {
      inputRef.current.files = dt.files;
      fileUploadHandler();
    }
  };

  const fileUploadHandler = () => {
    if (inputRef.current.files.length === 0) return;

    if (inputRef.current.files.length === 1) {
      const fileExt = inputRef.current.files[0].type;
      if (allowedExtensions.length === 0 || allowedExtensions.includes(fileExt)) {
        setFileName(inputRef.current.files[0].name);
        setError([]);
      } else {
        inputRef.current.value = "";
        setError([`Files of type ${fileExt} are not allowed.`]);
      }
    } else {
      inputRef.current.value = "";
      setError(["Only 1 file is allowed for submission."]);
    }

    setFile(inputRef.current.files[0]);
  };

  useEffect(() => {
    if (dropArea.current !== null) {
      dropArea.current.addEventListener("dragenter", dropHandlerEnter, false);
      dropArea.current.addEventListener("dragover", dropHandlerEnter, false);
      dropArea.current.addEventListener("dragleave", dropHandlerLeave, false);
      dropArea.current.addEventListener("drop", dropHandler, false);
    }
  }, [dropArea]);

  return (
    <div className='upload-file-input' style={style}>
      <label
        ref={dropArea}
        className='upload-file-button'
        htmlFor={"image-input-" + id}
      >
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            style={{ opacity: 1 }}
            alt='upload icon'
            className="uploaded-image"
          ></img>
        ) : (
          <Upload className={"upload-icon " + (dropOver ? "dropping-file" : "")} />
        )}
        {(() =>
          displayName ? (
            <span className='upload-label'>{fileName || "Upload file"}</span>
          ) : (
            <></>
          ))()}
        <input
          onChange={fileUploadHandler}
          ref={inputRef}
          id={"image-input-" + id}
          className='image-input'
          type='file'
        />
      </label>
    </div>
  );
}

export default SubmitFileInput;
