import { useMutation } from "@apollo/client";
import "../styles/AddProject.css";

import {ReactComponent as Plus } from "../images/icons/Plus.svg";

import { addProject } from "../queries/queries";

function AddProject({ setError, refetchProjects }) {
  const [postProject] = useMutation(addProject);

  const handleAddNewProject = (e) => {
    e.preventDefault();

    postProject({
      variables: {
        title: "New Project",
      },
    })
      .then((res) => {
        refetchProjects();
      })
      .catch((err) => {
        console.log(err);
        setError(["Something went wrong, try again later."]);
      });
  };

  return (
    <li className='project-card add-project-card card'>
      <button onClick={handleAddNewProject} className='add-new-project-button'>
        <Plus />
      </button>
    </li>
  );
}

export default AddProject;
