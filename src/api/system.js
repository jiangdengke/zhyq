import request from '@/utils/request'
/**
 * 获取员工角色列表API
 */
export function getRoleListAPI() {
  return request({
    url: '/park/sys/role'

  })
}
/**
 * 删除员工
 * @returns
 */
export function delEmployeeAPI(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}
