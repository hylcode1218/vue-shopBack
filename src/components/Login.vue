<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item  prop="username">
          <el-input 
          prefix-icon="el-icon-user-solid" 
          v-model="loginForm.username"
         placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input 
           prefix-icon="iconfont icon-mima" 
           v-model="loginForm.password"
           type="password"
           placeholder="请输入密码"
           ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm:{
                username:'admin',
                password:'123456'
            },
            loginFormRules:{
                username:[
                    {required: true, message: '用户名不能为空', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
                ],
                password:[
                     {required: true, message: '密码不能为空', trigger: 'blur' },
                     { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'change' }
                ]
            }
        }
    },
    created(){
    },
    methods: {
        resetLogin(){
            //重置登录表单
            console.log(this)
            this.$refs.loginFormRef.resetFields()
        },
        //点击登录不能直接提交，要进行表单的预验证
        login(){
            this.$refs.loginFormRef.validate(async (valid)=>{
                if(!valid) return;
                //验证通过发起登录请求 this.$http.post返回值是promise async进行简化
                var result=await this.$http.post('login',this.loginForm)
                var res=result.data;
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                /*
                token只在网站打开期间生效,所以保存到sessionStorage
                localStorage持久化存储
                除了登录接口，其他接口需要携带token  路由导航守卫控制导航权限
                */
               window.sessionStorage.setItem('token',res.data.token)
               this.$router.push('/home')
            })
        }
    },
};
</script>

<style scoped lang="scss">
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      // overflow: hidden;
      padding: 10px;
      box-shadow: 0 0 10px#ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -65px);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>