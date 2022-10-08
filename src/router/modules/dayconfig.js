// 每日配置
import Layout from '@/layout'

const dayconfigRouter = {
  path: '/dayconfig',
  component: Layout,
  redirect: '/dayconfig/blocktimedata',
  alwaysShow: true,
  name: 'DayConfig',
  meta: {
    title: '每日配置',
    icon: 'el-icon-setting',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'blocktimedata',
      component: () => import('@/views/dayconfig/BlockTimeData'),
      name: 'BlockTimeData',
      meta: {
        title: '维护时间表',
        roles: ['admin']
      }
    },
    {
      path: 'packholiday',
      component: () => import('@/views/dayconfig/PackHoliday'),
      name: 'PackHoliday',
      meta: {
        title: '包装线放假表',
        roles: ['admin']
      }
    },
    {
      path: 'programdata',
      component: () => import('@/views/dayconfig/ProgramData'),
      name: 'ProgramData',
      meta: {
        title: '程序表',
        roles: ['admin']
      }
    },
    {
      path: 'productionreportdata',
      component: () => import('@/views/dayconfig/ProductionReportData'),
      name: 'ProductionReportData',
      meta: {
        title: '生产报表',
        roles: ['admin']
      }
    },
    {
      path: 'noprogramdata',
      component: () => import('@/views/dayconfig/NoProgramData'),
      name: 'NoProgramData',
      meta: {
        title: '无程序清单表',
        roles: ['admin']
      }
    },
    {
      path: 'networkboard',
      component: () => import('@/views/dayconfig/NetworkBoard'),
      name: 'NetworkBoard',
      meta: {
        title: '网板信息表',
        roles: ['admin']
      }
    },
    {
      path: 'testprogramdata',
      component: () => import('@/views/dayconfig/TestProgramData'),
      name: 'TestProgramData',
      meta: {
        title: '试跑程序表',
        roles: ['admin']
      }
    },
    {
      path: 'Pproductprogramdata',
      component: () => import('@/views/dayconfig/ProductProgramData'),
      name: 'ProductProgramData',
      meta: {
        title: '量产程序表',
        roles: ['admin']
      }
    }
  ]
}

export default dayconfigRouter
