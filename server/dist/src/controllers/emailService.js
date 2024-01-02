"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
/**
 * sends an email using emailjs
 * @param params dynamic parameters to be passed to the email template
 * @param templateId id of the email template to use
 */
const sendEmail = async (params, templateId) => {
    const data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: process.env.EMAILJS_USER_ID,
        accessToken: process.env.EMAILJS_ACCESS_KEY,
        template_params: {
            ...params,
        },
    };
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok)
        throw new Error(data.toString());
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailService.js.map