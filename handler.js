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
  const phone = req.body.phone;
  const company = req.body.company;
  const location = req.body.location;
  const body = req.body.body;
  const product = req.body.product;

  const emailParams = {
    Source: "", // Your Verified Email
    Destination: {
      ToAddresses: [""] // Your verfied Email
    },
    ReplyToAddresses: [req.body.email],
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nLocation: ${location}\nProduct: ${product}\n\n ${body}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "You Received a Message from www.KnoGeo.com"
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

module.exports.form = serverless(app);
