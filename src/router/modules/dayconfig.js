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
    }
  ]
}

export default dayconfigRouter
