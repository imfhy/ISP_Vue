// 预测数据
import Layout from '@/layout'

const PredictRouter = {
  path: '/predict',
  component: Layout,
  redirect: '/predict/trainledtdata',
  alwaysShow: true,
  name: 'Predict',
  meta: {
    title: '预测数据',
    icon: 'el-icon-coin',
    roles: ['admin', 'common']
  },
  children: [
    {
      path: 'trainledtdata',
      component: () => import('@/views/Predict/TrainLEDTData'),
      name: 'TrainLEDTData',
      meta: {
        title: 'LED训练数据',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'traindata',
      component: () => import('@/views/Predict/TrainData'),
      name: 'TrainData',
      meta: {
        title: '训练数据',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'FixedCTData',
      component: () => import('@/views/Predict/FixedCTData'),
      name: 'FixedCTData',
      meta: {
        title: '车间指定CT表',
        roles: ['admin', 'common']
      }
    }
  ]
}

export default PredictRouter
