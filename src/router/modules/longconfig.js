// 长期配置
import Layout from '@/layout'

const LongConfigRouter = {
  path: '/LongConfig',
  component: Layout,
  redirect: '/LongConfig/LEDCTData',
  alwaysShow: true,
  name: 'LongConfig',
  meta: {
    title: '长期配置',
    icon: 'el-icon-setting',
    roles: ['admin', 'common']
  },
  children: [
    {
      path: 'LEDCTData',
      component: () => import('@/views/LongConfig/LEDCTData'),
      name: 'LEDCTData',
      meta: {
        title: 'LED经验数据',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'MP1AddLineData',
      component: () => import('@/views/LongConfig/MP1AddLineData'),
      name: 'MP1AddLineData',
      meta: {
        title: 'MP1补线表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'NotMP1AddLineData',
      component: () => import('@/views/LongConfig/NotMP1AddLineData'),
      name: 'NotMP1AddLineData',
      meta: {
        title: '非MP1补线表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'ExchangeLineData',
      component: () => import('@/views/LongConfig/ExchangeLineData'),
      name: 'ExchangeLineData',
      meta: {
        title: '交换线别表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'LineData',
      component: () => import('@/views/LongConfig/LineData'),
      name: 'LineData',
      meta: {
        title: '产线配置表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'CapacityChangeData',
      component: () => import('@/views/LongConfig/CapacityChangeData'),
      name: 'CapacityChangeData',
      meta: {
        title: '产能变化表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'OptimizedMachineData',
      component: () => import('@/views/LongConfig/OptimizedMachineData'),
      name: 'OptimizedMachineData',
      meta: {
        title: '优化机种表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'SetUpData',
      component: () => import('@/views/LongConfig/SetUpData'),
      name: 'SetUpData',
      meta: {
        title: '切换表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'ProcessData',
      component: () => import('@/views/LongConfig/ProcessData'),
      name: 'ProcessData',
      meta: {
        title: '制程配置表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'KeyBoardLineData',
      component: () => import('@/views/LongConfig/KeyBoardLineData'),
      name: 'KeyBoardLineData',
      meta: {
        title: '按键板表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'EarlyDueDateBoard8',
      component: () => import('@/views/LongConfig/EarlyDueDateBoard8'),
      name: 'EarlyDueDateBoard8',
      meta: {
        title: '提早交期板号表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'ChangeLineData',
      component: () => import('@/views/LongConfig/ChangeLineData'),
      name: 'ChangeLineData',
      meta: {
        title: '线体变化表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'PairedSMTMachineData',
      component: () => import('@/views/LongConfig/PairedSMTMachineData'),
      name: 'PairedSMTMachineData',
      meta: {
        title: '配套板表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'KeyBoardSpecialModel',
      component: () => import('@/views/LongConfig/KeyBoardSpecialModel'),
      name: 'KeyBoardSpecialModel',
      meta: {
        title: '小板特殊机种表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'InterfaceConfig',
      component: () => import('@/views/LongConfig/InterfaceConfig'),
      name: 'InterfaceConfig',
      meta: {
        title: '接口配置表',
        roles: ['admin', 'common']
      }
    }
  ]
}

export default LongConfigRouter
