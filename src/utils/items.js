// 常用变量

// 所有线体
const LineOptions = [
  { value: 'SM01', label: 'SM01' }, // label为显示值，value为真实值
  { value: 'SM02', label: 'SM02' },
  { value: 'SM03', label: 'SM03' },
  { value: 'SM05', label: 'SM05' },
  { value: 'SM06', label: 'SM06' },
  { value: 'SM07', label: 'SM07' },
  { value: 'SM08', label: 'SM08' },
  { value: 'SM09', label: 'SM09' },
  { value: 'SM11', label: 'SM11' },
  { value: 'SM13', label: 'SM13' },
  { value: 'SM15', label: 'SM15' },
  { value: 'SM19', label: 'SM19' },
  { value: 'SM21', label: 'SM21' },
  { value: 'SM22', label: 'SM22' },
  { value: 'SM23', label: 'SM23' },
  { value: 'SM25', label: 'SM25' },
  { value: 'SR01', label: 'SR01' },
  { value: 'SR02', label: 'SR02' },
  { value: 'SR03', label: 'SR03' },
  { value: 'SR06', label: 'SR06' },
  { value: 'SR09', label: 'SR09' },
  { value: 'ST01', label: 'ST01' }
]
// 制程
const ProcessOptions = [
  { value: 'T', label: 'T' },
  { value: 'S', label: 'S' },
  { value: 'B', label: 'B' },
  { value: 'B-BPR', label: 'B-BPR' },
  { value: 'S-BPR', label: 'S-BPR' },
  { value: 'S-BPR-M', label: 'S-BPR-M' },
  { value: 'S-THR', label: 'S-THR' },
  { value: 'T-BPR', label: 'T-BPR' }
]
// 用户权限
const PermissionOptions = [
  { value: 'admin', label: '超级管理员' },
  { value: 'common', label: '普通管理员' },
  { value: 'program', label: '程序员' }
]
const lineOptions = [
  'SM01', 'SM02', 'SM03', 'SM05', 'SM06', 'SM07', 'SM08', 'SM09', 'SM11', 'SM13',
  'SM15', 'SM19', 'SM21', 'SM22', 'SM23', 'SM25', 'SR01', 'SR02', 'SR03', 'SR06',
  'SR09', 'SM12', 'SM18'
]
const lockedList = ['锁定', '新增锁定', '新上锁定', '插入锁定']
const unLockedList = ['未锁定', '新上排程', '未上排程']
export { LineOptions, ProcessOptions, PermissionOptions, lineOptions, lockedList, unLockedList }
