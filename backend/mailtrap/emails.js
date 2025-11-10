import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./email.template.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verificationToken
            ),
            category: "Email Verification",
        });

        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "515b4e3c-d170-4ef2-ab47-d4a37249ebf0",
            template_variables: {
                user_name: name,
                next_step_link: "Test_Next_step_link",
                get_started_link: "Test_Get_started_link",
                onboarding_video_link: "Test_Onboarding_video_link",
            },
        });

        console.log("Welcome Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending Welcome email:", error);
        throw new Error(`Failed to send Welcome email: ${error.message}`);
    }
};

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "AAAAAG MKB AAAAAAAAAG",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
