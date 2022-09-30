import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'el-icon-s-home', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/schedule',
    component: Layout,
    redirect: '/schedule/control',
    alwaysShow: true,
    name: 'Schedule',
    meta: {
      title: '排程模块',
      icon: 'component',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'control',
        component: () => import('@/views/schedule/Control'),
        name: 'Control',
        meta: {
          title: '控制面板',
          roles: ['admin']
        }
      },
      {
        path: 'onlinetable',
        component: () => import('@/views/schedule/OnlineTable'),
        name: 'OnlineTable',
        meta: {
          title: '在线表格',
          roles: ['admin']
        }
      },
      {
        path: 'config',
        component: () => import('@/views/schedule/Config'),
        name: 'Config',
        meta: {
          title: '参数配置',
          roles: ['admin']
        }
      }
    ]
  },
  {
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
  },
  {
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
  },
  {
    path: '/predict',
    component: Layout,
    redirect: '/predict/ledctdata',
    alwaysShow: true,
    name: 'Predict',
    meta: {
      title: '预测数据',
      icon: 'el-icon-coin',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'trainleddata',
        component: () => import('@/views/predict/TrainLEDTData'),
        name: 'TrainLEDTData',
        meta: {
          title: 'LED训练数据',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '页面权限',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: '指令权限'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '角色权限',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/logging',
    component: Layout,
    redirect: '/logging/loggingdb',
    alwaysShow: true,
    name: 'Logging',
    meta: {
      title: '日志系统',
      icon: 'documentation',
      roles: ['admin']
    },
    children: [
      {
        path: 'loggingdb',
        component: () => import('@/views/logging/Loggingdb'),
        name: 'LoggingDB',
        meta: {
          title: '错误日志',
          roles: ['admin']
        }
      },
      {
        path: 'history',
        component: () => import('@/views/logging/History'),
        name: 'LoggingHistory',
        meta: {
          title: '历史操作'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
