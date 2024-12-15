<template>
  <div>
    <h1>修改账单</h1>
    <div v-if="bill">
      <label>业主姓名:</label>
      <input v-model="bill.owner" />

      <label>账单金额:</label>
      <input type="number" v-model="bill.amount" />

      <label>状态:</label>
      <select v-model="bill.status">
        <option>未缴费</option>
        <option>已缴费</option>
      </select>

      <h2>费用详情</h2>
      <table>
        <thead>
        <tr>
          <th>费用项</th>
          <th>金额</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(detail, index) in paymentDetails" :key="index">
          <td>
            <input v-model="detail.itemName" />
          </td>
          <td>
            <input type="number" v-model="detail.amount" />
          </td>
          <td>
            <button @click="removeDetail(index)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
      <button @click="addDetail">添加费用项</button>

      <button @click="updateBill">保存修改</button>
    </div>
  </div>
</template>

<script>
import axios from "../utils/axios";

export default {
  data() {
    return {
      bill: null, // 当前账单信息
      paymentDetails: [], // 当前费用详情
    };
  },
  methods: {
    async fetchBillAndDetails() {
      const billId = this.$route.params.billId; // 获取路由参数中的账单ID
      try {
        const response = await axios.get(`/bills/${billId}`);
        if (response.data.code === 1) {
          this.bill = response.data.data.bill;
          this.paymentDetails = response.data.data.paymentDetails;
        } else {
          alert("获取账单数据失败");
        }
      } catch (error) {
        console.error("Error fetching bill and details:", error);
      }
    },
    addDetail() {
      this.paymentDetails.push({ itemName: "", amount: 0 });
    },
    removeDetail(index) {
      this.paymentDetails.splice(index, 1);
    },
    async updateBill() {
      try {
        const requestBody = {
          // bill: this.bill,
          // paymentDetails: this.paymentDetails,
          id: this.bill.id,
          owner: this.bill.owner,
          amount: this.bill.amount,
          status: this.bill.status,
          createdAt: this.bill.createdAt,
          updatedAt: new Date().toISOString(),
          paymentDetails: this.paymentDetails,
        };
        console.log(requestBody);
        const response = await axios.post("/bills/update", requestBody, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.data.code === 1) {
          alert("修改成功！");
          this.$router.push("/bill-management");
        } else {
          alert("修改失败：" + response.data.msg);
        }
      } catch (error) {
        console.error("Error updating bill and details:", error);
      }
    },
  },
  mounted() {
    this.fetchBillAndDetails();
  },
};
</script>
