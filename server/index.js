//@ts-check
require("dotenv").config();
const { Photon } = require("@generated/photon");
const photon = new Photon();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const corsOrigin = process.env.CORS_ORIGIN || "*";
const apolloServer = require("./apolloServer");

async function main() {
  const app = express();
  await photon.connect();

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
      if (id) {
        // create the form first reference first
        await photon.forms.upsert({
          where: { reference: id },
          create: { reference: id },
          update: {}
        });
        data = {
          ...data,
          form: {
            connect: { reference: id }
          }
        };
      }
      const submission = await photon.submissions.create({
        data,
        include: { form: true }
      });
      res.send(submission);
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
