import { getPageContent } from "../api";
import { delay, getBaseRandomValue } from "../util";
import * as $ from "cheerio";

const BASE_PAGE = 'https://jy.tj.gov.cn/BMFW/rxzs/ywjyzs/';
const REG_PAGE = /共(\d+)页/;


function getFullUrl(pageIndex: number) {
    if (pageIndex === 0) {
        return `${BASE_PAGE}/index.html`
    } else {
        return `${BASE_PAGE}/index_${pageIndex - 1}.html`
    }
}

function getPageCount(text: string) {
    try {
        const match = text.match(REG_PAGE);
        if (match) {
            return +match[1]
        }
        return 2
    } catch (e) {
        console.error("getPageCount error:", e);
        return 2
    }
}

function extractList(doc: $.CheerioAPI) {
    return doc(".common-list-right-list>li").map((i, el) => {
        return {
            title: $.load(el)(".list-content").text().trim(),
            date: $.load(el)(".list-date").text().trim(),
        }
    })
}


async function getLinksInfo() {
    let pageContent = (await getPageContent(BASE_PAGE)).data;
    console.log("获取第1页内容成功");
    let doc = $.load(pageContent);

    const pageStr = doc(".page-list").text();
    const pageCount = getPageCount(pageStr);

    const ckPage = Math.min(Math.max(pageCount, 2), 3);

    const results = [];

    let fList = extractList(doc);
    console.log(`提取第1页内容成功`);
    results.push(...fList)

    for (let i = 2; i <= ckPage; i++) {
        await delay(5000)
        pageContent = (await getPageContent(getFullUrl(i))).data;
        console.log(`获取第${i}页内容成功`);
        doc = $.load(pageContent);
        let fList = extractList(doc);
        console.log(`提取第${i}页内容成功`);
        results.push(...fList)
    }

    return results;

}


/**
 * 招生
 * @param page 
 */
export default async function checkRecruitment() {
    try {
        const linkInfos = await getLinksInfo();
        const item = linkInfos.find(link => {
            return link.date.includes("2023")
                && link.title.includes("河西")
                && link.title.includes("小学")
        });

        return {
            success: true,
            data: {
                published: !!item,
                item,
                link: BASE_PAGE
            }
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}
