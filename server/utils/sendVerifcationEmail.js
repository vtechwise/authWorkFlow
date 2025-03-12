const sendEmail = require("./sendEmail");

const sendVerificationToken = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifcationUrl = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email using this link : <a href=${verifcationUrl}> Verify Now</a> </p>`;
  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>hello ${name} ${message}</h4>`,
  });
};

module.exports = sendVerificationToken;
