const { Photon } = require("@generated/photon");
const photon = new Photon();
const jwt = require("jsonwebtoken");
const { ApolloServer, gql, AuthenticationError } = require("apollo-server-express")

const HAXCMS_OAUTH_JWT_SECRET = process.env.HAXCMS_OAUTH_JWT_SECRET;
const NETWORK = process.env.NETWORK;
const HOST = process.env.HOST;
const ADMINS = process.env.ADMINS || "heyMP";

module.exports = async ({ app }) => {
  await photon.connect();
  const apolloServer = new ApolloServer({
    typeDefs: gql`
    type Submission {
      id: String
      createdAt: String
      updatedAt: String
      form: Form
      values: String
    }

    type Form {
      id: String
      createdAt: String
      updatedAt: String
      reference: String
    }

    type BatchDeleteResponse {
      count: Int
    }

    type Query {
      submissions: [Submission]
    }
  `,
    resolvers: {
      Query: {
        submissions: async (parent, args, ctx) => {
          // if (!isAdmin({ user: ctx.user.name })) {
          //   throw new AuthenticationError(`Permission Denied`)
          // }
          return await photon.submissions.findMany({ include: { form: true }})
        }
      }
    },
    context: async ({ req }) => ({
      user: await getUserFromAuthHeader(req)
    })
  });

  const getUserFromAuthHeader = async req => {
    try {
      if (typeof req.headers.authorization !== "undefined") {
        const access_token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(access_token, HAXCMS_OAUTH_JWT_SECRET);
        return user;
      }
    } catch (error) {
      throw new AuthenticationError(error);
      return null;
    }
  };

  apolloServer.applyMiddleware({ app });
}