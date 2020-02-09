const serverless = require("serverless-http");
const AWS = require("aws-sdk");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

if (!AWS.config.region) {
  AWS.config.update({
    region: "us-west-1"
  });
}

const ses = new AWS.SES();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const to = req.body.to;
  const subject = req.body.subject;
  const body = req.body.body;
  const debug = req.body.debug;

  let debugData = "";
  if (debug) {
    debugData = "\n\n--- DEBUG ---\n\n";
    for (let key in req.body) {
      debugData += `${key}: ${req.body[key]}\n`;
    }
  }

  const emailParams = {
    Source: "p.quan@me.com", // Your Verified Email
    Destination: {
      ToAddresses: debug === true ? ["p.quan@me.com"] : ["pquannn@gmail.com"] // Your verfied Email ToAddresses: []
    },
    ReplyToAddresses: [req.body.email],
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Name: ${name}\nEmail: ${email}\n\nBody:\n\t${body}${debugData}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject
      }
    }
  };

  ses.sendEmail(emailParams, (err, data) => {
    if (err) {
      res.status(402).send(`${err} ${err.stack}`);
    }
    if (data) {
      res.send(data);
    }
  });
});

// app.listen(3001, () => {
//   console.log("app on 3001");
// });

module.exports.form = serverless(app);
