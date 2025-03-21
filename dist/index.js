"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const emailConfig_1 = require("./services/emailConfig");
const emailService_1 = require("./services/emailService");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Verify Email Transporter
(async () => {
    await (0, emailConfig_1.verifyTransporter)();
})();
// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
// Default route
app.get("/", (res) => {
    res.send("API running 🥳");
});
// Send email route
app.post("/send-mail", async (req, res) => {
    const { mails, subject, message } = req.body;
    try {
        // Add your email sending logic here
        const mailRes = await (0, emailService_1.bulkMail)(mails, subject, message);
        console.log(mailRes);
        res.status(200).json({ mailRes });
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});
