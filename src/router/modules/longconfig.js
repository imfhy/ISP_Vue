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
    roles: ['admin', 'common']
  },
  children: [
    {
      path: 'ledctdata',
      component: () => import('@/views/longconfig/LEDCTData'),
      name: 'LEDCTData',
      meta: {
        title: 'LED经验数据',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'mp1addlinedata',
      component: () => import('@/views/longconfig/MP1AddLineData'),
      name: 'MP1AddLineData',
      meta: {
        title: 'MP1补线表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'notmp1addlinedata',
      component: () => import('@/views/longconfig/NotMP1AddLineData'),
      name: 'NotMP1AddLineData',
      meta: {
        title: '非MP1补线表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'exchangelinedata',
      component: () => import('@/views/longconfig/ExchangeLineData'),
      name: 'ExchangeLineData',
      meta: {
        title: '交换线别表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'linedata',
      component: () => import('@/views/longconfig/LineData'),
      name: 'LineData',
      meta: {
        title: '产线配置表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'capacitychangedata',
      component: () => import('@/views/longconfig/CapacityChangeData'),
      name: 'CapacityChangeData',
      meta: {
        title: '产能变化表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'optimizedmachinedata',
      component: () => import('@/views/longconfig/OptimizedMachineData'),
      name: 'OptimizedMachineData',
      meta: {
        title: '优化机种表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'setupdata',
      component: () => import('@/views/longconfig/SetUpData'),
      name: 'SetUpData',
      meta: {
        title: '切换表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'processdata',
      component: () => import('@/views/longconfig/ProcessData'),
      name: 'ProcessData',
      meta: {
        title: '制程配置表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'keyboardlinedata',
      component: () => import('@/views/longconfig/KeyBoardLineData'),
      name: 'KeyBoardLineData',
      meta: {
        title: '按键板表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'earlyduedateboard8',
      component: () => import('@/views/longconfig/EarlyDueDateBoard8'),
      name: 'EarlyDueDateBoard8',
      meta: {
        title: '提早交期板号表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'changelinedata',
      component: () => import('@/views/longconfig/ChangeLineData'),
      name: 'ChangeLineData',
      meta: {
        title: '线体变化表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'pairedsmtmachinedata',
      component: () => import('@/views/longconfig/PairedSMTMachineData'),
      name: 'PairedSMTMachineData',
      meta: {
        title: '配套板表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'keyboardspecialmodel',
      component: () => import('@/views/longconfig/KeyBoardSpecialModel'),
      name: 'KeyBoardSpecialModel',
      meta: {
        title: '小板特殊机种表',
        roles: ['admin', 'common']
      }
    }
  ]
}

export default longconfigRouter
