<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="140px">
              <template v-slot="scope">
                {{scope.row.add_time | dataFormat}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList:[],  //总数据
      total:0       //总条数
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      
      if(res.meta.status !== 200){
          return this.$message.error('获取商品列表失败')
      }
    //   this.$message.success("获取商品列表成功")
      this.goodsList=res.data.goods;
      this.total=res.data.total;
    },
    goAddpage(){
        this.$router.push({
            path:'/goods/add'
        })
    }
  },
};
</script>

<style scoped>
</style>