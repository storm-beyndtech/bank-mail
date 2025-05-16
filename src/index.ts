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
		const results = [];
		if (Array.isArray(mails)) {
			for (const email of mails) {
				try {
					await bulkMail(email, subject, message);
					console.log(`✅ Sent to: ${email}`);
					results.push({ email, status: "sent" });
					await delay(300);
				} catch (err: any) {
					console.error(`❌ Error sending to ${email}:`, err.message);
					results.push({ email, status: "failed", error: err.message });
				}
			}
		} else if (typeof mails === "string") {
			await bulkMail(mails, subject, message);
		}
		console.table(results);

		res.status(200).json({ message: "Mails sent individually." });
	} catch (error) {
		console.error("Error sending emails:", error);
		res.status(500).json({ error: "Failed to send some or all emails" });
	}
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
