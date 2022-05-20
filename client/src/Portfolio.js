import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";

import { ReactComponent as Plus } from "./images/icons/Plus.svg";
import { ReactComponent as Github } from "./images/icons/github.svg";
import { ReactComponent as Url } from "./images/icons/url.svg";
import { ReactComponent as Reset } from "./images/icons/reset.svg";

import TagIcon from "./TagIcon";
import Project from "./Project";

import { getTags, getProjects } from "./queries/queries";
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
      images: ["d5b34f12adb36a9f8637fbd92187ddc2.jpg","d5b34f12adb36a9f8637fbd92187ddc2.jpg"],
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

function renderProjects(projects, filters, setOpenProject, apiUrl) {
  let filteredProjects = projects.filter((project) => {
    let result =
      (filters.other.includes("Github") && project.githubUrl) ||
      (filters.other.includes("ProjectUrl") && project.projectUrl) ||
      project.tags.find((tag) => filters.tags.find((t) => t.id === tag.id));

    if (!filters.including) result = !result;

    return result;
  });

  return projects.map((project) => {
    let display = filteredProjects.includes(project);

    return (
      <li
        key={project.id}
        className='project-card card'
        style={display ? {} : { display: "none" }}
        onClick={() => setOpenProject(project)}
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
                ? apiUrl + "/api/image/" + project.images[0]
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
              <TagIcon tag={tag} apiUrl={apiUrl}/>
            </li>
          ))}
        </ul>
      </li>
    );
  });
}

function renderTags(tags, filters, switchTag, apiUrl) {
  return tags.map((tag) => (
    <li
      key={tag.id}
      onClick={() => switchTag(tag)}
      style={filters.tags.find((t) => t.id === tag.id) ? {} : { opacity: 0.5 }}
    >
      <TagIcon tag={tag} apiUrl={apiUrl} />
    </li>
  ));
}

function Portfolio({apiUrl}) {
  const { loading: loadingProjects, data: projectsData } = useQuery(getProjects);

  const projects =
    loadingProjects || !projectsData ? [] : projectsData.getProjects;

  const { loading: loadingTags, data: tagsData } = useQuery(getTags);

  const tags = loadingTags || !tagsData ? [] : tagsData.getTags;

  let [openFilters, setOpenFilters] = useState(null);

  let [filters, setFilters] = useState({
    tags: [],
    other: ["Github", "ProjectUrl"],
    including: true,
  });

  let resetFilters = useCallback(() => {
    setFilters({
      tags: tagsData?.getTags || [],
      other: ["Github", "ProjectUrl"],
      including: true,
    });
  }, [tagsData?.getTags]);

  let switchFilterInclusion = () => {
    setFilters((filters) => {
      let newTags = tags.filter((tag) => !filters.tags.find((t) => t.id === tag.id));
      let other = ["Github", "ProjectUrl"].filter(
        (filter) => !filters.other.includes(filter)
      );

      return {
        tags: newTags,
        other: other,
        including: !filters.including,
      };
    });
  };

  let switchTag = (tag) => {
    setFilters((filters) => {
      let newTags;
      if (filters.tags.find((t) => t.id === tag.id)) {
        newTags = filters.tags.filter((t) => t.id !== tag.id);
      } else {
        newTags = filters.tags.concat(tag);
      }

      return {
        tags: newTags,
        other: filters.other,
        including: filters.including,
      };
    });
  };

  let switchOtherFilters = (filter) => {
    setFilters((filters) => {
      let other;
      if (filters.other.includes(filter)) {
        other = filters.other.filter((f) => f !== filter);
      } else {
        other = filters.other.concat(filter);
      }

      return {
        tags: filters.tags,
        other: other,
        including: filters.including,
      };
    });
  };

  useEffect(() => {
    setFilters((filters) => ({
      tags: tagsData?.getTags || [],
      other: filters.other,
      including: filters.including,
    }));
  }, [tagsData?.getTags]);

  const [openProject, setOpenProject] = useState(null);

  return (
    <main className='main-page-wrapper'>
      <h1 className='portfolio-title'>
        <span className='color-down'>My Portfolio</span>
        <span>PROJECTS</span>
      </h1>
      <div className='portfolio'>
        <div className={"portfolio-filters-area "}>
          <div
            className={
              "filters " +
              (openFilters === null
                ? ""
                : openFilters
                ? "open-filters"
                : "close-filters")
            }
          >
            <h4 className='filters-label'>Filters:</h4>
            <div className='tags-list'>
              {renderTags(tags, filters, switchTag, apiUrl)}
            </div>
            <div className='special-tags-list tags-list'>
              <li
                onClick={() => switchOtherFilters("Github")}
                style={filters.other.includes("Github") ? {} : { opacity: 0.5 }}
              >
                <Github className='tag-icon' />
              </li>
              <li
                onClick={() => switchOtherFilters("ProjectUrl")}
                style={filters.other.includes("ProjectUrl") ? {} : { opacity: 0.5 }}
              >
                <Url className='tag-icon' />
              </li>
            </div>
            <div className='filter-options'>
              <button
                htmlFor='include-filters'
                className='filter-option-button'
                onClick={switchFilterInclusion}
              >
                <Plus
                  className={
                    "filter-button-icon " +
                    (filters.including
                      ? "include-filters-checkbox-includes"
                      : "include-filters-checkbox-excludes")
                  }
                />
                <span className='filter-button-text'>
                  {filters.including ? "Includes" : "Excludes"}
                </span>
              </button>

              <button onClick={resetFilters} className='filter-option-button'>
                <Reset className={"filter-button-icon"} />
                <span className='filter-button-text'>Reset</span>
              </button>
            </div>
          </div>
        </div>
        <div className='portfolio-projects'>
          <button
            onClick={() => setOpenFilters(!openFilters)}
            className='open-filters-button'
          >
            Filters
          </button>
          {projects.length ? renderProjects(projects, filters, setOpenProject, apiUrl) : <Loading/>}
        </div>
      </div>
      {openProject ? <Project data={openProject} closePopUp={() => setOpenProject(null)} apiUrl={apiUrl}/> : <></>}
    </main>
  );
}

export default Portfolio;
