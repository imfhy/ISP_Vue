// 外包相关
import Layout from '@/layout'
// 外包基本数据
const OutsourceConstraintsRouter = {
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
      component: () => import('@/views/Outsource/Constraints/ModelNameRestrictions'),
      name: 'ModelNameRestrictions',
      meta: {
        title: 'AI/SMT组件优先分配',
        roles: ['admin', 'common']
      }
    },
    {
      path: 'capacity',
      component: () => import('@/views/Outsource/Constraints/Capacity'),
      name: 'Capacity',
      meta: {
        title: '产能限制',
        roles: ['admin', 'common']
      }
    }
  ]
}

export default OutsourceConstraintsRouter
