# 工业 ERP 系统详细设计方案

本文档详细描述了系统的数据结构、核心业务规则、状态管理逻辑和交互接口设计，作为前端开发的基准。

## 1. 数据模型与关系

系统完全基于前端运行，所有数据通过 `LocalStorage` 以 JSON 格式持久化。

### 1.1 物料档案 (rawMaterials & finishedGoods)
*   **原料 (RawMaterial)**:
    ```typescript
    interface RawMaterial {
      id: string;          // RM001, RM002...
      code: string;        // 原料编码
      name: string;        // 原料名称
      spec: string;        // 规格型号
      unit: string;        // 计量单位 (e.g., kg, m, pcs)
      safeStock: number;   // 安全库存底线
    }
    ```
*   **成品 (FinishedGood)**:
    ```typescript
    interface FinishedGood {
      id: string;          // FG001, FG002...
      code: string;        // 成品编码
      name: string;        // 成品名称
      spec: string;        // 规格型号
      unit: string;        // 计量单位
      safeStock: number;   // 安全库存底线
    }
    ```

### 1.2 往来单位 (suppliers & customers)
*   **供应商 (Supplier)**: `{ id: string, name: string, contact: string, phone: string }`
*   **客户 (Customer)**: `{ id: string, name: string, contact: string, phone: string }`

### 1.3 物料清单 BOM (bomList)
*   定义生产 1 单位成品所需的原料及其用量。
    ```typescript
    interface BOM {
      id: string;
      finishedGoodId: string;
      items: {
        rawMaterialId: string;
        ratio: number; // 消耗比例 (生产 1 个成品需要的原料数量)
      }[];
    }
    ```

### 1.4 库存批次 (rawMaterialBatches & finishedGoodBatches)
*   **原料库存批次 (RawMaterialBatch)**:
    每次采购入库（或初始化数据）生成一个批次记录，用于 FIFO 扣减和批次追溯。
    ```typescript
    interface RawMaterialBatch {
      batchNo: string;      // PUR-YYYYMMDD-XXX
      rawMaterialId: string;
      qty: number;          // 当前剩余库存数量
      originalQty: number;  // 采购入库时的初始数量
      price: number;        // 采购单价
      supplierId: string;
      date: string;         // 入库日期
    }
    ```
*   **成品库存批次 (FinishedGoodBatch)**:
    每次生产完工生成一个成品批次。需要记录其消耗的原料批次，以满足工业溯源需求。
    ```typescript
    interface FinishedGoodBatch {
      batchNo: string;      // MFG-YYYYMMDD-XXX
      finishedGoodId: string;
      qty: number;          // 当前剩余库存数量
      originalQty: number;  // 完工入库时的初始数量
      costPrice: number;    // 计算得出的成品单位成本
      date: string;         // 完工入库日期
      materialsConsumed: {
        rawMaterialId: string;
        rawMaterialBatchNo: string;
        qty: number;
      }[];
    }
    ```

### 1.5 生产加工工单 (productionOrders)
*   ```typescript
    interface ProductionOrder {
      id: string;           // WO-YYYYMMDD-XXX
      finishedGoodId: string;
      qty: number;          // 计划加工数量
      status: 'pending' | 'producing' | 'completed'; // 待加工 / 加工中 / 已完工
      date: string;         // 创建日期
      materialsConsumed?: { // 完工时记录具体扣减的原料批次
        rawMaterialId: string;
        rawMaterialBatchNo: string;
        qty: number;
      }[];
    }
    ```

### 1.6 销售订单 (salesOrders)
*   ```typescript
    interface SalesOrder {
      id: string;           // SAL-YYYYMMDD-XXX
      customerName: string;
      finishedGoodId: string;
      qty: number;          // 销售数量
      price: number;        // 销售单价
      totalAmount: number;  // 订单总金额
      cost: number;         // 销售成本 (基于 FIFO 扣减的成品批次计算)
      profit: number;       // 订单利润 (totalAmount - cost)
      date: string;
      itemsDeducted: {
        finishedGoodBatchNo: string;
        qty: number;
      }[];
    }
    ```

---

## 2. 核心联动业务规则实现细节

### 2.1 BOM 校验与生产下发拦截
当创建或选定工单准备生产时，系统执行以下规则：
1.  计算该工单成品所需各种原料的**总需求量** = `工单计划数量 * BOM配比比例`。
2.  对每种所需原料，统计其在 `rawMaterialBatches` 中所有批次的可用库存之和（`SUM(qty)`）。
3.  如果“总需求量 > 总可用库存”，则该工单“下发生产”按钮应置灰，并在界面清晰展示：“原料：[原料名称] 库存不足，缺口：[总需求量 - 总可用库存]”。
4.  只有当所有原料库存都满足时，才允许下发生产（工单状态转为“加工中”）。

### 2.2 原料先进先出 (FIFO) 扣减与溯源绑定
当工单点击“确认完工”时：
1.  原料扣减：遍历 BOM 所需物料。对每种原料，计算其需求量。
2.  按照入库日期最早的原则，依次从 `rawMaterialBatches` 中扣减（减少 `qty`），如果前一批次不够扣，则继续扣减下一批次，直到需求量全部扣完。
3.  记录该成品批次实际消耗的**具体原料批次号及对应的消耗量**，生成 `materialsConsumed` 数组。
4.  成品入库：根据消耗的原料批次价格，计算该成品批次的**真实材料成本**：
    $$\text{成品批次单位成本} = \frac{\sum (\text{原料批次扣除数量} \times \text{原料批次单价})}{\text{成品完工数量}}$$
5.  在 `finishedGoodBatches` 中生成新的成品库存批次（批次号格式：`MFG-YYYYMMDD-XXX`），并保存 `materialsConsumed` 信息。
6.  工单状态更新为 `completed`。

### 2.3 成品销售 FIFO 出库与利润核算
当销售订单提交时：
1.  校验库存：统计该成品在 `finishedGoodBatches` 中所有批次的总剩余库存，若总剩余库存 < 销售数量，则拦截并提示“成品库存不足”。
2.  FIFO 出库：按照完工入库日期最早的原则，依次从 `finishedGoodBatches` 中扣减 `qty`。
3.  计算成本：
    $$\text{销售总成本} = \sum (\text{各成品批次扣除数量} \times \text{各成品批次单位成本})$$
4.  结算利润：
    $$\text{销售总额} = \text{销售数量} \times \text{销售单价}$$
    $$\text{订单净利润} = \text{销售总额} - \text{销售总成本}$$
5.  在 `salesOrders` 中记录该笔订单，并更新成品库存。
