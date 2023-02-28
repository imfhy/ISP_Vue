import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import outsourceBaseDataRouter from './modules/outsource_basedata'
import outsourceConstraintsRouter from './modules/outsource_data'
import dayconfigRouter from './modules/dayconfig'
import longconfigRouter from './modules/longconfig'
import predictRouter from './modules/predict'
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
        component: () => import('@/views/dashboard/Dashboard'),
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
    path: '/schedulepanel',
    component: Layout,
    redirect: '/schedulepanel/control',
    alwaysShow: true,
    name: 'SchedulePanel',
    meta: {
      title: '排程面板',
      icon: 'component',
      roles: ['admin', 'common']
    },
    children: [
      {
        path: 'control',
        component: () => import('@/views/schedulepanel/Control'),
        name: 'Control',
        meta: {
          title: '控制面板',
          roles: ['admin', 'common']
        }
      },
      {
        path: 'onlinetable',
        component: () => import('@/views/schedulepanel/OnlineTable'),
        name: 'OnlineTable',
        meta: {
          title: '在线表格',
          roles: ['admin', 'common']
        }
      },
      {
        path: 'config',
        component: () => import('@/views/schedulepanel/Config'),
        name: 'Config',
        meta: {
          title: '排程配置',
          roles: ['admin', 'common']
        }
      }
    ]
  },

  dayconfigRouter,
  longconfigRouter,
  predictRouter,
  outsourceBaseDataRouter,
  outsourceConstraintsRouter,

  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin']
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/RolePermission'),
        name: 'RolePermission',
        meta: {
          title: '用户权限',
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
      roles: ['admin', 'common']
    },
    children: [
      {
        path: 'loggingdb',
        component: () => import('@/views/logging/Loggingdb'),
        name: 'Loggingdb',
        meta: {
          title: '运行日志',
          roles: ['admin', 'common'],
          noCache: true
        }
      },
      {
        path: 'operahistory',
        component: () => import('@/views/logging/OperaHistory'),
        name: 'OperaHistory',
        meta: {
          title: '历史操作',
          roles: ['admin', 'common'],
          noCache: true
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

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
