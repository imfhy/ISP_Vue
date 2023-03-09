// 外包相关
import Layout from '@/layout'
// 外包数据
const OutsourceOtherDataRouter = {
  path: '/outsourceotherdata',
  component: Layout,
  redirect: '/outsourceotherdata/schedule',
  alwaysShow: true,
  name: 'OutsourceData',
  meta: {
    title: '外包模块',
    icon: 'el-icon-s-data',
    roles: ['admin', 'common']
  },
  children: [
    {
      path: 'schedule',
      component: () => import('@/views/Outsource/OtherData/Schedule'),
      name: 'Schedule',
      meta: {
        title: '业务排程明细',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'daycapacityconfig',
      component: () => import('@/views/Outsource/OtherData/DayCapacityConfig'),
      name: 'DayCapacityConfig',
      meta: {
        title: '每日产能配置',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'division',
      component: () => import('@/views/Outsource/OtherData/Division'),
      name: 'Division',
      meta: {
        title: '分工单格式',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'oldorder',
      component: () => import('@/views/Outsource/OtherData/OldOrder'),
      name: 'OldOrder',
      meta: {
        title: '旧工单',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'outputfiles',
      component: () => import('@/views/Outsource/OtherData/OutputFiles'),
      name: 'OutputFiles',
      meta: {
        title: '输出文件',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'summary',
      component: () => import('@/views/Outsource/OtherData/Summary'),
      name: 'Summary',
      meta: {
        title: '业务排程汇总',
        roles: ['admin', 'common']
      }
    }
  ]
}
export default OutsourceOtherDataRouter
