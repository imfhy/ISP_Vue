// 外包相关
import Layout from '@/layout'
// 外包约束数据
const outsourceConstraintsRouter = {
  path: '/outsourcedata',
  component: Layout,
  redirect: '/outsourcedata/ledctdata',
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
      component: () => import('@/views/outsource/otherdata/Schedule'),
      name: 'Schedule',
      meta: {
        title: '业务排程明细',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'daycapacityconfig',
      component: () => import('@/views/outsource/otherdata/DayCapacityConfig'),
      name: 'DayCapacityConfig',
      meta: {
        title: '每日产能配置',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'division',
      component: () => import('@/views/outsource/otherdata/Division'),
      name: 'Division',
      meta: {
        title: '分工单格式',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'oldOrder',
      component: () => import('@/views/outsource/otherdata/OldOrder'),
      name: 'OldOrder',
      meta: {
        title: '旧工单',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'outputfiles',
      component: () => import('@/views/outsource/otherdata/OutputFiles'),
      name: 'OutputFiles',
      meta: {
        title: '输出文件',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'summary',
      component: () => import('@/views/outsource/otherdata/Summary'),
      name: 'Summary',
      meta: {
        title: '业务排程汇总',
        roles: ['admin', 'common']
      }
    }
  ]
}
export default outsourceConstraintsRouter
