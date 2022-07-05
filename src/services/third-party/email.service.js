const path = require('path');
const pug = require('pug');
const Mailgun = require('mailgun.js');
const formData = require('form-data');
const { appLogger } = require('../../helpers/logger/appLogger');
const { mailgunAPIKEY, mailgunDomain, rootDomain } = require('../../config');

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: mailgunAPIKEY });

const sendVerificationEmail = async (fullName, emailAddress, token) => {
  try {
    const compiledFunction = pug.compileFile(path.join(__dirname, '/../../assets/templates/verifyAccountEmailTemplate.pug'));
    const verificationLink = `${rootDomain}/api/v1/auth/verify/${token}`;
    const verifyAccountHTML = compiledFunction({ fullName, verificationLink });

    const messageData = {
      from: 'Glumos <noreply@glumos.com>',
      to: emailAddress,
      subject: 'Verify Your Account',
      html: verifyAccountHTML,
    };

    await client.messages.create(mailgunDomain, messageData);

    appLogger.info(`Sent verification email to ${emailAddress}`);
    return true;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      appLogger.error(`retrying sending email to ${emailAddress} list due to Timeout error`);
      return sendVerificationEmail(emailAddress, token);
    }
    appLogger.error(`error while sending email to ${emailAddress} ${JSON.stringify(error)}`);
  }
  return false;
};

const sendOTPEmail = async (emailAddress, otpCode) => {
  try {
    // const compiledFunction = pug
    // .compileFile(path.join(__dirname, '/../../assets/templates/jobsAlertTemplate.pug'));
    // const jobsListHTML = compiledFunction({
    //   jobs,
    // });

    const messageData = {
      from: 'Glumos <noreply@glumos.com>',
      to: emailAddress,
      subject: 'Reset Password OTP',
      text: otpCode,
    };

    await client.messages.create(mailgunDomain, messageData);

    appLogger.info(`Sent OTP email to ${emailAddress}`);
    return true;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      appLogger.error(`retrying sending OTP email to ${emailAddress} list due to Timeout error`);
      return sendVerificationEmail(emailAddress, otpCode);
    }
    appLogger.error(`error while sending OTP email to ${emailAddress} ${JSON.stringify(error)}`);
  }
  return false;
};

module.exports = {
  sendVerificationEmail,
  sendOTPEmail,
};
