<template>
  <div id="app">
    <MobileTree
      :data="data"
      label="name"
      :isShowIcon="isShowIcon"
      :isMultiple="isMultiple"
      :defaultShowType="defaultShowType"
      @on-submit="childSubmit"
      @on-search="childSearch"
      @on-expand="childExpand"
      @on-nav="childNav"
      @on-clear="childClearSearchKey"
      @on-switch-show-type="childSwitch"
    >
      <!-- 示例，如无特殊需求，不建议使用 -->
      <!-- 切换显示类型按钮插槽 -->
      <!-- <template slot="switch-show-type-btn" slot-scope="scope">
        <button>{{scope.showType}}</button>
      </template> -->
      <!-- 内容区 -->
      <!-- <template slot="content-area" slot-scope="scope">
        <li class="org-tree__item" v-for="(item, index) in scope.renderData" :key="index">
          {{item.name}}
        </li>
      </template> -->
      <!-- 无数据时提示信息 -->
      <!-- <template slot="empty-tips">
        暂无数据
      </template> -->
      <!-- 已经选择项的集合展示区 -->
      <!-- <template slot="selected-list" slot-scope="scope">
        {{scope.selectedItems}}
      </template> -->
      <!-- 底部操作区 -->
      <!-- <template slot="result-area" slot-scope="scope">
        {{scope.selectedItems}}
      </template> -->
    </MobileTree>
  </div>
</template>

<script>
// 模拟角色数据
import RoleData from "./data/role.json";

// 模拟组织数据
import OrgData from "./data/org.json";

export default {
  name: "App",

  data() {
    return {
      // 默认显示类型
      defaultShowType: "org",

      // 控制单/多选变量
      isMultiple: true,

      // 模拟角色数据
      RoleData,

      // 模拟组织数据
      OrgData,

      // 数据源
      data: [],

      // 控制头像显隐的变量
      isShowIcon: true,
    };
  },

  methods: {
    // 提交
    childSubmit(selectedItems) {
      let list = [];
      selectedItems.forEach((element) => {
        list.push(element.name);
      });
      alert(`点击了提交 ： ${list.join(",")}`);
    },

    // 搜索
    childSearch(searchKey) {
      if (searchKey == "") {
        this.getDataList();
        return;
      }
      let arr;
      if (this.defaultShowType == "org") {
        arr = JSON.parse(JSON.stringify(this.OrgData));
      } else {
        arr = JSON.parse(JSON.stringify(this.RoleData));
      }
      let res = this.flatten(arr);
      let tempVal = res.filter((item) => {
        return item.name.includes(searchKey);
      });
      let result = this.removeDuplicates(tempVal)
      if (result.length) {
        this.data = result;
      } else {
        this.data = [];
      }
    },

    flatten(arr) {
      return arr.reduce((result, item) => {
        return result.concat(
          item,
          Array.isArray(item.children) ? this.flatten(item.children) : []
        );
      }, []);
    },

    // 右侧箭头点击事件
    childExpand(data) {
      this.data = data.children;
    },

    // 面包屑导航点击事件
    childNav(data) {
      // data == -1 为点击全部的时候，否则是点击导航栏
      if (data == -1) {
        this.getDataList();
      } else {
        this.data = data.children;
      }
    },

    // 清除搜索内容
    childClearSearchKey() {
      console.log("清除了搜索内容");
      this.getDataList();
    },

    // 切换显示类型事件
    childSwitch(showType) {
      this.defaultShowType = showType;
    },

    // 获取数据
    getDataList() {
      if (this.defaultShowType == "org") {
        this.data = this.OrgData;
      } else {
        this.data = this.RoleData;
      }
    },

    removeDuplicates(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },
  },

  created() {
    this.getDataList();
  },

  watch: {
    defaultShowType: {
      handler(showType) {
        this.getDataList();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
