"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkMail = bulkMail;
const emailTemplate_1 = require("./emailTemplate");
const emailConfig_1 = require("./emailConfig");
const sendMail = (mailData) => {
    return new Promise((resolve, reject) => {
        emailConfig_1.transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                console.log(info);
                resolve(info);
            }
        });
    });
};
const sendMailWithRetry = async (mailData, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await sendMail(mailData);
        }
        catch (error) {
            if (i === retries - 1)
                throw error;
            console.log(`Retrying sendMail... Attempt ${i + 1}`);
        }
    }
};
// Verification Code Mail
async function bulkMail(mails, subject, message) {
    try {
        let bodyContent = `
      <td style="padding: 20px; line-height: 1.5;">
        <h2 style="font-size: 24px;">Hello </h2>
        <p>${message}</p>
        <p>Best regards,</p>
        <p>The Instantsglobal Team</p>
      </td>
    `;
        let mailOptions = {
            from: `Instantsglobal <support@mirrorexp.com>`,
            to: mails,
            subject,
            html: (0, emailTemplate_1.emailTemplate)(subject, bodyContent),
        };
        return await sendMailWithRetry(mailOptions);
    }
    catch (error) {
        return { error: error instanceof Error && error.message };
    }
}
