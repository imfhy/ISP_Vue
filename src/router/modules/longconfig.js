// 长期配置
import Layout from '@/layout'

const longconfigRouter = {
  path: '/longconfig',
  component: Layout,
  redirect: '/longconfig/ledctdata',
  alwaysShow: true,
  name: 'LongConfig',
  meta: {
    title: '长期配置',
    icon: 'el-icon-setting',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'ledctdata',
      component: () => import('@/views/longconfig/LEDCTData'),
      name: 'LEDCTData',
      meta: {
        title: 'LED经验数据',
        roles: ['admin']
      }
    },
    {
      path: 'mp1addlinedata',
      component: () => import('@/views/longconfig/MP1AddLineData'),
      name: 'MP1AddLineData',
      meta: {
        title: 'MP1补线表',
        roles: ['admin']
      }
    },
    {
      path: 'notmp1addlinedata',
      component: () => import('@/views/longconfig/NotMP1AddLineData'),
      name: 'NotMP1AddLineData',
      meta: {
        title: '非MP1补线表',
        roles: ['admin']
      }
    },
    {
      path: 'exchangelinedata',
      component: () => import('@/views/longconfig/ExchangeLineData'),
      name: 'ExchangeLineData',
      meta: {
        title: '交换线别表',
        roles: ['admin']
      }
    },
    {
      path: 'linedata',
      component: () => import('@/views/longconfig/LineData'),
      name: 'LineData',
      meta: {
        title: '产线配置表',
        roles: ['admin']
      }
    },
    {
      path: 'capacitychangedata',
      component: () => import('@/views/longconfig/CapacityChangeData'),
      name: 'CapacityChangeData',
      meta: {
        title: '产能变化表',
        roles: ['admin']
      }
    }
  ]
}

export default longconfigRouter
