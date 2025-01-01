const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} = require("./emailTemplate");
const { client, sender } = require("./mailtrap.config.js");

const sendVerficationEmail = async (email, verificationCode) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
      category: "Email verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending verification email", error);
    throw new Error(`Error sending verification email:${error}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "ff6b3908-69d0-40b8-b40d-ec739d746409",
      template_variables: {
        company_info_name: "Cunning Studio",
        name: name,
      },
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.log("Error sending welcome email", error);
    throw new Error(`Error sending welcome email:${error}`);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password reset",
    });
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.log(`Error sending reset email`, error);
    throw new Error(`Error sending reset email:${error}`);
  }
};
const sendPasswordResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Password reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset",
    });
    console.log("Password reset successfull", response);
  } catch (error) {
    console.log("Error message", error);
    throw new Error(`Error sending reset email:${error}`);
  }
};

module.exports = {
  sendVerficationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
};
