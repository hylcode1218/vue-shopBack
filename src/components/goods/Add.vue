<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="leaveTab"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :props="cateProps"
                :options="cateList"
                v-model="addForm.goods_cat"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_val">
                <el-checkbox
                  v-for="(cb, i) in item.attr_val"
                  :label="cb"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action  表示图片要上传到的后台api地址 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor class="appwrapper"
              v-model="addForm.goods_introduce"
              ref="myQuillEditor">
            </quill-editor>

            <!-- 添加商品的按钮 -->
            <el-button type="primary" style="margin-top:15px;"
            @click="add"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" class="preview-img">
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {deepClone} from "../../utils/index"
export default {
  data() {
    return {
      //  tabs栏中是字符串  步骤条中是数字 默认是字符串 -0改为数字
      activeIndex: "0",
      tabPosition: "left",
      //添加商品的表单数据对象
      addForm: {
        goods_name: "", //商品名称
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        pics: [], //图片的临时路径
        goods_introduce: "",
        attrs:[]
      },
      //表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        //图片上传组件的请求头
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
    };
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      this.cateList = res.data;
    },
    handleChange() {
      //可以拿到选中的数据
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    leaveTab(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    async tabClick() {
      console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        //访问的是商品参数面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );

        res.data.forEach((item) => {
          item.attr_val =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      }

      if (this.activeIndex === "2") {
        //访问的是商品属性面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );

        this.onlyTableData = res.data;
        console.log(this.onlyTableData);
      }
    },
    handlePreview(file) {
      //图片预览问题
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    handleRemove(res) {
      //点击移除
      //1、获取将要删除图片的临时路径
      const filePath = res.response.data.tmp_path;
      //2、从pics数组中 找到图片的索引值
      const i = this.addForm.pics.findIndex((item) => {
        item.pic === filePath;
      });
      //3、移除对应那一项
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm.pics);
    },
    handleSuccess(res) {
      //监听图片上传成功
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("图片上传失败");
      }
      const picInfo = { pic: res.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
      this.$message.success("图片上传成功");
    },

    //添加商品
    add(){
      this.$refs.addFormRef.validate(async (vaild)=>{
        if(!vaild)  return this.$message.error("请填写必要的信息")

        //执行必要的业务逻辑
        //loadsh  cloneDeep  深拷贝
        const addFormCopy=deepClone(this.addForm)
        addFormCopy.goods_cat=addFormCopy.goods_cat.join(',')
        
        //处理动态参数和静态属性
        this.manyTableData.forEach((item)=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        
       this.onlyTableData.forEach(item=>{
         const newInfo={
           attr_id:item.attr_id,
           attr_value:item.attr_vals
         }
         this.addForm.attrs.push(newInfo)
       })
        
        addFormCopy.attrs=this.addForm.attrs;
        console.log(addFormCopy)
        
        //发送请求
        //商品的名称必须是唯一的
        const {data:res}=await this.$http.post('goods',addFormCopy)

        if(res.meta.status !== 201){
          return this.$message.error(res.meta.msg)
        }
        this.$message.success("添加商品成功")

        this.$router.push('/goods')
      })
    }
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview-img {
  width: 100%;
}
</style>