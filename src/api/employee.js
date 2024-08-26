import request from '@/utils/request'

/**
 * 获取员工列表
 * @param { page, pageSize, name} params
 * @returns
 */
export function getEmployeeListAPI(params) {
  return request({
    url: '/park/sys/user',
    params
  })
}
/**
 * 添加员工
 * @returns
 */
export function createEmployeeAPI(data) {
  return request({
    url: `/park/sys/user`,
    method: 'POST',
    data
  })
}
/**
 * 添加员工
 * @returns
 */
export function editEmployeeAPI(data) {
  return request({
    url: `/park/sys/user`,
    method: 'PUT',
    data
  })
}
