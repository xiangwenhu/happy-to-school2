import * as mailer from "./email";
import Mail, { Address } from "nodemailer/lib/mailer";

import getConfig from "../config"

const config = getConfig();

const options: Mail.Options =  {
    from: config.user.email,
    to:  config.user.emailTo,
    subject: "招生信息Happy通知",
    html: `
    <div>检查时间: ${new Date().toLocaleString()}</div>
    <div>检查结果: 未发布招募信息</div>
    <div>信息来源: <a href="https://jy.tj.gov.cn/BMFW/rxzs/ywjyzs/">点击查看</a></div>
    `
}

mailer.sendQQEmail(options)