import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE , PASSWORD_RESET_SUCCESS_TEMPLATE} from "./email.template.js";

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

export const sendPasswordResetEmail = async (email, resetPasswordLink) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
                "{resetURL}",
                resetPasswordLink
            ),
            category: "Password Reset",
        });

        console.log("Password Reset Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending Password Reset email:", error);
        throw new Error(`Failed to send Password Reset email: ${error.message}`);
    }
}

export const sendPasswordResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });

        console.log("Password Reset Success Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending Password Reset Success email:", error);
        throw new Error(`Failed to send Password Reset Success email: ${error.message}`);
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
