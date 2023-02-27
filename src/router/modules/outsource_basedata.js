// 外包相关
import Layout from '@/layout'

const outsourceBaseDataRouter = {
  path: '/basedata',
  component: Layout,
  redirect: '/longconfig/ledctdata',
  alwaysShow: true,
  name: 'OutsourceBaseData',
  meta: {
    title: '外包基本数据',
    icon: 'el-icon-s-data',
    roles: ['admin', 'common']
  },
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
      path: 'factoryType',
      component: () => import('@/views/outsource/basedata/FactoryType'),
      name: 'FactoryType',
      meta: {
        title: '厂别表',
        roles: ['admin', 'common']
      }
    }
  ]
}

export default outsourceBaseDataRouter
