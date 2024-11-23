import axios from 'axios';

interface LogProps {
    title: string;
    message: string;
    request?: string;
    status: string;
}

export const logErrorToDiscord = async ({ title, message, request, status }: LogProps) => {

    const WEBHOOK_ID = process.env.ERROR_HOOK_ID;
    const WEBHOOK_TOKEN = process.env.ERROR_HOOK_TOKEN;

    /** WILL USE CORDX'S PROXY HERE TO AVOID RATE LIMITS */
    const WEBHOOK_URL = `https://proxy.cordx.lol/api/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}`;

    await axios.post(WEBHOOK_URL, {
        content: "A new error/diagnostics report is available!",
        embeds: [{
            title: '🚨 Error Logs: nodebyte.host',
            description: 'This is an automated error log from the NodeByte Hosting Website.',
            color: 0xff0000,
            footer: {
                text: '© 2024 - NodeByte LTD',
                icon_url: ''
            }
        }]
    })
        .then(() => console.log(`Successfully generated a error report for our team!`))
        .catch((err: any) => console.error(`Failed to generate error report: ${err.message}`));
}