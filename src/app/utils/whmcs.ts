import { whmcsApi } from "whmcs-sdk";

export const whmcs = new whmcsApi({
    host: process.env.API_SHORT_URL,
    identifier: process.env.API_IDENTIFIER,
    secret: process.env.API_SECRET,
    endpoint: 'includes/api.php'
})