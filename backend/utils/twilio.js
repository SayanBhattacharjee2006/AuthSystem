import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTP = async (phone) => {
    const updatedPhone = "+91" + phone
  return await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_ID)
    .verifications.create({
      to: updatedPhone,
      channel: "sms",
    });
};

export const verifyOTP = async (phone, otp) => {
    const updatedPhone = "+91" + phone
  return await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_ID)
    .verificationChecks.create({
      to: updatedPhone,
      code: otp,
    });
};
