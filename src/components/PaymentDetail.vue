<template>
  <div>
    <h2>缴费详情</h2>
    <div v-if="bill">
      <p><strong>业主:</strong> {{ bill.owner }}</p>
      <p><strong>账单金额:</strong> {{ bill.amount }} 元</p>
      <p><strong>状态:</strong> {{ bill.status }}</p>
      <h3>费用项详情</h3>
      <table>
        <thead>
          <tr>
            <th>费用项</th>
            <th>金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paymentDetails" :key="item.id">
            <td>{{ item.itemName }}</td>
            <td>{{ item.amount }} 元</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button @click="goBack">返回</button>
  </div>
</template>

<script>
import axios from 'axios';
// import { useRoute, useRouter } from 'vue-router';
export default {
  data() {
    return {
      bill: null,
      paymentDetails: [],
    };
  },
  methods: {
    async fetchPaymentDetails() {
      const billId = this.$route.params.billId; // 获取账单ID
      try {
        const response = await axios.get(`/api/bills/${billId}`);
        console.log(response);
        if (response.data.code === 1) {
          this.bill = response.data.data.bill;
          this.paymentDetails = response.data.data.paymentDetails;
        } else {
          
          alert(response.data.msg || "获取账单详情失败");
        }
      } catch (error) {
        console.error('Failed to fetch payment details:', error);
      }
    },
    goBack() {
      this.$router.push('/bill-management'); // 返回账单管理页面
    },
  },
  mounted() {
    this.fetchPaymentDetails();
  },
};
</script>
