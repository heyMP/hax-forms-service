//@ts-check
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const corsOrigin = process.env.CORS_ORIGIN || "*";
const apolloServer = require("./apolloServer");
const { pubsub, FORM_SUBMITTED } = require("./apolloServer.js");

async function main() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.text());
  app.use(bodyParser.json());

  /**
   * Allow calls from web components with cookies
   */
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", corsOrigin);
    next();
  });

  app.post("/", async (req, res) => {
    try {
      const { id, values } = req.body;
      let data = {
        values: JSON.stringify(values)
      };
      pubsub.publish(FORM_SUBMITTED, { data })
      res.send('ok');
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  });

  apolloServer({ app });

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000`);
  });
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {});
