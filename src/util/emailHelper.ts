import Mail from "nodemailer/lib/mailer";
import getConfig from "../config"
import * as mailer from "../modules/email";

interface ResultInfo {
    type: "checkRecruitment"
    success: boolean;
    data: any;
    error: any;
    message: string;
}

interface SendOptions {
    result: ResultInfo;
    subject?: string;
}


function buildBody(result: ResultInfo) {
    switch (result.type) {
        case "checkRecruitment":
            if (!result.success) {
                return `
                <div style="margin:50px">
                    <div>检查时间: ${new Date().toLocaleString()}</div>
                    <div style="color:red">检查结果: ${result.error && result.error.message || "未知异常"}</div>
                </div>
                `
            }
            if (!!result.data?.published) {
                return `
                <div style="margin:50px">
                    <div>检查时间: ${new Date().toLocaleString()}</div>
                    <div style="font-weight:bold; color:green">检查结果: 河西区小学已发布招生信息</div>
                    <div>信息来源: <a href="https://jy.tj.gov.cn/BMFW/rxzs/ywjyzs/">点击查看</a></div>
                </div>`
            }
            return `
            <div style="margin:50px">
                <div>检查时间: ${new Date().toLocaleString()}</div>
                <div>检查结果: 暂未发布招生信息</div>
            </div>`

        default:
            break;
    }
}

export function sendHappyResult(options: SendOptions) {

    const config = getConfig();

    const bodyHTML = buildBody(options.result)

    const mailOptions: Mail.Options = {
        from: config.user.email,
        to: config.user.email,
        subject: options.subject || "招生信息Happy通知",
        html: bodyHTML
    }
    mailer.sendQQEmail(mailOptions);
}

