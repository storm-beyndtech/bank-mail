import { emailTemplate } from "./emailTemplate";
import { transporter } from "./emailConfig";

const sendMail = (mailData: any) => {
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailData, (err:any, info:any) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log(info);
				resolve(info);
			}
		});
	});
};

const sendMailWithRetry = async (mailData: any, retries = 3) => {
	for (let i = 0; i < retries; i++) {
		try {
			return await sendMail(mailData);
		} catch (error) {
			if (i === retries - 1) throw error;
			console.log(`Retrying sendMail... Attempt ${i + 1}`);
		}
	}
};


// Verification Code Mail
export async function bulkMail(mails: string, subject: string, message:string) {
	try {
		let bodyContent = `
        <p>${message}</p>
    `;

		let mailOptions = {
			from: `Instantsglobal <support@instantsglobal.com>`,
			to: mails,
			subject,
			html: emailTemplate(bodyContent),
		};

		return await sendMailWithRetry(mailOptions);
	} catch (error) {
		return { error: error instanceof Error && error.message };
	}
}