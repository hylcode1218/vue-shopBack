<template>
  <div class="home">
    <el-container class="home_container">
      <!-- 头部区域 -->
      <el-header>
        <div class="header_left">
          <img src="../assets/heima.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggle_button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu background-color="#333744" text-color="#fff"
          :default-active="activePath"
          :unique-opened="true" 
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]" style="margin-right:10px"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+sunItem.path" v-for="sunItem in item.children" :key="sunItem.id"
              @click="saveNavState('/'+sunItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{sunItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main> 
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
        menulist:[],
        iconsObj:{
            "125":'el-icon-user-solid',
            "103":'iconfont icon-quanxianguanli',
            "101":'iconfont icon-shangpinguanli',
            "102":'iconfont icon-dingdanguanli',
            "145":'iconfont icon-shujutongji'
        },
        isCollapse:false,
        activePath:''
    };
  },
  created() {
      this.getMenuList()
      this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
        const {data:res}=await this.$http.get('menus')
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res)
        this.menulist=res.data
    },
    toggleCollapse(){
        this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
    }
  },
};
</script>

<style scoped lang="scss">
.home {
  height: 100%;
}
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  .header_left {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle_button{
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
  }
  .el-menu{
      border-right:0
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
