<template>
    <div>
      <h1>物业账单管理</h1>
      <button @click="showAddBillModal">添加账单</button>

      <!-- 添加账单模态框 -->
      <div v-if="showAddModal" class="modal">
        <div class="modal-content">
          <h2>添加账单</h2>
          <form @submit.prevent="submitNewBill">
            <div>
              <label for="owner">业主：</label>
              <input type="text" v-model="newBill.owner" id="owner" placeholder="请输入业主姓名" required />
            </div>
            <div>
              <label for="amount">金额：</label>
              <input type="number" v-model="newBill.amount" id="amount" placeholder="请输入金额" min="0" required />
            </div>
            <div>
              <label for="status">状态：</label>
              <select v-model="newBill.status" id="status" required>
                <option value="未缴费">未缴费</option>
                <option value="已缴费">已缴费</option>
              </select>
            </div>

            <!-- 费用项部分 -->
            <div>
              <button type="button" @click="addPaymentDetail">添加费用项</button>
              <div v-for="(detail, index) in newBill.paymentDetails" :key="index" class="payment-detail">
                <input v-model="detail.itemName" placeholder="费用项名称" required />
                <input type="number" v-model="detail.amount" placeholder="金额" min="0" required />
                <button type="button" @click="removePaymentDetail(index)">删除</button>
              </div>
            </div>

            <div>
              <button type="button" @click="closeAddModal">取消</button>
              <button type="submit">提交</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 账单列表 -->
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>业主</th>
                    <th>金额</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>更新时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="bill in bills" :key="bill.id">
                    <td>{{ bill.id }}</td>
                    <td>{{ bill.owner }}</td>
                    <td>{{ bill.amount }}</td>
                    <td>{{ bill.status }}</td>
                    <td>{{ bill.createdAt }}</td>
                    <td>{{ bill.updatedAt }}</td>
                    <td>
                        <button @click="editBill(bill.id)">修改</button>
                        <button @click="deleteBill(bill.id)">删除</button>
                        <button @click="viewDetail(bill.id)">查看详情</button>
                    </td>
                </tr>
            </tbody>
        </table>


    </div>
  </template>

  <script>
  import axios from '../utils/axios';

  export default {

    data() {
      return {
        bills: [],
        showAddModal: false, // 控制添加账单模态框的显示与隐藏
        newBill: {
          owner: '',
          amount: 0,
          status: '未缴费',
          paymentDetails: [], // 存储费用项
        },
      };
    },
    methods: {
        // 获取账单列表
        async fetchBills() {
          try {
            const response = await axios.get('/bills/list');
            if (response.data.code === 1) {
              this.bills = response.data.data;
            } else {
              alert(response.data.msg || '获取账单失败');
            }
          } catch (error) {
            console.error('Failed to fetch bills:', error);
          }
        },

        // 显示添加账单模态框
        showAddBillModal() {
          this.showAddModal = true;
          this.resetNewBill(); // 重置账单表单
        },

        // 关闭添加账单模态框
        closeAddModal() {
          this.showAddModal = false;
        },

        // 重置添加账单表单
        resetNewBill() {
          this.newBill = {
            owner: '',
            amount: 0,
            status: '未缴费',
            paymentDetails: [],
          };
        },

        // 添加费用项
        addPaymentDetail() {
          this.newBill.paymentDetails.push({ itemName: '', amount: 0 });
        },

        // 删除费用项
        removePaymentDetail(index) {
          this.newBill.paymentDetails.splice(index, 1);
        },

        // 提交新账单
        // async submitNewBill() {
        //   try {
        //     const response = await axios.post('/bills/add', { bill: this.newBill }, {
        //       headers: { 'Content-Type': 'application/json' },
        //     });
        //     if (response.data.code === 1) {
        //       alert('账单添加成功');
        //       this.fetchBills(); // 刷新账单列表
        //       this.closeAddModal(); // 关闭模态框
        //     } else {
        //       alert(response.data.msg || '账单添加失败');
        //     }
        //   } catch (error) {
        //     console.error('Failed to add bill:', error);
        //     alert('账单添加失败，请稍后再试');
        //   }
        // },
        async submitNewBill() {
          try {
            const response = await axios.post('/bills/add', this.newBill, {
              headers: { 'Content-Type': 'application/json' },
            });
            if (response.data.code === 1) {
              alert('账单添加成功');
              this.fetchBills(); // 刷新账单列表
              this.closeAddModal(); // 关闭模态框
            } else {
              alert(response.data.msg || '账单添加失败');
            }
          } catch (error) {
            console.error('Failed to add bill:', error);
            alert('账单添加失败，请稍后再试');
          }
        },

        viewDetail(billId) {
            this.$router.push(`/payment-detail/${billId}`); // 跳转到缴费详情页面
        },

        // 删除账单
        async deleteBill(id) {
            if (!confirm("确定删除该账单吗？")) return;
            try {
                const response = await axios.delete(`/bills/delete/${id}`);
                if (response.data.code === 1) {
                    alert("删除成功");
                    this.fetchBills(); // 重新获取列表
                    } else {
                    alert(response.data.msg || "删除失败");
                }
            } catch (error) {
                console.error("Failed to delete bill:", error);
            }
        },

        editBill(billId) {
          this.$router.push(`/edit-bill/${billId}`);
        },
    },

    mounted() {
      this.fetchBills(); // 页面加载时获取账单
    },
  };
  </script>

  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  /* 简单模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
  </style>
