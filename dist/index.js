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
        for (const email of mails) {
            const mailRes = yield (0, emailService_1.bulkMail)(email, subject, message);
            if (mailRes === null || mailRes === void 0 ? void 0 : mailRes.error) {
                console.error(`Failed to send to ${email}: ${mailRes.error}`);
            }
        }
        res.status(200).json({ message: "Mails sent individually." });
    }
    catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ error: "Failed to send some or all emails" });
    }
}));
