const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config();
const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

const client = new MailtrapClient({
  token: "f19d530c12051d320ad24c5cf7a92b26",
  endpoint: ENDPOINT,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};

module.exports = { client, sender };
