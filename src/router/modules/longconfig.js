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
    }
  ]
}

export default longconfigRouter
