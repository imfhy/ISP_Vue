// 预测数据
import Layout from '@/layout'

const predictRouter = {
  path: '/predict',
  component: Layout,
  redirect: '/predict/ledctdata',
  alwaysShow: true,
  name: 'Predict',
  meta: {
    title: '预测数据',
    icon: 'el-icon-coin',
    roles: ['admin', 'common']
  },
  children: [
    {
      path: 'trainleddata',
      component: () => import('@/views/predict/TrainLEDTData'),
      name: 'TrainLEDTData',
      meta: {
        title: 'LED训练数据',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'traindata',
      component: () => import('@/views/predict/TrainData'),
      name: 'TrainData',
      meta: {
        title: '训练数据',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'fixedctdata',
      component: () => import('@/views/predict/FixedCTData'),
      name: 'FixedCTData',
      meta: {
        title: '车间指定CT表',
        roles: ['admin', 'common']
      }
    }
  ]
}

export default predictRouter
