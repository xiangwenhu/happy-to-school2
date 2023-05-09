import { sendHappyResult } from './util/emailHelper';


import checkRecruitment from "./tasks/checkRecruitment";

type Task = () => Promise<any>

const taskList: Task[] = [
    checkRecruitment
];

export async function autoAutoHappy() {
    try {

        // const rdTaskList = taskList.sort(() => Math.random() - 0.5);
        const results = [];
        for (let i = 0; i < taskList.length; i++) {
            try {
                const task = taskList[i];
                console.log(`开始执行任务`, task.name);
                const result = await task.apply(null, []);

                result.type = task.name;
                results.push(result);
                console.log(`执行任务完毕`, task.name)

                sendHappyResult({
                    result
                });

            } catch (error) {
                console.error("任务执行失败:", error);
            }
        }

    } catch (err) {
        console.log('execAutoTask error:', err);
    } finally {
    }
}

