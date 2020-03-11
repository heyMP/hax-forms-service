//@ts-check
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
// const apolloServer = require("./apolloServer");
// const { pubsub, FORM_SUBMITTED } = require("./apolloServer.js");
const nodemailer = require("nodemailer");
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

async function main() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.text());
  app.use(bodyParser.json());

  /**
   * Allow calls from web components with cookies
   */
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", CORS_ORIGIN);
    next();
  });

  app.post("/", async (req, res) => {
    try {
      const { id, values } = req.body;
      let data = {
        values: JSON.stringify(values)
      };
      sendEmail(data);
      res.send("ok");
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  });

  // apolloServer({ app });

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000`);
  });
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {});

const sendEmail = async data => {
  let message = "";
  for (let value of JSON.parse(data.values)) {
    message += `<label>${value.name}</label>: ${value.value}<br>`;
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL, // generated ethereal user
      pass: PASSWORD // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_FROM_ADDRESS, // sender address
    to: process.env.EMAIL_TO_ADDRESS, // list of receivers
    subject: process.env.EMAIL_SUBJECT, // Subject line
    html: emailTemplate(message) // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

const emailTemplate = body => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>${process.env.EMAIL_TEMPLATE_HEADER}</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <style type="text/css">
        /* CLIENT-SPECIFIC STYLES */
        #outlook a {
          padding: 0;
        } /* Force Outlook to provide a "view in browser" message */
        .ReadMsgBody {
          width: 100%;
        }
        .ExternalClass {
          width: 100%;
        } /* Force Hotmail to display emails at full width */
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        } /* Force Hotmail to display normal line spacing */
        body,
        table,
        td,
        a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        } /* Prevent WebKit and Windows mobile changing default text sizes */
        table,
        td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        } /* Remove spacing between tables in Outlook 2007 and up */
        img {
          -ms-interpolation-mode: bicubic;
        } /* Allow smoother rendering of resized image in Internet Explorer */

        /* RESET STYLES */
        body {
          margin: 0;
          padding: 0;
        }
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        table {
          border-collapse: collapse !important;
        }
        body {
          height: 100% !important;
          margin: 0;
          padding: 0;
          width: 100% !important;
        }

        /* iOS BLUE LINKS */
        .appleBody a {
          color: #68440a;
          text-decoration: none;
        }
        .appleFooter a {
          color: #999999;
          text-decoration: none;
        }

        /* MOBILE STYLES */
        @media screen and (max-width: 525px) {
          /* ALLOWS FOR FLUID TABLES */
          table[class="wrapper"] {
            width: 100% !important;
          }

          /* ADJUSTS LAYOUT OF LOGO IMAGE */
          td[class="logo"] {
            text-align: left;
            padding: 20px 0 20px 0 !important;
          }

          td[class="logo"] img {
            margin: 0 auto !important;
          }

          /* USE THESE CLASSES TO HIDE CONTENT ON MOBILE */
          td[class="mobile-hide"] {
            display: none;
          }

          img[class="mobile-hide"] {
            display: none !important;
          }

          img[class="img-max"] {
            max-width: 100% !important;
            height: auto !important;
          }

          /* FULL-WIDTH TABLES */
          table[class="responsive-table"] {
            width: 100% !important;
          }

          /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */
          td[class="padding"] {
            padding: 10px 5% 15px 5% !important;
          }

          td[class="padding-copy"] {
            padding: 10px 5% 10px 5% !important;
            text-align: center;
          }

          td[class="padding-meta"] {
            padding: 30px 5% 0px 5% !important;
            text-align: center;
          }

          td[class="no-pad"] {
            padding: 0 0 20px 0 !important;
          }

          td[class="no-padding"] {
            padding: 0 !important;
          }

          td[class="section-padding"] {
            padding: 50px 15px 50px 15px !important;
          }

          td[class="section-padding-bottom-image"] {
            padding: 50px 15px 0 15px !important;
          }

          /* ADJUST BUTTONS ON MOBILE */
          td[class="mobile-wrapper"] {
            padding: 10px 5% 15px 5% !important;
          }

          table[class="mobile-button-container"] {
            margin: 0 auto;
            width: 100% !important;
          }

          a[class="mobile-button"] {
            width: 80% !important;
            padding: 15px !important;
            border: 0 !important;
            font-size: 16px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0;">
      <!-- HEADER -->
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="table-layout: fixed;"
      >
        <tr>
          <td bgcolor="#ffffff">
            <div align="center" style="padding: 0px 15px 0px 15px;">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="500"
                class="wrapper"
              >
                <!-- LOGO/PREHEADER TEXT -->
                <tr>
                  <td style="padding: 20px 0px 30px 0px;" class="logo">
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>

      <!-- ONE COLUMN SECTION -->
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="table-layout: fixed;"
      >
        <tr>
          <td
            bgcolor="#ffffff"
            align="center"
            style="padding: 70px 15px 70px 15px;"
            class="section-padding"
          >
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="500"
              class="responsive-table"
            >
              <tr>
                <td>
                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                  >
                    <tr>
                      <td>
                        <!-- HERO IMAGE -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tbody>
                            <tr>
                              <td class="padding-copy">
                                <table
                                  width="100%"
                                  border="0"
                                  cellspacing="0"
                                  cellpadding="0"
                                >
                                  <tr>
                                    <td>
                                      <a
                                        href="http://alistapart.com/article/can-email-be-responsive/"
                                        target="_blank"
                                        ><img
                                          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/48935/responsive-email.jpg"
                                          width="500"
                                          height="200"
                                          border="0"
                                          alt="Can an email really be responsive?"
                                          style="display: block; padding: 0; color: #666666; text-decoration: none; font-family: Helvetica, arial, sans-serif; font-size: 16px; width: 500px; height: 200px;"
                                          class="img-max"
                                      /></a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <!-- COPY -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              align="center"
                              style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px;"
                              class="padding-copy"
                            >
                            ${process.env.EMAIL_TEMPLATE_HEADER}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <!-- BULLETPROOF BUTTON -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                          class="mobile-button-container"
                        >
                          <tr>
                            <td
                              align="center"
                              style="padding: 25px 0 0 0;"
                              class="padding-copy"
                            >
                              <table
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                                class="responsive-table"
                              >
                                <tr>
                                  <td align="center">
                                  ${body}
                                  </td>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>



    </body>
  </html>
  `;
};
