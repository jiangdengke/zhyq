import request from '@/utils/request'

/**
 * 获取企业列表
 * @param { page, pageSize} params
 * @returns
 */
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}
