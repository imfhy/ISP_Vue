// 外包相关
import Layout from '@/layout'

const outsourceRouter = {
  path: '/outsource',
  component: Layout,
  redirect: '/outsource/constraint/modelnamerestrictions',
  name: 'Outsource',
  meta: {
    title: '外包相关',
    icon: 'nested'
  },
  children: [
    {
      path: 'constraint',
      name: 'Constraint',
      meta: {
        title: '外包约束数据',
        icon: 'el-icon-s-data'
      },
      redirect: '/outsource/constraint/modelnamerestrictions',
      children: [
        {
          path: 'modelnamerestrictions',
          component: () => import('@/views/outsource/constraint/ModelNameRestrictions'),
          name: 'ModelNameRestrictions',
          meta: { title: 'SMT/AI组件优先分配' }
        },
        {
          path: 'capacity',
          component: () => import('@/views/outsource/constraint/Capacity'),
          name: 'Capacity',
          meta: { title: '产能限制' }
        }
      ]
    },
    {
      path: 'basedata',
      name: 'BaseData',
      meta: {
        title: '外包基本数据',
        icon: 'el-icon-s-data'
      },
      redirect: '/outsource/basedata/customer',
      children: [
        {
          path: 'customer',
          component: () => import('@/views/outsource/basedata/Customer'),
          name: 'Customer',
          meta: { title: '客户表' }
        },
        {
          path: 'factorytype',
          component: () => import('@/views/outsource/basedata/FactoryType'),
          name: 'FactoryType',
          meta: { title: '厂别表' }
        }
      ]
    },
    {
      path: 'otherdata',
      name: 'OtherData',
      meta: {
        title: '外包数据',
        icon: 'el-icon-s-data'
      },
      redirect: '/outsource/otherdata/schedule',
      children: [
        {
          path: 'schedule',
          component: () => import('@/views/outsource/otherdata/Schedule'),
          name: 'Schedule',
          meta: { title: '业务排程明细' }
        },
        {
          path: 'summary',
          component: () => import('@/views/outsource/otherdata/Summary'),
          name: 'Summary',
          meta: { title: '业务排程汇总' }
        }
      ]
    }
  ]
}

export default outsourceRouter
