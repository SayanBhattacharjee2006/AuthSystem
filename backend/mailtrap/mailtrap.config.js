
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();
// const TOKEN = "354f31e445246ccb9119bba9c33d3b0a";

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "OTP verification",
};
// const recipients = [
//   {
//     email: "sayanbhattacharya0001@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "AAAAAG MKB AAAAAAAAAG",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);