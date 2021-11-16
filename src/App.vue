<template>
  <div id="app">
    <!-- <img src="../public/Snipaste_2021-11-13_16-44-23.jpg" alt=""> -->
    <MobileTree
      :data="data"
      label="name"
      :isShowIcon="true"
      :isMultiple="true"
      :selectedList="[]"
      @on-submit="childSubmit"
      @on-cancel="childCancel"
      @on-select="clickItem"
      @on-search="childSearch"
      @on-expand="childExpand"
      @on-nav="childNav"
      @on-clear="childClearSearchKey"
      @on-slide="childSlide"
      @on-switch-show-type="childSwitch"
    >
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
import MobileTree from "./components/MobileTree/MobileTree";
export default {
  name: "App",
  components: {
    MobileTree,
  },
  data() {
    return {
      isMultiple: true,

      data: [
        {
          name: "测试任务",
          id: 5,
          children: [],
          avatar: "",
        },
        {
          name: "测试人物",
          id: 3553,
          avatar:
            "https://img1.baidu.com/it/u=2127171293,1530308526&fm=26&fmt=auto",
        },
        {
          name: "测试人物",
          id: 33,
          avatar:
            "https://img2.baidu.com/it/u=2285567582,1185119578&fm=26&fmt=auto",
        },
        {
          name: "测试人物aa",
          id: 303,
          avatar:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fstatic.baimao.com%2Fuploads%2Fnewsimg%2Fpicnews%2F20171226%2F4a914bf6444c6f4_ori.jpg&refer=http%3A%2F%2Fstatic.baimao.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1639386874&t=ec4d2fa71b6c593b6b34053c964a7859",
        },
      ],
    };
  },
  methods: {
    // 点击选项
    clickItem(data) {
      console.log(data);
    },
    // 提交
    childSubmit(selectedItems) {
      alert("点击了提交", selectedItems);
      console.log(selectedItems);
    },

    // 取消
    childCancel() {
      alert("点击了取消");
      console.log("子组件取消");
    },

    // 搜索
    childSearch(searchKey) {
      console.log(searchKey);
    },

    // 右侧箭头点击事件
    childExpand(data) {
      console.log(data);
    },

    // 面包屑导航点击事件
    childBread(data) {
      // data == -1 为点击全部的时候
      // data == {}  为点击导航栏的时候
      console.log(data);
    },

    // 清楚搜索内容事件
    childClearSearchKey() {
      console.log("清楚了搜索内容");
    },

    // 左滑手势
    childSlide() {
      debugger;
    },

    // 切换显示类型事件
    childSwitch(showType) {
      // showT
      console.log(showType);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  /* height: 100vh; */
}

#app > h4,
#app > div {
  /* width: 100%; */
  margin: 0 auto;
}

#app > div {
  /* height: 89%; */
  /* margin-bottom: 50px; */
}
</style>
