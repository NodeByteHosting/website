import axios from 'axios';

interface LogProps {
    title: string;
    message: string;
    status: number;
    page?: string;
    source?: string;
}

export const logErrorToDiscord = async ({ title, message, status, page, source }: LogProps) => {

    const WEBHOOK_ID = process.env.ERROR_HOOK_ID;
    const WEBHOOK_TOKEN = process.env.ERROR_HOOK_TOKEN;

    /** WILL USE CORDX'S PROXY HERE TO AVOID RATE LIMITS */
    const WEBHOOK_URL = `https://proxy.cordx.lol/api/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}`;

    const fields = [
        {
            name: "Error",
            value: `${title}`,
            inline: true
        },
        {
            name: "Status",
            value: `${status}`,
            inline: true
        },
        {
            name: "Message",
            value: `${message}`,
            inline: false
        }
    ];

    if (source) {
        fields.push({
            name: "Source",
            value: `${source}`,
            inline: true
        });
    }

    if (page) {
        fields.push({
            name: "Page",
            value: `${page}`,
            inline: true
        });
    }

    await axios.post(WEBHOOK_URL, {
        username: 'LogiQ',
        avatar_url: 'https://nodebyte.host/ErrorLogo.gif',
        embeds: [{
            title: '🚨 Error Logs: nodebyte.host',
            description: 'This is an automated error log from the NodeByte Hosting Website.',
            color: 0xff0000,
            author: {
                name: "NodeByte - LogiQ",
                url: "https://nodebyte.host",
                icon_url: "https://nodebyte.host/ErrorLogo.gif"
            },
            fields: fields,
            image: {
                url: "https://nodebyte.host/ErrorBanner.gif"
            },
            footer: {
                text: '© 2024 - NodeByte LTD',
                icon_url: 'https://nodebyte.host/ErrorLogo.gif'
            }
        }]
    })
        .then(() => console.log(`Successfully generated an error report for our team!`))
        .catch((err: any) => console.error(`Failed to generate error report: ${err.message}`));
}