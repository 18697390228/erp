// 工业生产与销售 ERP 管理系统 - 核心业务与交互逻辑

// 1. 初始化系统时区及模拟时间运行机制
let simulatedTime = new Date("2026-07-02T14:09:24");

function startSystemClock() {
  const clockEl = document.getElementById("system-time");
  if (!clockEl) return;
  
  setInterval(() => {
    simulatedTime.setSeconds(simulatedTime.getSeconds() + 1);
    
    // 格式化输出为 YYYY-MM-DD HH:MM:SS
    const year = simulatedTime.getFullYear();
    const month = String(simulatedTime.getMonth() + 1).padStart(2, '0');
    const day = String(simulatedTime.getDate()).padStart(2, '0');
    const hours = String(simulatedTime.getHours()).padStart(2, '0');
    const minutes = String(simulatedTime.getMinutes()).padStart(2, '0');
    const seconds = String(simulatedTime.getSeconds()).padStart(2, '0');
    
    clockEl.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }, 1000);
}

// 2. 模拟数据库配置与 LocalStorage 存取
const DB_VERSION = "ERP_V1.0";
const DB_KEYS = {
  SUPPLIERS: `erp_suppliers_${DB_VERSION}`,
  CUSTOMERS: `erp_customers_${DB_VERSION}`,
  RAW_MATERIALS: `erp_raw_materials_${DB_VERSION}`,
  FINISHED_GOODS: `erp_finished_goods_${DB_VERSION}`,
  BOM: `erp_bom_${DB_VERSION}`,
  RM_BATCHES: `erp_rm_batches_${DB_VERSION}`,
  FG_BATCHES: `erp_fg_batches_${DB_VERSION}`,
  PRODUCTION_ORDERS: `erp_production_orders_${DB_VERSION}`,
  SALES_ORDERS: `erp_sales_orders_${DB_VERSION}`,
  LOGS: `erp_activity_logs_${DB_VERSION}`
};

// 默认演示数据
const DEFAULT_SUPPLIERS = [
  { id: 'S001', name: '首钢集团有限公司', contact: '张经理', phone: '13901001234' },
  { id: 'S002', name: '中铝有色金属销售公司', contact: '李主任', phone: '13811005678' },
  { id: 'S003', name: '远东电缆制造股份公司', contact: '王经理', phone: '13622009876' },
  { id: 'S004', name: '海达橡胶密封件有限公司', contact: '赵工', phone: '13533001122' }
];

const DEFAULT_CUSTOMERS = [
  { id: 'C001', name: '国家电网华能电力集团', contact: '刘总', phone: '18910002000' },
  { id: 'C002', name: '中国石化工程建设公司', contact: '陈处长', phone: '18600003000' },
  { id: 'C003', name: '三一重工机械制造分厂', contact: '吴经理', phone: '18511112222' }
];

const DEFAULT_RAW_MATERIALS = [
  { id: 'RM001', code: 'RM-STEEL-10', name: '螺纹钢材', spec: 'Φ10mm Q235', unit: 'kg', safeStock: 500, shelf: 'A-01-02' },
  { id: 'RM002', code: 'RM-ALUM-6061', name: '铝型合金板', spec: '6061-T6 5mm', unit: 'kg', safeStock: 300, shelf: 'B-02-04' },
  { id: 'RM003', code: 'RM-COPPER-25', name: '无氧铜导线', spec: '2.5mm² 软线', unit: 'm', safeStock: 1000, shelf: 'C-01-01' },
  { id: 'RM004', code: 'RM-SEAL-50', name: '氟橡胶密封圈', spec: 'Φ50*3.1', unit: 'pcs', safeStock: 800, shelf: 'D-03-12' }
];

const DEFAULT_FINISHED_GOODS = [
  { id: 'FG001', code: 'FG-VALVE-50', name: '气动工业阀门', spec: 'DN50 高压型', unit: 'pcs', safeStock: 50, shelf: 'E-01-01' },
  { id: 'FG002', code: 'FG-CABINET-4030', name: '智能变频电控箱', spec: '400*300*200', unit: 'pcs', safeStock: 20, shelf: 'F-02-01' }
];

const DEFAULT_BOM = [
  { id: 'BOM001', finishedGoodId: 'FG001', items: [
      { rawMaterialId: 'RM001', ratio: 5.0 }, // 生产 1 个阀门消耗 5kg 钢材
      { rawMaterialId: 'RM004', ratio: 2.0 }  // 生产 1 个阀门消耗 2 个密封圈
    ]
  },
  { id: 'BOM002', finishedGoodId: 'FG002', items: [
      { rawMaterialId: 'RM002', ratio: 3.0 }, // 生产 1 个电控箱消耗 3kg 铝板
      { rawMaterialId: 'RM003', ratio: 12.0 } // 生产 1 个电控箱消耗 12m 铜导线
    ]
  }
];

const DEFAULT_RM_BATCHES = [
  { batchNo: 'PUR-20260601-001', rawMaterialId: 'RM001', qty: 200, originalQty: 1000, price: 5.2, supplierId: 'S001', date: '2026-06-01' },
  { batchNo: 'PUR-20260615-001', rawMaterialId: 'RM001', qty: 600, originalQty: 1000, price: 5.5, supplierId: 'S001', date: '2026-06-15' },
  { batchNo: 'PUR-20260602-001', rawMaterialId: 'RM002', qty: 150, originalQty: 500, price: 18.0, supplierId: 'S002', date: '2026-06-02' },
  { batchNo: 'PUR-20260618-001', rawMaterialId: 'RM002', qty: 250, originalQty: 500, price: 18.5, supplierId: 'S002', date: '2026-06-18' },
  { batchNo: 'PUR-20260605-001', rawMaterialId: 'RM003', qty: 1200, originalQty: 2000, price: 62.0, supplierId: 'S003', date: '2026-06-05' },
  { batchNo: 'PUR-20260610-001', rawMaterialId: 'RM004', qty: 900, originalQty: 3000, price: 1.2, supplierId: 'S004', date: '2026-06-10' }
];

const DEFAULT_FG_BATCHES = [
  {
    batchNo: 'MFG-20260620-001',
    finishedGoodId: 'FG001',
    qty: 15,
    originalQty: 30,
    costPrice: 28.4, // (5 * 5.2) + (2 * 1.2) = 26 + 2.4 = 28.4
    date: '2026-06-20',
    materialsConsumed: [
      { rawMaterialId: 'RM001', rawMaterialBatchNo: 'PUR-20260601-001', qty: 150 },
      { rawMaterialId: 'RM004', rawMaterialBatchNo: 'PUR-20260610-001', qty: 60 }
    ]
  },
  {
    batchNo: 'MFG-20260625-001',
    finishedGoodId: 'FG002',
    qty: 10,
    originalQty: 10,
    costPrice: 798.0, // (3 * 18.0) + (12 * 62.0) = 54 + 744 = 798.0
    date: '2026-06-25',
    materialsConsumed: [
      { rawMaterialId: 'RM002', rawMaterialBatchNo: 'PUR-20260602-001', qty: 30 },
      { rawMaterialId: 'RM003', rawMaterialBatchNo: 'PUR-20260605-001', qty: 120 }
    ]
  }
];

const DEFAULT_PRODUCTION_ORDERS = [
  { id: 'WO-20260620-001', finishedGoodId: 'FG001', qty: 30, status: 'completed', date: '2026-06-20' },
  { id: 'WO-20260625-001', finishedGoodId: 'FG002', qty: 10, status: 'completed', date: '2026-06-25' },
  { id: 'WO-20260701-001', finishedGoodId: 'FG001', qty: 25, status: 'producing', date: '2026-07-01' },
  { id: 'WO-20260702-001', finishedGoodId: 'FG002', qty: 5, status: 'pending', date: '2026-07-02' }
];

const DEFAULT_SALES_ORDERS = [
  {
    id: 'SAL-20260628-001',
    customerName: '国家电网华能电力集团',
    finishedGoodId: 'FG001',
    qty: 15,
    price: 120.0,
    totalAmount: 1800.0,
    cost: 426.0, // 15 * 28.4
    profit: 1374.0,
    date: '2026-06-28',
    itemsDeducted: [
      { finishedGoodBatchNo: 'MFG-20260620-001', qty: 15 }
    ]
  }
];

const DEFAULT_LOGS = [
  { time: '2026-07-02 09:30:15', type: 'system', message: '系统初始化成功，已加载演示数据集。' },
  { time: '2026-07-02 10:15:22', type: 'procure', message: '历史采购入库单已导入，自动划分批次记录。' },
  { time: '2026-07-02 11:00:00', type: 'manufacture', message: '工单 WO-20260701-001 状态变更为：加工中。' }
];

// 数据库读取工具
function getDb(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error("读取 LocalStorage 错误", e);
    return defaultVal;
  }
}

// 数据库写入工具
function setDb(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("写入 LocalStorage 错误", e);
  }
}

// 系统全局状态机
let state = {
  suppliers: [],
  customers: [],
  rawMaterials: [],
  finishedGoods: [],
  bomList: [],
  rawMaterialBatches: [],
  finishedGoodBatches: [],
  productionOrders: [],
  salesOrders: [],
  logs: [],
  currentView: 'dashboard',
  inventoryTab: 'raw' // 'raw' | 'finished'
};

// 系统初始化加载
function initSystem(forceReset = false) {
  if (forceReset || !localStorage.getItem(DB_KEYS.SUPPLIERS)) {
    setDb(DB_KEYS.SUPPLIERS, DEFAULT_SUPPLIERS);
    setDb(DB_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    setDb(DB_KEYS.RAW_MATERIALS, DEFAULT_RAW_MATERIALS);
    setDb(DB_KEYS.FINISHED_GOODS, DEFAULT_FINISHED_GOODS);
    setDb(DB_KEYS.BOM, DEFAULT_BOM);
    setDb(DB_KEYS.RM_BATCHES, DEFAULT_RM_BATCHES);
    setDb(DB_KEYS.FG_BATCHES, DEFAULT_FG_BATCHES);
    setDb(DB_KEYS.PRODUCTION_ORDERS, DEFAULT_PRODUCTION_ORDERS);
    setDb(DB_KEYS.SALES_ORDERS, DEFAULT_SALES_ORDERS);
    setDb(DB_KEYS.LOGS, DEFAULT_LOGS);
    if (forceReset) {
      logActivity('system', '用户重置了系统数据，已重新恢复为演示数据。');
    }
  }

  // 装载至内存状态中
  state.suppliers = getDb(DB_KEYS.SUPPLIERS, []);
  state.customers = getDb(DB_KEYS.CUSTOMERS, []);
  state.rawMaterials = getDb(DB_KEYS.RAW_MATERIALS, []);
  state.finishedGoods = getDb(DB_KEYS.FINISHED_GOODS, []);
  state.bomList = getDb(DB_KEYS.BOM, []);
  state.rawMaterialBatches = getDb(DB_KEYS.RM_BATCHES, []);
  state.finishedGoodBatches = getDb(DB_KEYS.FG_BATCHES, []);
  state.productionOrders = getDb(DB_KEYS.PRODUCTION_ORDERS, []);
  state.salesOrders = getDb(DB_KEYS.SALES_ORDERS, []);
  state.logs = getDb(DB_KEYS.LOGS, []);
}

// 保存当前内存状态到本地
function saveState(keysToSave = Object.keys(DB_KEYS)) {
  keysToSave.forEach(k => {
    const keyString = k.toLowerCase().replace(/_/g, '');
    let matchedDbKey = null;
    let data = null;

    if (keyString.includes('supplier')) { matchedDbKey = DB_KEYS.SUPPLIERS; data = state.suppliers; }
    else if (keyString.includes('customer')) { matchedDbKey = DB_KEYS.CUSTOMERS; data = state.customers; }
    else if (keyString.includes('rawmaterial')) { matchedDbKey = DB_KEYS.RAW_MATERIALS; data = state.rawMaterials; }
    else if (keyString.includes('finishedgoods')) { matchedDbKey = DB_KEYS.FINISHED_GOODS; data = state.finishedGoods; }
    else if (keyString.includes('bom')) { matchedDbKey = DB_KEYS.BOM; data = state.bomList; }
    else if (keyString.includes('rmbatch')) { matchedDbKey = DB_KEYS.RM_BATCHES; data = state.rawMaterialBatches; }
    else if (keyString.includes('fgbatch')) { matchedDbKey = DB_KEYS.FG_BATCHES; data = state.finishedGoodBatches; }
    else if (keyString.includes('productionorder')) { matchedDbKey = DB_KEYS.PRODUCTION_ORDERS; data = state.productionOrders; }
    else if (keyString.includes('salesorder')) { matchedDbKey = DB_KEYS.SALES_ORDERS; data = state.salesOrders; }
    else if (keyString.includes('log')) { matchedDbKey = DB_KEYS.LOGS; data = state.logs; }

    if (matchedDbKey && data) {
      setDb(matchedDbKey, data);
    }
  });
}

// 记录运行日志
function logActivity(type, message) {
  const now = new Date(simulatedTime);
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  state.logs.unshift({ time: timeStr, type, message });
  if (state.logs.length > 50) state.logs.pop(); // 限制 50 条
  saveState(['logs']);
}

// 3. 通用辅助函数
function getTodayDateInputString() {
  const y = simulatedTime.getFullYear();
  const m = String(simulatedTime.getMonth() + 1).padStart(2, '0');
  const d = String(simulatedTime.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 生成批次号格式: PREFIX-YYYYMMDD-XXX
function generateBatchNo(prefix, dateStr) {
  const datePart = dateStr.replace(/-/g, ''); // "20260702"
  let dbArray = [];
  let idField = 'batchNo';

  if (prefix === 'PUR') { dbArray = state.rawMaterialBatches; }
  else if (prefix === 'MFG') { dbArray = state.finishedGoodBatches; }
  else if (prefix === 'WO') { dbArray = state.productionOrders; idField = 'id'; }
  else if (prefix === 'SAL') { dbArray = state.salesOrders; idField = 'id'; }

  const matchingPrefix = `${prefix}-${datePart}-`;
  let maxSerial = 0;

  dbArray.forEach(item => {
    const val = item[idField];
    if (val && val.startsWith(matchingPrefix)) {
      const serialPart = val.substring(matchingPrefix.length);
      const serial = parseInt(serialPart, 10);
      if (!isNaN(serial) && serial > maxSerial) {
        maxSerial = serial;
      }
    }
  });

  const nextSerial = String(maxSerial + 1).padStart(3, '0');
  return `${prefix}-${datePart}-${nextSerial}`;
}

// 4. UI 视图导航与弹窗控制
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = btn.getAttribute('data-view');
      switchView(targetView);
    });
  });

  // 重置数据按钮
  document.getElementById('btn-reset-db').addEventListener('click', () => {
    if (confirm("您确定要重置所有本地数据库吗？这将清空您录入的所有新数据！")) {
      initSystem(true);
      switchView('dashboard');
    }
  });
}

function switchView(viewName) {
  state.currentView = viewName;
  
  // 切换 CSS active 状态
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-view') === viewName) {
      btn.classList.add('active-nav', 'text-white', 'bg-slate-800');
      btn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-800/50');
    } else {
      btn.classList.remove('active-nav', 'text-white', 'bg-slate-800');
      btn.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-800/50');
    }
  });

  // 隐藏所有面板，展示目标面板
  document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
  const activePanel = document.getElementById(`view-${viewName}`);
  if (activePanel) activePanel.classList.remove('hidden');

  // 修改顶部标题
  const titleMap = {
    dashboard: '数据工作台',
    procurement: '原料采购管理',
    inventory: '库存仓储看板',
    manufacturing: '生产加工与 BOM',
    sales: '销售订单与利润'
  };
  document.getElementById('header-view-title').textContent = titleMap[viewName] || 'ERP系统';

  // 触发各个页面的独立渲染函数
  renderApp();
}

function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('modal-active');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('modal-active');
  }
}

// 5. 核心渲染函数
function renderApp() {
  updateGlobalStats();
  
  if (state.currentView === 'dashboard') {
    renderDashboardView();
  } else if (state.currentView === 'procurement') {
    renderProcurementView();
  } else if (state.currentView === 'inventory') {
    renderInventoryView();
  } else if (state.currentView === 'manufacturing') {
    renderManufacturingView();
  } else if (state.currentView === 'sales') {
    renderSalesView();
  }
}

// 5.1 数据面板统计更新
function updateGlobalStats() {
  // 原料类目数
  document.getElementById('stat-raw-materials-count').textContent = state.rawMaterials.length;
  
  // 待加工工单
  const pendingOrders = state.productionOrders.filter(o => o.status === 'pending').length;
  document.getElementById('stat-pending-orders-count').textContent = pendingOrders;
  
  // 今日销售额与利润
  const today = getTodayDateInputString();
  let todaySalesSum = 0;
  let todayProfitSum = 0;
  
  state.salesOrders.forEach(order => {
    if (order.date === today) {
      todaySalesSum += order.totalAmount;
      todayProfitSum += order.profit;
    }
  });

  document.getElementById('stat-today-sales').textContent = `￥${todaySalesSum.toFixed(2)}`;
  document.getElementById('stat-today-profit').textContent = `￥${todayProfitSum.toFixed(2)}`;
}

// 5.2 数据工作台渲染
function renderDashboardView() {
  const warningsTbody = document.getElementById('dashboard-warnings-tbody');
  warningsTbody.innerHTML = '';
  
  let warningCount = 0;

  // 1. 扫描原料库存
  state.rawMaterials.forEach(rm => {
    // 汇总此原料的所有批次库存
    const currentStock = state.rawMaterialBatches
      .filter(b => b.rawMaterialId === rm.id)
      .reduce((sum, b) => sum + b.qty, 0);

    if (currentStock <= rm.safeStock) {
      warningCount++;
      const tr = document.createElement('tr');
      tr.className = "row-warning hover:bg-red-100/50 transition";
      tr.innerHTML = `
        <td class="py-2.5 px-4 font-semibold text-slate-500">原料</td>
        <td class="py-2.5 px-4 font-mono font-bold">${rm.code}</td>
        <td class="py-2.5 px-4 font-medium">${rm.name}</td>
        <td class="py-2.5 px-4 text-slate-500">${rm.spec}</td>
        <td class="py-2.5 px-4 text-right font-bold text-red-600">${currentStock} ${rm.unit}</td>
        <td class="py-2.5 px-4 text-right text-slate-500">${rm.safeStock} ${rm.unit}</td>
        <td class="py-2.5 px-4 text-center">
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">库存紧张</span>
        </td>
      `;
      warningsTbody.appendChild(tr);
    }
  });

  // 2. 扫描成品库存
  state.finishedGoods.forEach(fg => {
    const currentStock = state.finishedGoodBatches
      .filter(b => b.finishedGoodId === fg.id)
      .reduce((sum, b) => sum + b.qty, 0);

    if (currentStock <= fg.safeStock) {
      warningCount++;
      const tr = document.createElement('tr');
      tr.className = "row-warning hover:bg-red-100/50 transition";
      tr.innerHTML = `
        <td class="py-2.5 px-4 font-semibold text-primary-600">成品</td>
        <td class="py-2.5 px-4 font-mono font-bold">${fg.code}</td>
        <td class="py-2.5 px-4 font-medium">${fg.name}</td>
        <td class="py-2.5 px-4 text-slate-500">${fg.spec}</td>
        <td class="py-2.5 px-4 text-right font-bold text-red-600">${currentStock} ${fg.unit}</td>
        <td class="py-2.5 px-4 text-right text-slate-500">${fg.safeStock} ${fg.unit}</td>
        <td class="py-2.5 px-4 text-center">
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">库存紧张</span>
        </td>
      `;
      warningsTbody.appendChild(tr);
    }
  });

  if (warningCount === 0) {
    warningsTbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400">
          <i class="fa-regular fa-face-smile text-2xl mb-2 block"></i>
          当前所有原料与成品库存状态良好，无安全预警。
        </td>
      </tr>
    `;
  }

  document.getElementById('dashboard-warning-count').textContent = `${warningCount} 项预警`;

  // 3. 渲染实时系统日志
  const logContainer = document.getElementById('dashboard-activity-log');
  logContainer.innerHTML = '';
  
  if (state.logs.length === 0) {
    logContainer.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">无历史运行日志。</p>`;
  } else {
    state.logs.forEach(log => {
      let icon = '<i class="fa-solid fa-info text-blue-500"></i>';
      let bg = 'bg-blue-50';
      if (log.type === 'procure') { icon = '<i class="fa-solid fa-truck-ramp-box text-emerald-500"></i>'; bg = 'bg-emerald-50'; }
      else if (log.type === 'manufacture') { icon = '<i class="fa-solid fa-gears text-purple-500"></i>'; bg = 'bg-purple-50'; }
      else if (log.type === 'sales') { icon = '<i class="fa-solid fa-basket-shopping text-amber-500"></i>'; bg = 'bg-amber-50'; }
      else if (log.type === 'system') { icon = '<i class="fa-solid fa-shield-halved text-indigo-500"></i>'; bg = 'bg-indigo-50'; }

      const logEl = document.createElement('div');
      logEl.className = "flex items-start space-x-3 p-2.5 rounded-lg hover:bg-slate-100 transition text-xs";
      logEl.innerHTML = `
        <div class="p-1.5 ${bg} rounded-md flex-shrink-0">${icon}</div>
        <div class="flex-1 min-w-0">
          <p class="text-slate-800 font-medium break-words">${log.message}</p>
          <span class="text-[10px] text-slate-400 block mt-0.5">${log.time}</span>
        </div>
      `;
      logContainer.appendChild(logEl);
    });
  }
}

// 5.3 原料采购管理渲染与逻辑
let procureRowIndex = 0;

function renderProcurementView() {
  // 1. 初始化供应商下拉列表
  const supplierSelect = document.getElementById('procure-supplier');
  const filterSupplierSelect = document.getElementById('filter-procure-supplier');
  
  const savedSupplierValue = supplierSelect.value;
  const savedFilterValue = filterSupplierSelect.value;

  supplierSelect.innerHTML = '<option value="">-- 请选择供应商 --</option>';
  filterSupplierSelect.innerHTML = '<option value="">-- 所有供应商 --</option>';

  state.suppliers.forEach(s => {
    supplierSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    filterSupplierSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
  });

  supplierSelect.value = savedSupplierValue;
  filterSupplierSelect.value = savedFilterValue;

  // 2. 初始化采购入库单日期 (默认今天)
  const dateInput = document.getElementById('procure-date');
  if (!dateInput.value) {
    dateInput.value = getTodayDateInputString();
  }

  // 3. 重绘动态明细列表 (如果列表为空，则初始化一行)
  const tbody = document.getElementById('procure-items-tbody');
  if (tbody.children.length === 0) {
    addProcurementRow();
  }

  // 4. 渲染历史记录表
  renderProcurementHistory();
}

function addProcurementRow() {
  const tbody = document.getElementById('procure-items-tbody');
  const index = procureRowIndex++;
  
  const tr = document.createElement('tr');
  tr.id = `procure-row-${index}`;
  tr.className = "hover:bg-slate-50/50 transition";
  
  // 生成原料选项
  let materialOptions = `<option value="">-- 选择入库原料 --</option>`;
  state.rawMaterials.forEach(rm => {
    materialOptions += `<option value="${rm.id}">${rm.name} (${rm.spec})</option>`;
  });

  tr.innerHTML = `
    <td class="py-2 px-4">
      <select class="item-select w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 border" required>
        ${materialOptions}
      </select>
    </td>
    <td class="py-2 px-4">
      <input type="number" min="0.01" step="0.01" placeholder="单价" class="item-price w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 border" required>
    </td>
    <td class="py-2 px-4">
      <div class="flex items-center space-x-1">
        <input type="number" min="1" step="1" placeholder="数量" class="item-qty w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 border" required>
        <span class="item-unit text-xs text-slate-400 w-8">--</span>
      </div>
    </td>
    <td class="py-2 px-4 text-right font-semibold text-slate-700 item-subtotal">￥0.00</td>
    <td class="py-2 px-4 text-center">
      <button type="button" onclick="removeProcurementRow(${index})" class="text-red-500 hover:text-red-700 transition">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);

  // 绑定输入事件监听器
  const select = tr.querySelector('.item-select');
  const priceInput = tr.querySelector('.item-price');
  const qtyInput = tr.querySelector('.item-qty');
  const unitSpan = tr.querySelector('.item-unit');

  select.addEventListener('change', () => {
    const rm = state.rawMaterials.find(m => m.id === select.value);
    unitSpan.textContent = rm ? rm.unit : '--';
    calculateProcureTotal();
  });

  priceInput.addEventListener('input', calculateProcureTotal);
  qtyInput.addEventListener('input', calculateProcureTotal);
}

function removeProcurementRow(index) {
  const tbody = document.getElementById('procure-items-tbody');
  // 如果仅剩一行，不允许删除，而是重置
  if (tbody.children.length <= 1) {
    alert("采购单必须包含至少一行原料项目。");
    return;
  }
  const row = document.getElementById(`procure-row-${index}`);
  if (row) {
    row.remove();
    calculateProcureTotal();
  }
}

function calculateProcureTotal() {
  let grandTotal = 0;
  document.querySelectorAll('#procure-items-tbody tr').forEach(row => {
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const subtotal = price * qty;
    grandTotal += subtotal;
    row.querySelector('.item-subtotal').textContent = `￥${subtotal.toFixed(2)}`;
  });
  document.getElementById('procure-total-amount').textContent = `￥${grandTotal.toFixed(2)}`;
}

function renderProcurementHistory() {
  const filterSupplier = document.getElementById('filter-procure-supplier').value;
  const filterSearch = document.getElementById('filter-procure-search').value.trim().toLowerCase();
  
  const historyTbody = document.getElementById('procure-history-tbody');
  historyTbody.innerHTML = '';

  // 由于原料采购直接体现在原料批次入库单上，我们将 batches 倒序排列展示
  let displayList = [...state.rawMaterialBatches].sort((a, b) => new Date(b.date) - new Date(a.date));

  // 过滤供应商
  if (filterSupplier) {
    displayList = displayList.filter(b => b.supplierId === filterSupplier);
  }

  // 过滤关键字
  if (filterSearch) {
    displayList = displayList.filter(b => {
      const rm = state.rawMaterials.find(m => m.id === b.rawMaterialId);
      const supplier = state.suppliers.find(s => s.id === b.supplierId);
      
      const rmName = rm ? rm.name.toLowerCase() : '';
      const supplierName = supplier ? supplier.name.toLowerCase() : '';
      
      return b.batchNo.toLowerCase().includes(filterSearch) || 
             rmName.includes(filterSearch) || 
             supplierName.includes(filterSearch);
    });
  }

  if (displayList.length === 0) {
    historyTbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-6 text-center text-slate-400">没有查找到符合条件的采购入库记录。</td>
      </tr>
    `;
    return;
  }

  displayList.forEach(batch => {
    const rm = state.rawMaterials.find(m => m.id === batch.rawMaterialId) || { name: '未知', spec: '--', unit: '' };
    const supplier = state.suppliers.find(s => s.id === batch.supplierId) || { name: '未知' };
    const total = batch.price * batch.originalQty;

    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="py-3 px-4 text-xs font-semibold text-slate-500">${batch.date}</td>
      <td class="py-3 px-4 font-mono font-semibold text-slate-700 text-xs">${batch.batchNo}</td>
      <td class="py-3 px-4 font-medium text-slate-800">${supplier.name}</td>
      <td class="py-3 px-4 font-semibold text-primary-800">${rm.name}</td>
      <td class="py-3 px-4 text-slate-500">${rm.spec}</td>
      <td class="py-3 px-4 text-right">￥${batch.price.toFixed(2)}</td>
      <td class="py-3 px-4 text-right">${batch.originalQty} ${rm.unit}</td>
      <td class="py-3 px-4 text-right font-bold text-slate-900">￥${total.toFixed(2)}</td>
    `;
    historyTbody.appendChild(tr);
  });
}

// 采购单提交
document.getElementById('form-procurement').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const supplierId = document.getElementById('procure-supplier').value;
  const dateVal = document.getElementById('procure-date').value;
  
  if (!supplierId || !dateVal) {
    alert("请正确填写供应商和入库日期！");
    return;
  }

  const rows = document.querySelectorAll('#procure-items-tbody tr');
  if (rows.length === 0) {
    alert("请录入入库原料明细！");
    return;
  }

  let hasEmpty = false;
  let itemsAdded = [];

  rows.forEach(row => {
    const select = row.querySelector('.item-select');
    const priceVal = parseFloat(row.querySelector('.item-price').value);
    const qtyVal = parseFloat(row.querySelector('.item-qty').value);

    if (!select.value || isNaN(priceVal) || isNaN(qtyVal) || priceVal <= 0 || qtyVal <= 0) {
      hasEmpty = true;
      return;
    }

    itemsAdded.push({
      rawMaterialId: select.value,
      price: priceVal,
      qty: qtyVal
    });
  });

  if (hasEmpty) {
    alert("每一行数据必须正确选择原料，且采购单价和采购数量必须大于零！");
    return;
  }

  // 写入采购批次
  const supplier = state.suppliers.find(s => s.id === supplierId);
  
  itemsAdded.forEach(item => {
    const batchNo = generateBatchNo('PUR', dateVal);
    const rm = state.rawMaterials.find(m => m.id === item.rawMaterialId);

    // 拼入原料批次库
    state.rawMaterialBatches.push({
      batchNo: batchNo,
      rawMaterialId: item.rawMaterialId,
      qty: item.qty,
      originalQty: item.qty,
      price: item.price,
      supplierId: supplierId,
      date: dateVal
    });

    logActivity('procure', `采购入库：供应商【${supplier.name}】交付批次号【${batchNo}】，入库原料【${rm.name}】共计 ${item.qty} ${rm.unit}。`);
  });

  saveState(['rmbatches']);
  
  // 重置表单
  document.getElementById('form-procurement').reset();
  document.getElementById('procure-items-tbody').innerHTML = '';
  procureRowIndex = 0;
  addProcurementRow();
  calculateProcureTotal();
  
  // 重新渲染视图
  renderProcurementView();
  alert("采购入库成功，批次库存已自动注入库中！");
});

// 5.4 库存看板渲染与下钻追溯逻辑
function renderInventoryView() {
  const tabRaw = document.getElementById('tab-inv-raw');
  const tabFinished = document.getElementById('tab-inv-finished');
  const panelRaw = document.getElementById('panel-inv-raw');
  const panelFinished = document.getElementById('panel-inv-finished');

  if (state.inventoryTab === 'raw') {
    tabRaw.className = "px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg shadow-sm";
    tabFinished.className = "px-5 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-lg";
    panelRaw.classList.remove('hidden');
    panelFinished.classList.add('hidden');
    renderRawInventoryTable();
  } else {
    tabFinished.className = "px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg shadow-sm";
    tabRaw.className = "px-5 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-lg";
    panelFinished.classList.remove('hidden');
    panelRaw.classList.add('hidden');
    renderFinishedInventoryTable();
  }
}

// 切换仓储标签
document.getElementById('tab-inv-raw').addEventListener('click', () => {
  state.inventoryTab = 'raw';
  hideElement('raw-batches-subpanel');
  renderInventoryView();
});
document.getElementById('tab-inv-finished').addEventListener('click', () => {
  state.inventoryTab = 'finished';
  hideElement('finished-batches-subpanel');
  renderInventoryView();
});

function renderRawInventoryTable() {
  const tbody = document.getElementById('inventory-raw-tbody');
  tbody.innerHTML = '';

  state.rawMaterials.forEach(rm => {
    const totalQty = state.rawMaterialBatches
      .filter(b => b.rawMaterialId === rm.id)
      .reduce((sum, b) => sum + b.qty, 0);

    const isWarning = totalQty <= rm.safeStock;
    const tr = document.createElement('tr');
    tr.className = isWarning ? "row-warning hover:bg-red-100/50 transition" : "hover:bg-slate-50 transition";
    
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-xs ${isWarning ? 'row-warning-text' : 'text-slate-700'}">${rm.code}</td>
      <td class="py-3 px-4 font-medium ${isWarning ? 'row-warning-text' : 'text-slate-800'}">${rm.name}</td>
      <td class="py-3 px-4 text-slate-500">${rm.spec}</td>
      <td class="py-3 px-4 text-slate-500">${rm.unit}</td>
      <td class="py-3 px-4 text-right font-bold ${isWarning ? 'text-red-600' : 'text-slate-900'}">${totalQty}</td>
      <td class="py-3 px-4 text-right text-slate-400">${rm.safeStock}</td>
      <td class="py-3 px-4 text-center">
        ${isWarning ? 
          '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">低于安全线</span>' : 
          '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">库存充足</span>'
        }
      </td>
      <td class="py-3 px-4 text-slate-500 text-xs">${rm.shelf}</td>
      <td class="py-3 px-4 text-center">
        <button onclick="showRawBatches('${rm.id}')" class="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center justify-center mx-auto">
          <i class="fa-solid fa-list mr-1"></i> 查看批次
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function showRawBatches(rmId) {
  const rm = state.rawMaterials.find(m => m.id === rmId);
  if (!rm) return;

  const subpanel = document.getElementById('raw-batches-subpanel');
  subpanel.classList.remove('hidden');
  
  document.getElementById('trace-raw-material-name').textContent = `${rm.name} (${rm.spec})`;

  const tbody = document.getElementById('raw-batches-tbody');
  tbody.innerHTML = '';

  const batches = state.rawMaterialBatches
    .filter(b => b.rawMaterialId === rmId)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // 顺序列出，以便看清先进先出次序

  if (batches.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-4 text-center text-slate-400">当前没有处于可用状态的采购批次库存。</td>
      </tr>
    `;
    return;
  }

  batches.forEach(b => {
    const s = state.suppliers.find(sp => sp.id === b.supplierId) || { name: '内部调整' };
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-100 transition";
    tr.innerHTML = `
      <td class="py-2.5 px-4 font-mono text-xs text-slate-700">${b.batchNo}</td>
      <td class="py-2.5 px-4 text-xs">${b.date}</td>
      <td class="py-2.5 px-4 text-right">${b.originalQty} ${rm.unit}</td>
      <td class="py-2.5 px-4 text-right font-bold ${b.qty === 0 ? 'text-slate-300' : 'text-slate-800'}">${b.qty} ${rm.unit}</td>
      <td class="py-2.5 px-4 text-right">￥${b.price.toFixed(2)}</td>
      <td class="py-2.5 px-4 text-slate-500">${s.name}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderFinishedInventoryTable() {
  const tbody = document.getElementById('inventory-finished-tbody');
  tbody.innerHTML = '';

  state.finishedGoods.forEach(fg => {
    const totalQty = state.finishedGoodBatches
      .filter(b => b.finishedGoodId === fg.id)
      .reduce((sum, b) => sum + b.qty, 0);

    const isWarning = totalQty <= fg.safeStock;
    const tr = document.createElement('tr');
    tr.className = isWarning ? "row-warning hover:bg-red-100/50 transition" : "hover:bg-slate-50 transition";
    
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-xs ${isWarning ? 'row-warning-text' : 'text-slate-700'}">${fg.code}</td>
      <td class="py-3 px-4 font-medium ${isWarning ? 'row-warning-text' : 'text-slate-800'}">${fg.name}</td>
      <td class="py-3 px-4 text-slate-500">${fg.spec}</td>
      <td class="py-3 px-4 text-slate-500">${fg.unit}</td>
      <td class="py-3 px-4 text-right font-bold ${isWarning ? 'text-red-600' : 'text-slate-900'}">${totalQty}</td>
      <td class="py-3 px-4 text-right text-slate-400">${fg.safeStock}</td>
      <td class="py-3 px-4 text-center">
        ${isWarning ? 
          '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">低于安全线</span>' : 
          '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">库存充足</span>'
        }
      </td>
      <td class="py-3 px-4 text-slate-500 text-xs">${fg.shelf}</td>
      <td class="py-3 px-4 text-center">
        <button onclick="showFinishedBatches('${fg.id}')" class="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center justify-center mx-auto">
          <i class="fa-solid fa-list mr-1"></i> 查看批次
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function showFinishedBatches(fgId) {
  const fg = state.finishedGoods.find(g => g.id === fgId);
  if (!fg) return;

  const subpanel = document.getElementById('finished-batches-subpanel');
  subpanel.classList.remove('hidden');

  document.getElementById('trace-finished-product-name').textContent = `${fg.name} (${fg.spec})`;

  const tbody = document.getElementById('finished-batches-tbody');
  tbody.innerHTML = '';

  const batches = state.finishedGoodBatches
    .filter(b => b.finishedGoodId === fgId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (batches.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-4 text-center text-slate-400">当前没有处于可用状态的完工批次库存。</td>
      </tr>
    `;
    return;
  }

  batches.forEach(b => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-100 transition";
    tr.innerHTML = `
      <td class="py-2.5 px-4 font-mono text-xs text-slate-700">${b.batchNo}</td>
      <td class="py-2.5 px-4 text-xs">${b.date}</td>
      <td class="py-2.5 px-4 text-right">${b.originalQty} ${fg.unit}</td>
      <td class="py-2.5 px-4 text-right font-bold ${b.qty === 0 ? 'text-slate-300' : 'text-slate-800'}">${b.qty} ${fg.unit}</td>
      <td class="py-2.5 px-4 text-right">￥${b.costPrice.toFixed(2)}</td>
      <td class="py-2.5 px-4 text-center">
        <button onclick="drillDownTrace('${b.batchNo}')" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium border border-emerald-200">
          <i class="fa-solid fa-route"></i> 质量溯源
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 工业双向质量下钻溯源逻辑
function drillDownTrace(batchNo) {
  const batch = state.finishedGoodBatches.find(b => b.batchNo === batchNo);
  if (!batch) {
    alert("未找到该成品批次信息！");
    return;
  }

  const fg = state.finishedGoods.find(g => g.id === batch.finishedGoodId);
  if (!fg) return;

  // 1. 填充基础追溯卡
  document.getElementById('trace-modal-batch-no').textContent = batch.batchNo;
  document.getElementById('trace-modal-finished-name').textContent = `${fg.name} (${fg.spec})`;
  document.getElementById('trace-modal-date').textContent = batch.date;
  document.getElementById('trace-modal-qty').textContent = `${batch.qty} ${fg.unit} (初始完工 ${batch.originalQty} ${fg.unit})`;

  // 2. 渲染耗用原料详情
  const tbody = document.getElementById('trace-modal-materials-tbody');
  tbody.innerHTML = '';

  let suppliersUsed = new Set();
  let materialListHtml = [];

  if (!batch.materialsConsumed || batch.materialsConsumed.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-4 text-center text-slate-400">该历史批次在初始化时未绑定详细原料追溯数据。</td>
      </tr>
    `;
    document.getElementById('flow-suppliers').textContent = "初次数据录入";
    document.getElementById('flow-materials').textContent = "未定义追溯";
  } else {
    batch.materialsConsumed.forEach(consumed => {
      const rm = state.rawMaterials.find(m => m.id === consumed.rawMaterialId) || { name: '未知原料', spec: '--', unit: '' };
      
      // 根据原料批次号查找供应商信息
      const rmBatch = state.rawMaterialBatches.find(rb => rb.batchNo === consumed.rawMaterialBatchNo);
      let supplierName = "内部盘点";
      let priceVal = 0;

      if (rmBatch) {
        priceVal = rmBatch.price;
        const supplierObj = state.suppliers.find(sp => sp.id === rmBatch.supplierId);
        if (supplierObj) {
          supplierName = supplierObj.name;
          suppliersUsed.add(supplierObj.name);
        }
      }

      materialListHtml.push(rm.name);

      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-50 transition";
      tr.innerHTML = `
        <td class="py-2 px-3 font-semibold text-slate-800">${rm.name}</td>
        <td class="py-2 px-3 text-slate-500">${rm.spec}</td>
        <td class="py-2 px-3 font-mono text-slate-600">${consumed.rawMaterialBatchNo}</td>
        <td class="py-2 px-3 text-right font-semibold text-slate-700">${consumed.qty} ${rm.unit}</td>
        <td class="py-2 px-3 text-right">￥${priceVal.toFixed(2)}</td>
        <td class="py-2 px-3 text-slate-600">${supplierName}</td>
      `;
      tbody.appendChild(tr);
    });

    // 3. 更新可视化图谱字段
    document.getElementById('flow-suppliers').textContent = suppliersUsed.size > 0 ? Array.from(suppliersUsed).join('、') : "内部仓库";
    document.getElementById('flow-materials').textContent = materialListHtml.join('、');
  }
  document.getElementById('flow-finished').textContent = `${fg.name}批次: ${batch.batchNo}`;

  showModal('modal-drilldown');
}

// 5.5 生产加工与 BOM 联动渲染与核心控制
function renderManufacturingView() {
  // 1. 初始化成品下拉列表
  const prodFinishedSelect = document.getElementById('prod-finished-good');
  const savedFinishedValue = prodFinishedSelect.value;
  
  prodFinishedSelect.innerHTML = '<option value="">-- 请选择产出成品 --</option>';
  state.finishedGoods.forEach(fg => {
    prodFinishedSelect.innerHTML += `<option value="${fg.id}">${fg.name} (${fg.spec})</option>`;
  });
  prodFinishedSelect.value = savedFinishedValue;

  // 2. 渲染 BOM 配比展示卡
  renderBomCards();

  // 3. 渲染生产加工日志表格 (并包含安全校验)
  renderProductionOrdersTable();
}

function renderBomCards() {
  const container = document.getElementById('bom-list-container');
  container.innerHTML = '';

  state.bomList.forEach(bom => {
    const fg = state.finishedGoods.find(g => g.id === bom.finishedGoodId);
    if (!fg) return;

    let itemsHtml = '';
    bom.items.forEach(it => {
      const rm = state.rawMaterials.find(m => m.id === it.rawMaterialId) || { name: '未知原料', spec: '', unit: '' };
      itemsHtml += `
        <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
          <span class="font-medium text-slate-700">${rm.name} <span class="text-slate-400 font-normal">(${rm.spec})</span></span>
          <span class="font-mono font-bold text-slate-800">1 : ${it.ratio} ${rm.unit}</span>
        </div>
      `;
    });

    const card = document.createElement('div');
    card.className = "bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col";
    card.innerHTML = `
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
        <div>
          <h4 class="font-semibold text-slate-900">${fg.name}</h4>
          <p class="text-[10px] text-slate-400">${fg.spec}</p>
        </div>
        <span class="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-bold rounded">BOM 方案</span>
      </div>
      <div class="flex-1 space-y-1">
        ${itemsHtml}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderProductionOrdersTable() {
  const tbody = document.getElementById('production-orders-tbody');
  tbody.innerHTML = '';

  // 按状态排序：待加工 -> 加工中 -> 已完工；再按日期倒序
  const statusWeight = { pending: 1, producing: 2, completed: 3 };
  let sortedOrders = [...state.productionOrders].sort((a, b) => {
    if (statusWeight[a.status] !== statusWeight[b.status]) {
      return statusWeight[a.status] - statusWeight[b.status];
    }
    return new Date(b.date) - new Date(a.date);
  });

  if (sortedOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-slate-400">目前没有生产工单记录。</td>
      </tr>
    `;
    return;
  }

  sortedOrders.forEach(order => {
    const fg = state.finishedGoods.find(g => g.id === order.finishedGoodId) || { name: '未知成品', spec: '--', unit: '' };
    
    // 计算原料扣减联动校验 (核心控制逻辑)
    let canProduce = true;
    let warningMessages = [];
    
    if (order.status === 'pending') {
      const bom = state.bomList.find(b => b.finishedGoodId === order.finishedGoodId);
      if (bom) {
        bom.items.forEach(it => {
          const rm = state.rawMaterials.find(m => m.id === it.rawMaterialId);
          if (rm) {
            // 累计此原料在库的总库存
            const totalStock = state.rawMaterialBatches
              .filter(rb => rb.rawMaterialId === it.rawMaterialId)
              .reduce((sum, rb) => sum + rb.qty, 0);

            const needQty = it.ratio * order.qty;
            if (totalStock < needQty) {
              canProduce = false;
              warningMessages.push(`【${rm.name}】缺口：${(needQty - totalStock).toFixed(1)}${rm.unit}`);
            }
          }
        });
      } else {
        canProduce = false;
        warningMessages.push("未配置该成品的 BOM 配比关系");
      }
    }

    let statusBadge = '';
    let actionButtons = '';

    if (order.status === 'pending') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">待加工</span>';
      
      if (canProduce) {
        actionButtons = `
          <button onclick="dispatchProduction('${order.id}')" class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition">
            <i class="fa-solid fa-play mr-1"></i> 下发生产
          </button>
        `;
      } else {
        actionButtons = `
          <div class="flex flex-col space-y-1">
            <button class="bg-slate-200 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-not-allowed" disabled>
              库存不足
            </button>
            <span class="text-[10px] text-red-500 leading-tight">${warningMessages.join('，')}</span>
          </div>
        `;
      }
    } else if (order.status === 'producing') {
      statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 flex items-center justify-center animate-pulse"><span class="w-1 h-1 bg-indigo-500 rounded-full mr-1"></span>加工中</span>';
      actionButtons = `
        <button onclick="completeProduction('${order.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition">
          <i class="fa-solid fa-circle-check mr-1"></i> 确认完工入库
        </button>
      `;
    } else if (order.status === 'completed') {
      statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">已完工</span>';
      actionButtons = `<span class="text-xs text-slate-400">完工批次已自动注入成品库</span>`;
    }

    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono text-xs text-slate-500">${order.id}</td>
      <td class="py-3 px-4 font-semibold text-slate-800">${fg.name}</td>
      <td class="py-3 px-4 text-slate-400 text-xs">${fg.spec}</td>
      <td class="py-3 px-4 text-right font-bold">${order.qty} ${fg.unit}</td>
      <td class="py-3 px-4 text-center">${statusBadge}</td>
      <td class="py-3 px-4 text-slate-500 text-xs">${order.date}</td>
      <td class="py-3 px-4 text-left">${actionButtons}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 下发加工工单
function dispatchProduction(orderId) {
  const order = state.productionOrders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'producing';
  logActivity('manufacture', `工单【${orderId}】下发车间投产，原料已在车间流水线上，处于加工中状态。`);
  saveState(['productionorders']);
  renderManufacturingView();
}

// 核心生产完工扣减逻辑 (完工扣料 - 原料先进先出 (FIFO))
function completeProduction(orderId) {
  const order = state.productionOrders.find(o => o.id === orderId);
  if (!order || order.status !== 'producing') return;

  const bom = state.bomList.find(b => b.finishedGoodId === order.finishedGoodId);
  if (!bom) {
    alert("该成品未配置 BOM，无法进行扣料。");
    return;
  }

  // 1. 第二次安全拦截校验 (防止处于加工中期间，库存被强行售卖)
  let missing = [];
  bom.items.forEach(it => {
    const rm = state.rawMaterials.find(m => m.id === it.rawMaterialId);
    if (rm) {
      const totalStock = state.rawMaterialBatches
        .filter(rb => rb.rawMaterialId === it.rawMaterialId)
        .reduce((sum, rb) => sum + rb.qty, 0);

      const needQty = it.ratio * order.qty;
      if (totalStock < needQty) {
        missing.push(`【${rm.name}】缺口：${(needQty - totalStock).toFixed(1)}${rm.unit}`);
      }
    }
  });

  if (missing.length > 0) {
    alert("扣料失败！由于期间库存变更，目前原料库存不足，请先补货采购：\n" + missing.join("\n"));
    return;
  }

  // 2. 依次应用 FIFO 规则扣减原料批次，并计算本次加工所得真实成本
  let totalMaterialCost = 0;
  let materialsConsumedList = [];

  bom.items.forEach(it => {
    let needQty = it.ratio * order.qty;
    
    // 获取当前原料所有可用库存批次，按入库日期最早的排序 (FIFO)
    let batches = state.rawMaterialBatches
      .filter(b => b.rawMaterialId === it.rawMaterialId && b.qty > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    for (let batch of batches) {
      if (needQty <= 0) break;
      const take = Math.min(batch.qty, needQty);
      
      batch.qty -= take; // 扣减此批次的库存剩余量
      needQty -= take;
      totalMaterialCost += take * batch.price; // 累加材料成本

      materialsConsumedList.push({
        rawMaterialId: it.rawMaterialId,
        rawMaterialBatchNo: batch.batchNo,
        qty: take
      });
    }
  });

  // 计算成品平均加工成本 (单位成本)
  const unitCostPrice = totalMaterialCost / order.qty;
  const fgBatchNo = generateBatchNo('MFG', getTodayDateInputString());
  const fg = state.finishedGoods.find(g => g.id === order.finishedGoodId);

  // 3. 增加成品库存批次
  state.finishedGoodBatches.push({
    batchNo: fgBatchNo,
    finishedGoodId: order.finishedGoodId,
    qty: order.qty,
    originalQty: order.qty,
    costPrice: unitCostPrice,
    date: getTodayDateInputString(),
    materialsConsumed: materialsConsumedList
  });

  // 4. 更新工单状态为已完工
  order.status = 'completed';
  order.materialsConsumed = materialsConsumedList;

  logActivity('manufacture', `工单【${orderId}】确认完工。FIFO 原料扣料扣减成功；新增成品入库批次【${fgBatchNo}】，产出【${fg.name}】 ${order.qty} ${fg.unit}，计算结转单位材料成本为：￥${unitCostPrice.toFixed(2)}/pcs。`);

  saveState(['rmbatches', 'fgbatches', 'productionorders']);
  renderManufacturingView();
  alert(`工单完工成功！已新增成品批次：${fgBatchNo}\n生成成品单位成本：￥${unitCostPrice.toFixed(2)}/pcs`);
}

// 生产工单创建表单提交
document.getElementById('form-production').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const finishedGoodId = document.getElementById('prod-finished-good').value;
  const qty = parseInt(document.getElementById('prod-qty').value, 10);

  if (!finishedGoodId || isNaN(qty) || qty <= 0) {
    alert("请正确选择成品和加工数量！");
    return;
  }

  const orderId = generateBatchNo('WO', getTodayDateInputString());
  
  state.productionOrders.push({
    id: orderId,
    finishedGoodId: finishedGoodId,
    qty: qty,
    status: 'pending',
    date: getTodayDateInputString()
  });

  const fg = state.finishedGoods.find(g => g.id === finishedGoodId);
  logActivity('manufacture', `录入待加工工单：创建工单【${orderId}】，计划生产成品【${fg.name}】共计 ${qty} ${fg.unit}。`);

  saveState(['productionorders']);
  document.getElementById('form-production').reset();
  renderManufacturingView();
});

// 5.6 销售订单渲染与 FIFO 出库联动
function renderSalesView() {
  // 1. 初始化客户和成品下拉列表
  const customerSelect = document.getElementById('sales-customer');
  const finishedGoodSelect = document.getElementById('sales-finished-good');
  
  const savedCustomerValue = customerSelect.value;
  const savedFinishedValue = finishedGoodSelect.value;

  customerSelect.innerHTML = '<option value="">-- 选择客户 --</option>';
  state.customers.forEach(c => {
    customerSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
  customerSelect.value = savedCustomerValue;

  finishedGoodSelect.innerHTML = '<option value="">-- 选择要销售的成品 --</option>';
  state.finishedGoods.forEach(fg => {
    finishedGoodSelect.innerHTML += `<option value="${fg.id}">${fg.name} (${fg.spec})</option>`;
  });
  finishedGoodSelect.value = savedFinishedValue;

  // 2. 绑定销售订单实时联动验证逻辑
  const qtyInput = document.getElementById('sales-qty');
  const priceInput = document.getElementById('sales-price');

  // 取消旧的监听以避免多重绑定，直接重新赋值
  qtyInput.oninput = validateSalesEstimation;
  priceInput.oninput = validateSalesEstimation;
  finishedGoodSelect.onchange = () => {
    const fgId = finishedGoodSelect.value;
    const fg = state.finishedGoods.find(g => g.id === fgId);
    if (fg) {
      // 默认售价建议 (阀门 120，电控箱 1500)
      priceInput.value = fgId === 'FG001' ? 120 : 1500;
    } else {
      priceInput.value = '';
    }
    validateSalesEstimation();
  };

  // 3. 渲染历史销售报表
  renderSalesHistoryTable();
}

function validateSalesEstimation() {
  const fgId = document.getElementById('sales-finished-good').value;
  const qty = parseInt(document.getElementById('sales-qty').value, 10) || 0;
  const price = parseFloat(document.getElementById('sales-price').value) || 0;

  const estPanel = document.getElementById('sales-est-panel');
  const estStock = document.getElementById('sales-est-stock');
  const estTotal = document.getElementById('sales-est-total');
  const errorMsg = document.getElementById('sales-error-msg');
  const submitBtn = document.getElementById('btn-sales-submit');

  if (!fgId) {
    estPanel.classList.add('hidden');
    return;
  }

  estPanel.classList.remove('hidden');

  // 获取成品总在库量
  const totalStock = state.finishedGoodBatches
    .filter(b => b.finishedGoodId === fgId)
    .reduce((sum, b) => sum + b.qty, 0);

  const fg = state.finishedGoods.find(g => g.id === fgId);
  estStock.textContent = `${totalStock} ${fg.unit}`;
  
  const estimatedAmount = qty * price;
  estTotal.textContent = `￥${estimatedAmount.toFixed(2)}`;

  if (qty <= 0) {
    errorMsg.innerHTML = '';
    submitBtn.disabled = false;
    submitBtn.classList.remove('bg-slate-300', 'cursor-not-allowed');
    submitBtn.classList.add('bg-primary-600', 'hover:bg-primary-700');
  } else if (qty > totalStock) {
    errorMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> 无法发货！成品总库存不足，缺口：${qty - totalStock} ${fg.unit}`;
    submitBtn.disabled = true;
    submitBtn.classList.remove('bg-primary-600', 'hover:bg-primary-700');
    submitBtn.classList.add('bg-slate-300', 'cursor-not-allowed');
  } else {
    errorMsg.innerHTML = `<span class="text-emerald-600"><i class="fa-solid fa-circle-check mr-1"></i> 库存充足，销售满足出库条件。</span>`;
    submitBtn.disabled = false;
    submitBtn.classList.remove('bg-slate-300', 'cursor-not-allowed');
    submitBtn.classList.add('bg-primary-600', 'hover:bg-primary-700');
  }
}

// 核心销售发货 FIFO 扣减逻辑与利润结算
document.getElementById('form-sales').addEventListener('submit', (e) => {
  e.preventDefault();

  const customerId = document.getElementById('sales-customer').value;
  const fgId = document.getElementById('sales-finished-good').value;
  const price = parseFloat(document.getElementById('sales-price').value);
  const qty = parseInt(document.getElementById('sales-qty').value, 10);

  if (!customerId || !fgId || isNaN(price) || isNaN(qty) || price <= 0 || qty <= 0) {
    alert("请正确填写所有销售数据！");
    return;
  }

  // 1. 在库库存量强校验
  const totalStock = state.finishedGoodBatches
    .filter(b => b.finishedGoodId === fgId)
    .reduce((sum, b) => sum + b.qty, 0);

  const fg = state.finishedGoods.find(g => g.id === fgId);

  if (qty > totalStock) {
    alert(`销售发货受阻！【${fg.name}】总库存仅剩 ${totalStock} ${fg.unit}，缺口 ${qty - totalStock} ${fg.unit}。`);
    return;
  }

  // 2. FIFO 规则成品扣料与结转历史成本
  let qtyToDeduct = qty;
  let costOfGoodsSold = 0;
  let batchesDeducted = [];

  // 获取该成品的所有可用批次，入库日期最早的优先 (FIFO)
  let batches = state.finishedGoodBatches
    .filter(b => b.finishedGoodId === fgId && b.qty > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  for (let batch of batches) {
    if (qtyToDeduct <= 0) break;
    const take = Math.min(batch.qty, qtyToDeduct);

    batch.qty -= take; // 扣减成品该批次量
    qtyToDeduct -= take;
    costOfGoodsSold += take * batch.costPrice; // 累加出库成品的完工成本

    batchesDeducted.push({
      finishedGoodBatchNo: batch.batchNo,
      qty: take
    });
  }

  // 3. 计算最终总营业额与净利润
  const totalAmount = qty * price;
  const profit = totalAmount - costOfGoodsSold;
  const salesOrderId = generateBatchNo('SAL', getTodayDateInputString());
  const customer = state.customers.find(c => c.id === customerId);

  // 4. 插入销售订单明细
  state.salesOrders.push({
    id: salesOrderId,
    customerName: customer.name,
    finishedGoodId: fgId,
    qty: qty,
    price: price,
    totalAmount: totalAmount,
    cost: costOfGoodsSold,
    profit: profit,
    date: getTodayDateInputString(),
    itemsDeducted: batchesDeducted
  });

  logActivity('sales', `销售出库：向客户【${customer.name}】销售成品【${fg.name}】 ${qty} ${fg.unit}。订单号【${salesOrderId}】，总售价 ￥${totalAmount.toFixed(2)}，扣减结转成本 ￥${costOfGoodsSold.toFixed(2)}，创造净利润 ￥${profit.toFixed(2)}。`);

  saveState(['fgbatches', 'salesorders']);
  
  // 5. 重置表单并重绘
  document.getElementById('form-sales').reset();
  validateSalesEstimation();
  renderSalesView();
  alert(`销售订单成功生成！\n订单总额: ￥${totalAmount.toFixed(2)}\n扣减 FIFO 完工成本: ￥${costOfGoodsSold.toFixed(2)}\n结算利润: ￥${profit.toFixed(2)}`);
});

function renderSalesHistoryTable() {
  const tbody = document.getElementById('sales-history-tbody');
  tbody.innerHTML = '';

  let sortedSales = [...state.salesOrders].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedSales.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" class="py-6 text-center text-slate-400">目前暂无销售出库历史记录。</td>
      </tr>
    `;
    return;
  }

  sortedSales.forEach(order => {
    const fg = state.finishedGoods.find(g => g.id === order.finishedGoodId) || { name: '未知成品', spec: '--' };
    
    // 获取出库批次号摘要
    const batchSummary = order.itemsDeducted.map(i => `${i.finishedGoodBatchNo}(${i.qty})`).join(', ');

    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono text-xs text-slate-500">${order.id}</td>
      <td class="py-3 px-4 text-slate-500 text-xs">${order.date}</td>
      <td class="py-3 px-4 font-medium text-slate-800">${order.customerName}</td>
      <td class="py-3 px-4 font-semibold text-primary-800">${fg.name}</td>
      <td class="py-3 px-4 text-slate-400 text-xs">${fg.spec}</td>
      <td class="py-3 px-4 text-right">￥${order.price.toFixed(2)}</td>
      <td class="py-3 px-4 text-right font-bold text-slate-800">${order.qty}</td>
      <td class="py-3 px-4 text-right font-semibold text-slate-900">￥${order.totalAmount.toFixed(2)}</td>
      <td class="py-3 px-4 text-right text-slate-500">￥${order.cost.toFixed(2)}</td>
      <td class="py-3 px-4 text-right font-bold text-emerald-600">￥${order.profit.toFixed(2)}</td>
      <td class="py-3 px-4 font-mono text-[10px] text-slate-400">${batchSummary}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 6. 新增模态表单提交处理 (供应商 / 客户 / BOM 设定)
document.getElementById('form-add-supplier').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('supplier-name').value.trim();
  const contact = document.getElementById('supplier-contact').value.trim();
  const phone = document.getElementById('supplier-phone').value.trim();

  if (!name) return;

  const nextId = `S${String(state.suppliers.length + 1).padStart(3, '0')}`;
  
  state.suppliers.push({
    id: nextId,
    name: name,
    contact: contact || '--',
    phone: phone || '--'
  });

  saveState(['suppliers']);
  logActivity('system', `新增供应商档案：【${name}】(编号: ${nextId})。`);
  closeModal('modal-add-supplier');
  document.getElementById('form-add-supplier').reset();
  
  // 刷新采购视图
  if (state.currentView === 'procurement') {
    renderProcurementView();
  }
});

document.getElementById('form-add-customer').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  const contact = document.getElementById('customer-contact').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();

  if (!name) return;

  const nextId = `C${String(state.customers.length + 1).padStart(3, '0')}`;
  
  state.customers.push({
    id: nextId,
    name: name,
    contact: contact || '--',
    phone: phone || '--'
  });

  saveState(['customers']);
  logActivity('system', `新增客户档案：【${name}】(编号: ${nextId})。`);
  closeModal('modal-add-customer');
  document.getElementById('form-add-customer').reset();
  
  // 刷新销售视图
  if (state.currentView === 'sales') {
    renderSalesView();
  }
});

// BOM 设定表单处理
let bomRowIndex = 0;

document.getElementById('btn-bom-add-row').addEventListener('click', addBomRow);

function addBomRow(rmId = '', ratioVal = '') {
  const tbody = document.getElementById('bom-items-tbody');
  const index = bomRowIndex++;

  const tr = document.createElement('tr');
  tr.id = `bom-row-${index}`;
  tr.className = "border-b border-slate-100 hover:bg-slate-50/50 transition";

  let materialOptions = `<option value="">-- 选择所需原料 --</option>`;
  state.rawMaterials.forEach(rm => {
    materialOptions += `<option value="${rm.id}" ${rm.id === rmId ? 'selected' : ''}>${rm.name} (${rm.spec})</option>`;
  });

  tr.innerHTML = `
    <td class="py-2 px-3">
      <select class="bom-item-select w-full rounded-lg border-slate-200 bg-slate-50 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 border" required>
        ${materialOptions}
      </select>
    </td>
    <td class="py-2 px-3">
      <div class="flex items-center space-x-1">
        <input type="number" min="0.001" step="0.001" value="${ratioVal}" placeholder="配比值" class="bom-item-ratio w-full rounded-lg border-slate-200 bg-slate-50 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 border" required>
        <span class="bom-item-unit text-xs text-slate-400 w-8">--</span>
      </div>
    </td>
    <td class="py-2 px-3 text-center">
      <button type="button" onclick="removeBomRow(${index})" class="text-red-500 hover:text-red-700 transition">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);

  const select = tr.querySelector('.bom-item-select');
  const unitSpan = tr.querySelector('.bom-item-unit');

  const updateUnit = () => {
    const rm = state.rawMaterials.find(m => m.id === select.value);
    unitSpan.textContent = rm ? rm.unit : '--';
  };
  
  select.addEventListener('change', updateUnit);
  if (rmId) updateUnit();
}

function removeBomRow(index) {
  const row = document.getElementById(`bom-row-${index}`);
  if (row) row.remove();
}

// 展开配置 BOM 弹窗
document.getElementById('btn-bom-add-row').parentElement.parentElement.parentElement.addEventListener('submit', () => {}); // 避开默认事件

// 重构配置弹窗的展开：动态读取选中成品的已有 BOM
document.getElementById('bom-target-finished-good').addEventListener('change', (e) => {
  const fgId = e.target.value;
  const tbody = document.getElementById('bom-items-tbody');
  tbody.innerHTML = '';
  bomRowIndex = 0;

  if (!fgId) return;

  const bom = state.bomList.find(b => b.finishedGoodId === fgId);
  if (bom) {
    bom.items.forEach(it => {
      addBomRow(it.rawMaterialId, it.ratio);
    });
  } else {
    // 默认加一行空的
    addBomRow();
  }
});

// 重绘 BOM 目标成品下拉
function initBomModalFinishedOptions() {
  const select = document.getElementById('bom-target-finished-good');
  select.innerHTML = '<option value="">-- 选择目标成品 --</option>';
  state.finishedGoods.forEach(fg => {
    select.innerHTML += `<option value="${fg.id}">${fg.name} (${fg.spec})</option>`;
  });
}

// 点击配置 BOM 按钮
document.querySelector('[onclick="showModal(\'modal-edit-bom\')"]').addEventListener('click', () => {
  initBomModalFinishedOptions();
  document.getElementById('bom-target-finished-good').value = '';
  document.getElementById('bom-items-tbody').innerHTML = '';
});

// BOM 设定表单提交
document.getElementById('form-edit-bom').addEventListener('submit', (e) => {
  e.preventDefault();
  const fgId = document.getElementById('bom-target-finished-good').value;
  const rows = document.querySelectorAll('#bom-items-tbody tr');

  if (!fgId) {
    alert("请选择要配置的目标成品！");
    return;
  }

  let items = [];
  let duplicateCheck = new Set();
  let hasError = false;

  rows.forEach(row => {
    const rmId = row.querySelector('.bom-item-select').value;
    const ratio = parseFloat(row.querySelector('.bom-item-ratio').value);

    if (!rmId || isNaN(ratio) || ratio <= 0) {
      hasError = true;
      return;
    }

    if (duplicateCheck.has(rmId)) {
      alert("同一 BOM 配比单中不能出现重复原料！");
      hasError = true;
      return;
    }

    duplicateCheck.add(rmId);
    items.push({ rawMaterialId: rmId, ratio: ratio });
  });

  if (hasError) {
    if (items.length === 0) {
      alert("BOM 必须包含至少一种所需原料配置！");
    } else {
      alert("配置数据不合法，原料配比值必须大于零！");
    }
    return;
  }

  // 写入或更新
  let bom = state.bomList.find(b => b.finishedGoodId === fgId);
  const fg = state.finishedGoods.find(g => g.id === fgId);

  if (bom) {
    bom.items = items;
  } else {
    state.bomList.push({
      id: `BOM${String(state.bomList.length + 1).padStart(3, '0')}`,
      finishedGoodId: fgId,
      items: items
    });
  }

  saveState(['bom']);
  logActivity('system', `修改成品 BOM 配比设定：重新配置了成品【${fg.name}】的物料配比关系。`);
  closeModal('modal-edit-bom');
  renderManufacturingView();
  alert(`成品【${fg.name}】BOM 配比设定成功！`);
});


// 辅助视觉隐藏展示函数
function hideElement(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

// 7. 入口运行
window.addEventListener('DOMContentLoaded', () => {
  initSystem();
  startSystemClock();
  initNavigation();
  
  // 绑定采购页面的供应商联动过滤
  document.getElementById('filter-procure-supplier').addEventListener('change', renderProcurementHistory);
  document.getElementById('filter-procure-search').addEventListener('input', renderProcurementHistory);

  // 添加首个原料明细输入行
  document.getElementById('btn-procure-add-row').addEventListener('click', addProcurementRow);

  // 默认渲染工作台
  switchView('dashboard');
});
