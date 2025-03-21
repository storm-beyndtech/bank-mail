import dotenv from "dotenv";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { verifyTransporter } from "./services/emailConfig";
import { bulkMail } from "./services/emailService";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

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

// Send email route
app.post("/send-mail", async (req: Request, res: Response) => {
	const { mails, subject, message } = req.body;
	try {
		// Add your email sending logic here
    const mailRes:any = await bulkMail(mails, subject, message);
    if (mailRes.error) {
      throw new Error(mailRes.error);
    }
		res.status(200).json({ message: "Mail Sent Successfully..." });
	} catch (error) {
		console.error("Error sending email:", error);
		res.status(500).json({ error: "Failed to send email" });
	}
});
