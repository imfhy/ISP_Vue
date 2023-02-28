// 外包相关
import Layout from '@/layout'
// 外包基本数据
const outsourceConstraintsRouter = {
  path: '/outsourceconstraints',
  component: Layout,
  redirect: '/outsourceconstraints/modelnamerestrictions',
  alwaysShow: true,
  name: 'OutsourceConstraints',
  meta: {
    title: '外包约束数据',
    icon: 'el-icon-s-data',
    roles: ['admin', 'common']
  },
  children: [
    {
      path: 'modelnamerestrictions',
      component: () => import('@/views/outsource/constraints/ModelNameRestrictions'),
      name: 'ModelNameRestrictions',
      meta: {
        title: 'AI/SMT组件优先分配',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'capacity',
      component: () => import('@/views/outsource/constraints/Capacity'),
      name: 'Capacity',
      meta: {
        title: '产能限制',
        roles: ['admin', 'common']
      }
    }
  ]
}

export default outsourceConstraintsRouter
