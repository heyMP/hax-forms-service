const jwt = require("jsonwebtoken");
const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-express");
const { PubSub } = require('apollo-server');

const HAXCMS_OAUTH_JWT_SECRET = process.env.HAXCMS_OAUTH_JWT_SECRET;

const pubsub = new PubSub();
const FORM_SUBMITTED = "FORM_SUBMITTED";

module.exports.pubsub = pubsub;
module.exports.FORM_SUBMITTED = FORM_SUBMITTED;

module.exports = async ({ app }) => {
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
        submissions: [Submission]
      }

      type BatchDeleteResponse {
        count: Int
      }

      type Query {
        submissions: [Submission]
        forms: [Form]
      }

      type Subscription {
        formSubmitted: String
      }
    `,
    resolvers: {
      Query: {
        submissions: async (parent, args, ctx) => {
          // if (!isAdmin({ user: ctx.user.name })) {
          //   throw new AuthenticationError(`Permission Denied`)
          // }
          // return await photon.submissions.findMany({ include: { form: true } });
        },
        forms: async (parent, args, ctx) => {
          // if (!isAdmin({ user: ctx.user.name })) {
          //   throw new AuthenticationError(`Permission Denied`)
          // }
          // return await photon.forms.findMany({
          //   include: { submissions: true }
          // });
        }
      },
      Subscription: {
        formSubmitted: {
          subscribe: () => pubsub.asyncIterator([FORM_SUBMITTED])
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
};
