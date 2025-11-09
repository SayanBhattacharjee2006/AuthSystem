import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./email.template.js";

export const sendVerificationEmail = async (email,verificationToken) => {
    const recipient = [{email}];

    try {

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category: "Email Verification",
        });

        console.log("Email sent successfully:", response);
        
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send verification email: ${error.message}`)
    }
}





// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "AAAAAG MKB AAAAAAAAAG",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);