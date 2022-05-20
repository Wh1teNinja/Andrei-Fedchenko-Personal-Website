const graphql = require("graphql");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const Project = require("../models/Project");
const Tag = require("../models/Tag");
const User = require("../models/User");

require("dotenv").config();

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    image: { type: GraphQLString },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    tagsIds: { type: new GraphQLList(GraphQLID) },
    videoUrl: { type: GraphQLString },
    githubUrl: { type: GraphQLString },
    projectUrl: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    tags: {
      type: new GraphQLList(TagType),
      resolve(obj) {
        return Tag.find({
          _id: {
            $in: obj.tagsIds,
          },
        }) || [];
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getProject: {
      type: ProjectType,
      args: { projectId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_parent, args) {
        return Project.findOne({ id: args.projectId });
      },
    },
    getProjects: {
      type: new GraphQLList(ProjectType),
      resolve(_parent, args) {
        return Project.find({});
      },
    },
    getTag: {
      type: TagType,
      args: { tagId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_parent, args) {
        return Tag.findOne({ id: args.tagId });
      },
    },
    getTags: {
      type: new GraphQLList(TagType),
      resolve(_parent, args) {
        return Tag.find({});
      },
    },
  },
});

const Mutations = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    login: {
      type: GraphQLString,
      args: {
        login: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)}
      },
      async resolve(_parent, args) {
        const user = await User.findOne({login: args.login});

        if (!user) {
          throw new Error('User not found');
        }

        const valid = await bcrypt.compare(args.password, user.password);
      
        if (!valid) {
          throw new Error("Password incorrect");
        } 

        return jsonwebtoken.sign(
          { id: user.id },
          process.env.JWT_SECRET
        );
      }
    },
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        tagsIds: { type: new GraphQLList(GraphQLID) },
        videoUrl: { type: GraphQLString },
        githubUrl: { type: GraphQLString },
        projectUrl: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) },
      },
      resolve(_parent, args) {
        const project = new Project(
          {
            title: args.title,
            description: args.description,
            tagsIds: args.tagsIds || [],
            videoUrl: args.videoUrl,
            githubUrl: args.githubUrl,
            projectUrl: args.projectUrl,
            images: args.images || [],
          },
          "projects"
        );

        return project.save();
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        tagsIds: { type: new GraphQLList(GraphQLID) },
        videoUrl: { type: GraphQLString },
        githubUrl: { type: GraphQLString },
        projectUrl: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) },
      },
      resolve(_parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            title: args.title,
            description: args.description,
            tagsIds: args.tagsIds,
            videoUrl: args.videoUrl,
            githubUrl: args.githubUrl,
            projectUrl: args.projectUrl,
            images: args.images,
          },
          { new: true }
        );
      },
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_parent, args) {
        return Project.findByIdAndDelete(args.id);
      },
    },
    addTag: {
      type: TagType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_parent, args) {
        const tag = new Tag(
          {
            name: args.name,
            type: args.type,
            image: args.image,
          },
          "tags"
        );

        return tag.save();
      },
    },
    updateTag: {
      type: TagType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        image: { type: GraphQLString },
      },
      resolve(_parent, args) {
        return Tag.findByIdAndUpdate(args.id, {
          name: args.name,
          type: args.type,
          image: args.image,
        });
      },
    },
    deleteTag: {
      type: TagType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_parent, args) {
        return Tag.findByIdAndDelete(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
