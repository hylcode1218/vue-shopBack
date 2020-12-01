<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形table数据依赖第三方组件 vue-table-tree-grid -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 自定义插槽决定列的渲染 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>

        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类提示框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateTrue"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类的列表 默认为空
      cateList: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //总数据条数
      total: 0,
      //为table指定列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //表示将当前列定义为模板列
          type: "template",
          //模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        //分类名称
        cat_name: "",
        //父级分类id
        cat_pid: 0, //不能为空 0代表添加一级分类
        cat_level: 0, //不能为空 0代表一级分类 1 二级 2 三级
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
      },
      parentCateList: [],
      cascaderProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children'
      },
      //选中的父级分类的数组
      selectedKeys:[]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },

    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    //添加分类
    addCate() {
      this.getParentCateList();  //获得数据 进行渲染
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据列表失败");
      }
      this.parentCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateChange(){
        //一旦级联选择器发生改变  立刻改变父级id
        console.log(this.selectedKeys)
        if(this.selectedKeys.length > 0){
          //父级分类id
          this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]

          //分类等级
          this.addCateForm.cat_level=this.selectedKeys.length
          return 
        }else{
           this.addCateForm.cat_pid=0
           this.addCateForm.cat_level=0
        }

    },
    //确认添加分类
    addCateTrue(){
      //进行表单预验证
      this.$refs.addCateFormRef.validate( async valid=>{
        if(!valid) return 
        const {data:res}=await this.$http.post('categories',this.addCateForm)
        if(res.meta.status !==201){
          return this.$message.error("添加分类失败")
        }
        this.$message.success("添加分类成功")
        this.getCateList()
        this.addCateDialogVisible=false
      })
    },
    //对话框的关闭事件
    addCateDialogClosed(){
      //重置表单 但是级联选择器没有被重置
      this.$refs.addCateFormRef.resetFields();

      //找不到清空级联的方法的时候  要考虑绑定数据与显示级联选择框的关系 把绑定的数据清空
      this.selectedKeys=[]
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0
    }
  },
};
</script>

<style lang="scss" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>