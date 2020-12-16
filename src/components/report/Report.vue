<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//引入echarts
export default {
  data() {
    return {};
  },
  async mounted(){
      var echarts = require('echarts');
      //初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));

      const {data:res}=await this.$http.get('reports/type/1')
      if(res.meta.status !== 200){
          return this.$message.console.error("获取折线图失败");
      }

      console.log(res.data)
      //配置和数据项
      var option={}

      myChart.setOption(res.data);
  }
};
</script>

<style scoped>
</style>