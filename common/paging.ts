import { ref, toRaw } from "vue";

export const usePagination = (fetchApi: any, params?: any) => {
    const { preprocessParams, defaultCurrentPage } = params || {};

    // 数据状态
    const list = ref([]); // 所有数据
    const currentPage = ref(defaultCurrentPage || 1); // 当前页码（加载更多时使用）
    const currentPrePage = ref(defaultCurrentPage || 1); // 当前最前面的页码（加载上一页时使用）
    const pageSize = ref(12); // 每页大小
    const total = ref(0); // 数据总量

    // 状态管理
    const loading = ref(false); // 是否正在加载
    const isEmpty = ref(false); // 是否为空数据
    const isLastPage = ref(false); // 是否最后一页
    const canLoadMore = ref(false); // 是否可以继续加载

    // 加载列表数据（下一页）
    const getList = async () => {


        if (loading.value || isLastPage.value) return; // 防止重复加载
        loading.value = true;

        try {
            // 调用参数预处理钩子，动态生成请求参数
            const params = preprocessParams
                ? preprocessParams({ currentPage: currentPage.value, pageSize: pageSize.value })
                : { currentPage: currentPage.value, pageSize: pageSize.value };

            const { data } = await fetchApi(params);
            const response = toRaw(data);

            const { list: newList, total: newTotal } = response;

            // 更新数据状态
            if (newList && newList.length > 0) {
                list.value = [...list.value, ...newList];
                total.value = newTotal;
                currentPage.value += 1; // 更新下一页页码
            }

            // 更新状态管理
            isEmpty.value = total.value === 0;
            isLastPage.value = list.value.length >= total.value; // 检查已加载数据是否达到总数据量
            canLoadMore.value = !isLastPage.value; // 是否可以继续加载
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            loading.value = false;
        }
    };

    // 加载上一页数据
    const getPreList = async () => {

        if (loading.value || currentPrePage.value <= 1) {
            return Promise.reject()
        }


        loading.value = true;

        try {

            // 获取当前最前页的上一页数据
            const previousPage = currentPrePage.value - 1;
            const params = preprocessParams
                ? preprocessParams({ currentPage: previousPage, pageSize: pageSize.value })
                : { currentPage: previousPage, pageSize: pageSize.value };


            const { data } = await fetchApi(params);
            const response = toRaw(data);

            const { list: newList } = response;

            // 更新数据状态

            if (newList && newList.length > 0) {
                list.value = [...newList, ...list.value]; // 将新数据插入到列表前面
                currentPrePage.value = previousPage; // 更新最前面的页码
            }

            // 更新状态管理
            isEmpty.value = total.value === 0;
        } catch (error) {
            console.error("Error fetching previous data:", error);
        } finally {
            loading.value = false;
        }
    };

    // 重置分页（用于重新加载）
    const resetPagination = () => {
        list.value = [];
        currentPage.value = defaultCurrentPage || 1;
        currentPrePage.value = defaultCurrentPage || 1;
        total.value = 0;
        isEmpty.value = false;
        isLastPage.value = false;
        canLoadMore.value = false;
    };

    return {
        list, // 数据列表
        total, // 总结果数量
        loading, // 是否正在加载
        isEmpty, // 是否为空数据
        isLastPage, // 是否为最后一页
        canLoadMore, // 是否可以继续加载
        getList, // 加载数据方法（下一页）
        getPreList, // 加载数据方法（上一页）
        resetPagination, // 重置分页
    };
};
