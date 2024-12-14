<template>
    <div>
      <h1>物业账单管理</h1>
      <!-- 添加账单 -->
      <form @submit.prevent="addBill">
        <input v-model="newBill.owner" placeholder="业主名" required />
        <input v-model.number="newBill.amount" placeholder="金额" required type="number" />
        <select v-model="newBill.status" required>
          <option value="未缴费">未缴费</option>
          <option value="已缴费">已缴费</option>
        </select>
        <button type="submit">添加账单</button>
      </form>
  
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
                        <button @click="editBill(bill)">修改</button>
                        <button @click="deleteBill(bill.id)">删除</button>
                        <button @click="viewDetail(bill.id)">查看详情</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 编辑账单模态框 -->
        <div v-if="showEditModal" class="modal">
        <div class="modal-content">
            <h3>编辑账单</h3>
            <label>业主: <input v-model="editForm.owner" /></label>
            <label>金额: <input v-model="editForm.amount" type="number" /></label>
            <label>状态: <input v-model="editForm.status" /></label>
            <button @click="updateBill">保存</button>
            <button @click="closeEditModal">取消</button>
        </div>
        </div>
    </div>
  </template>
  
  <script>
  import axios from '../utils/axios';
  // import { useRouter } from 'vue-router';
  export default {
    data() {
      return {
        bills: [],
        showEditModal: false, // 是否显示编辑模态框
        newBill: {
          owner: '',
          amount: null,
          status: '未缴费',
        },
      };
    },
    methods: {

        async fetchBills() {
            try {
            const response = await axios.get('/bills/list'); // 获取账单数据
            console.log(response.data); // 打印后端返回的完整数据
            if (response.data.code === 1) { // 检查返回的 code 是否表示成功
                this.bills = response.data.data; // 提取 data 数组
            } else {
                console.error('Failed to fetch bills: ', response.data.msg);
            }
            } catch (error) {
            console.error('Failed to fetch bills:', error);
            }
        },

        viewDetail(billId) {
            this.$router.push(`/payment-detail/${billId}`); // 跳转到缴费详情页面
        },
    
        // 添加账单
        async addBill() {
            try {
            await axios.post('/bills/add', this.newBill);
            this.newBill = { owner: '', amount: null, status: '未缴费' }; // 清空表单
            this.fetchBills(); // 刷新账单列表
            } catch (error) {
            console.error('Failed to add bill:', error);
            }
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


        // 打开编辑模态框
        editBill(bill) {
            this.editForm = { ...bill }; // 将账单信息复制到编辑表单
            this.showEditModal = true;
            // 弹出编辑窗口或者跳转到编辑页面
            console.log("编辑账单：", bill);
        },
        // 关闭模态框
        closeEditModal() {
            this.showEditModal = false;
        },

        // 更新账单
        async updateBill() {
        try {
            const response = await axios.put(`/bills`, this.editForm);
            if (response.data.code === 1) {
            alert("修改成功");
            this.fetchBills(); // 重新获取列表，更新更新时间
            this.closeEditModal();
            } else {
            alert(response.data.msg || "修改失败");
            }
        } catch (error) {
            console.error("Failed to update bill:", error);
        }
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
  