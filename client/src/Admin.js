import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import TrashCan from "./images/icons/Trash-can.svg";
import { ReactComponent as Github } from "./images/icons/github.svg";
import { ReactComponent as Url } from "./images/icons/url.svg";

import { getTags, getProjects, deleteTag } from "./queries/queries";
import AddTag from "./AddTag";
import AddProject from "./AddProject";
import TagIcon from "./TagIcon";
import UpdateProject from "./UpdateProject";
import Loading from "./Loading";

/* const testData = {
  projects: [
    {
      __typename: "Project",
      id: "626d2b82a5842c5ccfbbbcc3",
      title: "My website",
      description: "Recursion, hooray!",
      tagsIds: ["6268e8275774433b19fef756"],
      videoUrl: null,
      githubUrl: null,
      projectUrl: null,
      images: ["d5b34f12adb36a9f8637fbd92187ddc2.jpg"],
      tags: [
        {
          __typename: "Tag",
          id: "6268e8275774433b19fef756",
          name: "Express.js",
          type: "framework",
          image: "1e14baf696bcb7408403d2af13455192.png",
        },
      ],
    },
  ],
  tags: [
    {
      __typename: "Tag",
      id: "6268e8275774433b19fef756",
      name: "Express.js",
      type: "framework",
      image: "1e14baf696bcb7408403d2af13455192.png",
    },
    {
      __typename: "Tag",
      id: "6268e9b05774433b19fef75b",
      name: "React",
      type: "framework",
      image: "a6e958e1345b9c5081dbbce4019a4bd2.png",
    },
    {
      __typename: "Tag",
      id: "6268f0f35774433b19fef761",
      name: "Node.js",
      type: "framework",
      image: "b2c98eb50b2384b9d540878a017789b3.svg",
    },
  ],
}; */

function renderTags(tags, handleTagDelete) {
  return tags.map((tag, index) => (
    <div key={index} className='card tag-card'>
      <TagIcon tag={tag} tagFullIcon={true} />
      <span className='tag-card-label'>{tag.name}</span>
      <div className='tag-card-buttons'>
        <button
          className='tag-card-button'
          onClick={(e) => handleTagDelete(e, tag.id)}
        >
          <img src={TrashCan} alt='delete tag icon' />
        </button>
      </div>
    </div>
  ));
}

function renderProjects(projects, setEditedProject) {
  return projects.map((project) => {
    return (
      <li
        key={project.id}
        className='project-card card'
        onClick={() => setEditedProject(project)}
      >
        <div className='project-card-background'></div>
        <div className='project-card-special-tags'>
          <Url style={project.projectUrl ? {} : { opacity: 0.1 }} />
          <Github style={project.githubUrl ? {} : { opacity: 0.1 }} />
        </div>
        <div className='project-card-image'>
          <img
            src={
              project.images
                ? "http://localhost:4200/api/image/" + project.images[0]
                : ""
            }
            alt='project screenshot'
          />
        </div>
        <div className='project-card-header'>
          <span className='project-card-title'>{project.title}</span>
        </div>
        <ul className='project-card-tags-list'>
          {project.tags.map((tag) => (
            <li key={tag.id}>
              <TagIcon tag={tag} />
            </li>
          ))}
        </ul>
      </li>
    );
  });
}

function Admin() {
  const [error, setError] = useState([]);
  const [errorTimeout, setErrorTimeout] = useState(0);
  const errorMessage = useRef(null);

  useEffect(() => {
    if (error.length === 0) return;

    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }

    setErrorTimeout(
      setTimeout(() => {
        setError([]);
        setErrorTimeout(0);
      }, 10 * 1000)
    );
  }, [error]);

  const {
    loading: loadingTags,
    data: tagsData,
    refetch: refetchTags,
  } = useQuery(getTags);

  const tags = loadingTags || !tagsData ? [] : tagsData.getTags;

  const [removeTag] = useMutation(deleteTag);

  const handleTagDelete = (e, id) => {
    e.preventDefault();

    removeTag({
      variables: {
        id,
      },
    })
      .then(() => {
        refetchTags();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const {
    loading: loadingProjects,
    data: projectsData,
    refetch: refetchProjects,
  } = useQuery(getProjects);

  const projects =
    loadingProjects || !projectsData ? [] : projectsData.getProjects;

  const [editedProject, setEditedProject] = useState(null);

  return (
    <main className='main-page-wrapper'>
      <div className='row align-flex-start'>
        <div className='column col-2-3 admin-panel-column'>
          <h2>Projects</h2>
          <div
            className='card wrapper scroll-500'
            style={loadingTags || !projects ? { padding: 0 } : {}}
          >
          <ul className="projects-list-editor">
            {loadingProjects || !projects ? (
              <Loading />
            ) : (
              <>
                {renderProjects(projects, setEditedProject)}
                <AddProject setError={setError} refetchProjects={refetchProjects} />
              </>
            )}
            </ul>
          </div>
        </div>
        <div className='column col-1-3 admin-panel-column'>
          <h2>Tags</h2>
          <div
            className='card wrapper scroll-500 tags-list-editor'
            style={loadingTags || !tags ? { padding: 0 } : {}}
          >
            {loadingTags || !tags ? (
              <Loading />
            ) : (
              <>
                {renderTags(tags, handleTagDelete)}
                <AddTag
                  setError={setError}
                  error={error}
                  refetchTags={refetchTags}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {error.map((errorMsg) => (
        <div key={errorMsg} ref={errorMessage} className='upload-file-error-wrapper'>
          <span className='upload-file-error-text'>{errorMsg}</span>
        </div>
      ))}
      {editedProject ? (
        <UpdateProject
          hidePopUp={() => setEditedProject(null)}
          initProjectData={editedProject}
          refetchProjects={refetchProjects}
        />
      ) : (
        <></>
      )}
    </main>
  );
}

export default Admin;
