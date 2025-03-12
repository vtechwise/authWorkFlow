const sendEmail = require("./sendEmail");

const sendVerificationToken = async ({
  name,
  email,
  verifcationToekn,
  origin,
}) => {
  const message = "<p>Please confirm your email using this link </p>";
  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>hello ${name} ${message}</h4>`,
  });
};

module.exports = sendVerificationToken
