import request from '@/utils/request'

/**
 * @description: 获取月卡列表
 * @param params
 * @returns {*}
 */
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    method: 'get',
    params
    // 绝对不能用这种,会失效
    // data: params
  })
}
