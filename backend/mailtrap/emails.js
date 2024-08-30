import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { client, sender } from "./mailtrap_config.js";

export const sendVerificationEmail = async (email, verificationToken, firstname) => {
  const recipient = [{ email }];
  try {
    await client.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        /{verificationCode}|{firstname}/g,
        (matched) => {
          if (matched === "{verificationCode}") return verificationToken;
          if (matched === "{firstname}") return firstname;
        }
      ),
      category: "Email Verification",
    });

  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
};

export const sendWelcomeEmail = async (email, firstname) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "a6690b03-0450-4c5b-a779-4c1b10028c4f",
      template_variables: {
        user_name: firstname,
        next_step_link: "Test_Next_step_link",
        get_started_link: "Test_Get_started_link",
        onboarding_video_link: "Test_Onboarding_video_link",
      },
    });
  } catch (error) {
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    await client.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    throw new Error(`Error sending password reset email`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    await client.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
