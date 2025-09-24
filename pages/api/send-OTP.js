import twilio from "twilio";
import { formatPhoneForTwilio } from "../../lib/phoneUtils";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const phoneNumber = req.query.phone;

    // Use fuzzy phone formatting - handles any input format
    const formattedPhone = formatPhoneForTwilio(phoneNumber);

    const verification = await client.verify.v2
        .services(process.env.TWILIO_SERVICE_SID)
        .verifications.create({
            channel: "sms",
            to: formattedPhone,
        });
    res.json(verification.status);
}
