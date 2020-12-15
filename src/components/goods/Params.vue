<template>
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            @change="handleChange"
            :props="cateProps"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
          @click="addDialogVisible=true"
            >添加参数</el-button
          >
          <!-- 表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
             <template v-slot="scope">
               <!-- 循环渲染tag标签 -->
              <el-tag v-for="(item,i) in scope.row.attr_val" :key="i" closable>{{item}}</el-tag>
              <!-- .native 修饰符就是用来注册元素的原生事件而不是组件自定义事件的 -->
              <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button 
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
              >+ New Tag</el-button>
             </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="showEditDialog(scope.row.attr_name,scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
           @click="addDialogVisible=true"
            >添加属性</el-button
          >
          <!-- 表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="showEditDialog(scope.row.attr_name,scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      //级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择框双向绑定到的数组
      selectedCateKeys: [],
      //被激活的页签名称
      activeName: "many",
      //动态属性数据
      manyTableData: [],
      //静态属性数据
      onlyTableData: [],
      //控制添加对话框的显示和隐藏
      addDialogVisible:false,
      addForm:{
          attr_name:''
      },
      addFormRules:{
          attr_name:[
              {required:true,message:'请输入参数名称', trigger:'blur'}
          ]
      },
      editDialogVisible:false,
      editForm:{
        attr_name:'',
        attr_id:''
      },
      editFormRules:{
          attr_name:[
              {required:true,message:'请输入参数名称', trigger:'blur'}
          ]
      },
      //控制按钮与文本框的切换显示
      inputVisible:false,
      inputValue:''
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    //如果按钮需要被禁用 则返回true  否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    //当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    //动态计算标题的文本
    titleText(){
        if(this.activeName === 'many'){
            return '动态参数'
        }
        return '静态属性'
    }
  },
  methods: {
    //获得商品分类的所有数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据失败");
      }
      this.catelist = res.data;
    },
    //获取参数的列表数据
    async getParamsDate() {
      if (this.selectedCateKeys.length !== 3) {
        //证明选择的不是三级分类 不让选
        this.selectedCateKeys = [];
        return;
      }

      // 进行数据请求
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      //获得的数据
      res.data.forEach(element => {
        element.attr_val=element.attr_vals?element.attr_vals.split(" "):[];

        //因为绑定了同一个值 所以一变都变 需要绑定不同的值
        //控制文本框的显示与隐藏
        element.inputVisible=false
        //文本框输入的值
        element.inputValue=''
      });
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //级联选择框发生变化 数据的改变
    handleChange() {
      this.getParamsDate();
    },
    //tab页标签点击事件激活函数
    handleTabClick() {
      this.getParamsDate();
    },

    //对话框的关闭事件
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()
    },
    //添加参数
    addParams(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })

        if(res.meta.status !== 201){
          return this.$message.error('添加参数失败')
        }

        this.$message.success("添加参数成功")
        this.addDialogVisible = false
        this.getParamsDate()
      })
    },

    //编辑
    showEditDialog(name,id){
      //应该是通过id进行数据请求的  我是直接拿到了值进行渲染
      this.editForm.attr_name=name
      this.editForm.attr_id=id
      this.editDialogVisible=true
    },
    //重置修改的表单
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editParams(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,
          attr_sel:this.activeName
        })

        if(res.meta.status !== 200){
          return this.$message.error('编辑参数失败')
        }

        this.$message.success("编辑参数成功")
        this.editDialogVisible = false
        this.getParamsDate()
      })
    },
    

    //文本框失去焦点或者按下enter键都会触发的事件
    handleInputConfirm(row){
      if(row.inputValue.trim().length === 0){
        row.inputValue=''
        row.inputVisible=false
        return
      }

      row.attr_val.push(row.inputValue.trim())
      row.inputValue=''
      row.inputVisible=false
    },
    showInput(row){
      row.inputVisible=true
      //让文本框自动获取焦点
      // $nextTick  方法的作用 就是当页面上元素被重新渲染之后 才会指定回调函数中的代码
      this.$nextTick(()=>{
        //直接打印  input还没渲染出来
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
};
</script>

<style scoped lang="scss">
.cat_opt {
  margin: 15px 0px;
  span {
    margin-right: 15px;
  }
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>