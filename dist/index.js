"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Verify Email Transporter
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, emailConfig_1.verifyTransporter)();
}))();
// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
// Default route
app.get("/", (req, res) => {
    res.send("API running 🥳");
});
app.post("/send-mail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mails, subject, message } = req.body;
    try {
        const results = [];
        for (const email of mails) {
            try {
                yield (0, emailService_1.bulkMail)(email, subject, message);
                console.log(`✅ Sent to: ${email}`);
                results.push({ email, status: "sent" });
                yield delay(300);
            }
            catch (err) {
                console.error(`❌ Error sending to ${email}:`, err.message);
                results.push({ email, status: "failed", error: err.message });
            }
        }
        console.table(results);
        res.status(200).json({ message: "Mails sent individually." });
    }
    catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ error: "Failed to send some or all emails" });
    }
}));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
