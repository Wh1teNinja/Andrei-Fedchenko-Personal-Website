import { gql } from "@apollo/client";

const getTag = gql`
  query ($tagId: String!) {
    getTag(tagId: $tagId) {
      id
      name
      type
      image
    }
  }
`;

const getTags = gql`
  {
    getTags {
      id
      name
      type
      image
    }
  }
`;

const addTag = gql`
  mutation ($name: String!, $type: String!, $image: String!) {
    addTag(name: $name, type: $type, image: $image) {
      id
      name
      type
      image
    }
  }
`;

const deleteTag = gql`
  mutation ($id: ID!) {
    deleteTag(id: $id) {
      name
    }
  }
`;

const getProjects = gql`
  {
    getProjects {
      id
      title
      description
      tagsIds
      videoUrl
      githubUrl
      projectUrl
      images
      tags {
        id
        name
        type
        image
      }
    }
  }
`;

const addProject = gql`
  mutation (
    $title: String!
    $description: String
    $tagsIds: [ID]
    $videoUrl: String
    $githubUrl: String
    $projectUrl: String
    $images: [String]
  ) {
    addProject(
      title: $title
      description: $description
      tagsIds: $tagsIds
      videoUrl: $videoUrl
      githubUrl: $githubUrl
      projectUrl: $projectUrl
      images: $images
    ) {
      id
    }
  }
`;

const updateProject = gql`
  mutation (
    $id: ID!
    $title: String
    $description: String
    $tagsIds: [ID]
    $videoUrl: String
    $githubUrl: String
    $projectUrl: String
    $images: [String]
  ) {
    updateProject(
      id: $id
      title: $title
      description: $description
      tagsIds: $tagsIds
      videoUrl: $videoUrl
      githubUrl: $githubUrl
      projectUrl: $projectUrl
      images: $images
    ) {
      id
    }
  }
`;

const deleteProject = gql`
  mutation ($id: ID!) {
    deleteProject(id: $id) {
      title
    }
  }
`;

export {
  getTag,
  getTags,
  addTag,
  deleteTag,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};
