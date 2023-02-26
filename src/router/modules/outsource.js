// 外包相关
import Layout from '@/layout'

const outsourceRouter = {
  path: '/outsource',
  component: Layout,
  redirect: '/outsource/constraint/modelnamerestrictions',
  name: 'Outsource',
  meta: {
    title: '外包相关',
    icon: 'nested',
    roles: ['admin', 'common']
  },
  children: [
    {
      path: 'constraint',
      name: 'Constraint',
      meta: {
        title: '外包约束数据',
        icon: 'el-icon-s-data',
        roles: ['admin', 'common']
      },
      redirect: '/outsource/constraint/modelnamerestrictions',
      children: [
        {
          path: 'modelnamerestrictions',
          component: () => import('@/views/outsource/constraint/ModelNameRestrictions'),
          name: 'ModelNameRestrictions',
          meta: {
            title: 'SMT/AI组件优先分配',
            roles: ['admin', 'common']
          }
        },
        {
          path: 'capacity',
          component: () => import('@/views/outsource/constraint/Capacity'),
          name: 'Capacity',
          meta: {
            title: '产能限制',
            roles: ['admin', 'common']
          }
        }
      ]
    },
    {
      path: 'basedata',
      name: 'BaseData',
      meta: {
        title: '外包基本数据',
        icon: 'el-icon-s-data',
        roles: ['admin', 'common']
      },
      redirect: '/outsource/basedata/customer',
      children: [
        {
          path: 'customer',
          component: () => import('@/views/outsource/basedata/Customer'),
          name: 'Customer',
          meta: {
            title: '客户表',
            roles: ['admin', 'common']
          }
        },
        {
          path: 'factorytype',
          component: () => import('@/views/outsource/basedata/FactoryType'),
          name: 'FactoryType',
          meta: {
            title: '厂别表',
            roles: ['admin', 'common']
          }
        }
      ]
    },
    {
      path: 'otherdata',
      name: 'OtherData',
      meta: {
        title: '外包数据',
        icon: 'el-icon-s-data',
        roles: ['admin', 'common']
      },
      redirect: '/outsource/otherdata/schedule',
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
          path: 'customer',
          component: () => import('@/views/outsource/otherdata/Customer'),
          name: 'Customer',
          meta: {
            title: '客户表',
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
  ]
}

export default outsourceRouter
