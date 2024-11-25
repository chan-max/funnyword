import { useLocalStorage } from "@vueuse/core";


export enum WordRecords {

    NORMAL = 0, // 正常状态

    SKIP = 1 // 跳过该单词
}


const statisticsTemplate = {

    // 数量统计

    letterInputCount: 0,    /*  输入了多少次字符 */
    letterInputSuccessCount: 0,      /*  正确输入了多少次字符 */
    letterInputErrorCount: 0,      /*   错误输入了多少次字符 */


    wordInputSuccessCount: 0,       /*   正确输入了多少个单词 */

    // 时间统计

    latestWordInputCost: 0, // 最近一次输入单词耗时
    latestWordInputCostWord: '',// 最近一次耗时的单词


    minimumWordInputCost: 9999999, // 最短单词耗时
    minimumWordInputCostWord: '', // 最短耗时单词

    maximumWordInputCost: 0, // 最长单词耗时
    maximumWordInputCostWord: '',// 最长耗时单词


    wordRecords: {
        "abcdefg": {
            status: WordRecords.NORMAL
        }
    }
}


export function createWordRecord() {
    return {
        status: WordRecords.NORMAL
    }
}


export const statistics = useLocalStorage('funnyword_statistics', {
    ...statisticsTemplate
});


export const resetStatistics = () => {
    statistics.value = {
        ...statisticsTemplate
    }
}