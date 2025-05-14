import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { verifyTransporter } from "./services/emailConfig";
import { bulkMail } from "./services/emailService";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// Verify Email Transporter
(async () => {
	await verifyTransporter();
})();

// Start the server
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

// Default route
app.get("/", (req: Request, res: Response) => {
	res.send("API running 🥳");
});

app.post("/send-mail", async (req: Request, res: Response) => {
	const { mails, subject, message } = req.body;

	try {
		for (const email of mails) {
			const mailRes: any = await bulkMail(email, subject, message);
			if (mailRes?.error) {
				console.error(`Failed to send to ${email}: ${mailRes.error}`);
			}
		}

		res.status(200).json({ message: "Mails sent individually." });
	} catch (error) {
		console.error("Error sending emails:", error);
		res.status(500).json({ error: "Failed to send some or all emails" });
	}
});

