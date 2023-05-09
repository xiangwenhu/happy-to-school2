import fs from "fs";
import path from "path";

const env = process.env || {};

interface IConfig {
    user: {
        email: string;
        emailPassword: string;
        emailTo: string | string[];
        cookies: Record<string, any[]>
    }
}

function parseEmail(email: string) {
    try {
        return email.split(";").map(e => e.trim()).filter(Boolean);
    } catch (err) {
        return email;
    }
}

let config: IConfig | null = null;

export default function getConfig(): IConfig {
    if (!config) {
        config = initConfig();
    }
    return config;
}

function initConfig() {
    if (fs.existsSync(path.join(__dirname, "./index.local.js"))) {
        const config = require("./index.local") as IConfig;
        return config
    }

    return {
        user: {
            email: env.USER_EMAIL, // 你的接收通知的邮箱
            emailPassword: env.USER_EMAIL_PASSWORD,  // 邮箱密码
            emailTo: parseEmail(env.USER_EMAIL_TO as string)
        }
    } as IConfig;
}




