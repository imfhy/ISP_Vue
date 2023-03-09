// 每日配置
import Layout from '@/layout'

const DayConfigRouter = {
  path: '/DayConfig',
  component: Layout,
  redirect: '/DayConfig/BlockTimeData',
  alwaysShow: true,
  name: 'DayConfig',
  meta: {
    title: '每日配置',
    icon: 'el-icon-setting',
    roles: ['admin', 'common', 'program']
  },
  children: [
    {
      path: 'BlockTimeData',
      component: () => import('@/views/DayConfig/BlockTimeData'),
      name: 'BlockTimeData',
      meta: {
        title: '维护时间表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'packholiday',
      component: () => import('@/views/DayConfig/PackHoliday'),
      name: 'PackHoliday',
      meta: {
        title: '包装线放假表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'programdata',
      component: () => import('@/views/DayConfig/ProgramData'),
      name: 'ProgramData',
      meta: {
        title: '程序表',
        roles: ['admin', 'common', 'program']
      }
    },
    {
      path: 'ProductionReportData',
      component: () => import('@/views/DayConfig/ProductionReportData'),
      name: 'ProductionReportData',
      meta: {
        title: '生产报表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'NoProgramData',
      component: () => import('@/views/DayConfig/NoProgramData'),
      name: 'NoProgramData',
      meta: {
        title: '无程序清单表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'NetworkBoard',
      component: () => import('@/views/DayConfig/NetworkBoard'),
      name: 'NetworkBoard',
      meta: {
        title: '网板信息表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'TestProgramData',
      component: () => import('@/views/DayConfig/TestProgramData'),
      name: 'TestProgramData',
      meta: {
        title: '试跑程序表',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'ProductProgramData',
      component: () => import('@/views/DayConfig/ProductProgramData'),
      name: 'ProductProgramData',
      meta: {
        title: '量产程序表',
        roles: ['admin', 'common']
      }
    }
  ]
}

export default DayConfigRouter
