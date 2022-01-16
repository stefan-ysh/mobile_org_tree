<template>
  <div @touchstart="gtouchstart" @touchend="gtouchend" class="mobile-org-tree">
    <!-- 上方搜索栏 -->
    <div class="search">
      <!-- 搜索form -->
      <form action="javascript:return true" class="search-form">
        <!-- 搜索输入框 -->
        <input
          type="search"
          :placeholder="searchPlaceholder"
          v-model="searchKey"
          @input="handleSearch"
          @compositionstart="handleComposionstart"
          @compositionend="handleComposionend"
        />
        <!-- 清空搜索按钮 -->
        <span
          class="clear-search-key-btn"
          @click="clearSearchKey"
          v-if="isShowClearBtn && searchKey"
          >×</span
        >
      </form>
    </div>
    <!-- 下方内容显示区 -->
    <div class="org-tree">
      <!--  面包屑导航 -->
      <div class="org-tree__current">
        <!-- 导航区 -->
        <div class="org-tree__current__nav">
          <span @click="handleCurrentListClick(-1)">全部</span>
          <span
            v-for="(item, index) in currentData"
            :key="index"
            @click="handleCurrentListClick(index)"
          >
            {{ item[label] }}
          </span>
        </div>
        <slot name="switch-show-type-btn" :showType="showType">
          <!-- 切换按钮 -->
          <div class="org-tree__current__switchBtn">
            <!-- 角色 / 组织  切换 -->
            <button @click="switchShowType">
              {{ showType == "org" ? orgText : roleText }}
            </button>
          </div>
        </slot>
      </div>
      <!-- 内容显示区 -->
      <div class="org-tree__warp">
        <ul class="org-tree__ul">
          <template v-if="renderData.length > 0">
            <slot name="content-area" :renderData="renderData">
              <li
                class="org-tree__item"
                v-for="item in renderData"
                :key="item[nodeKey]"
              >
                <!-- 复选框 -->
                <input
                  type="checkbox"
                  @click="handleItemClick(item)"
                  :checked="isChecked(item)"
                  name="check"
                  class="item-checkbox"
                />
                <!-- 头像 -->
                <img
                  v-if="isShowIcon"
                  @click="handleItemClick(item)"
                  class="avatar"
                  :style="{
                    visibility: item[icon] || defaultIcon ? '' : 'hidden',
                  }"
                  :src="item[icon] || defaultIcon"
                />
                <!--  名称显示 -->
                <span
                  @click="handleItemClick(item)"
                  class="org-tree__item-text"
                >
                  {{ item[label] }}
                </span>
                <!-- 下级按钮 -->
                <span
                  v-if="item.hasOwnProperty(children)"
                  @click="handleItemChildClick(item)"
                  class="org-tree__item-child"
                >
                  >
                </span>
              </li>
            </slot>
          </template>
          <!-- 无数据提示:两种：1.数据源压根儿没数据 2.搜索结果没数据 -->
          <template v-else>
            <slot name="empty-tips">
              <li class="empty">
                <small
                  >暂无{{
                    searchKey ? `与 '${searchKey}' 相关` : ""
                  }}数据</small
                >
              </li>
            </slot>
          </template>
        </ul>
      </div>
      <div class="org-tree__operation">
        <!-- 已选择项目 -->
        <slot name="selected-list" :selectedItems="selectedItems">
          <!--  已选择的项目列表 -->
          <div class="selected-item-list">
            <span
              class="seleted-item"
              v-for="(item, index) in selectedItems"
              :key="index"
            >
              {{ item[label] }}
              <i @click="delItem(item)" class="close-icon"></i>
            </span>
          </div>
        </slot>
        <!-- 已选数量及操作区 -->
        <div class="result-display">
          <slot name="result-area" :selectedItems="selectedItems">
            <div class="result-area__display">
              <span v-if="!selectedItems.length">暂无选择</span>
              <span v-if="selectedItems.length"
                >已选择 {{ selectedItems.length }} 项</span
              >
            </div>
            <div class="result-area__operation">
              <span class="cancel-btn" @click="handleCancel">{{
                cancelText
              }}</span>
              <span @click="handleSubmit" class="submit-btn">{{
                submitText
              }}</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MobileTree",

  props: {
    data: {
      type: Array,
      default: () => [],
    },

    defaultIcon: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "name",
    },

    nodeKey: {
      type: String,
      default: "id",
    },

    children: {
      type: String,
      default: "children",
    },

    icon: {
      type: String,
      default: "avatar",
    },

    isShowClearBtn: {
      type: Boolean,
      default: true,
    },

    searchPlaceholder: {
      type: String,
      default: "搜索",
    },

    submitText: {
      type: String,
      default: "提交",
    },

    cancelText: {
      type: String,
      default: "取消",
    },

    isShowIcon: {
      type: Boolean,
      default: false,
    },

    isMultiple: {
      type: Boolean,
      default: true,
    },

    isSelectRequired: {
      type: Boolean,
      default: true,
    },

    selectedList: {
      type: Array,
      default: () => [],
    },

    slideDistance: {
      type: Number,
      default: 100,
    },

    // 显示状态
    defaultShowType: {
      type: String,
      default: "org",
    },

    orgText: {
      type: String,
      default: "组织",
    },

    roleText: {
      type: String,
      default: "角色",
    },
  },

  data() {
    return {
      // 当前数据
      currentData: [],

      // 已选择的数据集合
      selectedItems: [],

      // 用来渲染的数据源
      renderData: [],

      // 搜索关键词
      searchKey: "",

      // 鼠标按下时候的初始 x 坐标
      startX: "",

      showType: "",

      isTyping: false,
    };
  },

  mounted() {
    if (Array.isArray(this.selectedList) && this.selectedList.length > 0) {
      this.selectedItems = this.selectedList;
    }
    this.renderData = this.data;
  },

  methods: {
    // 手指按下
    gtouchstart(e) {
      // // 获取x 坐标
      // e.targetTouches[0].clientX;
      // // 获取y 坐标
      // e.targetTouches[0].clientX;
      this.startX = e.targetTouches[0].clientX;
    },

    // 手指松开
    gtouchend(e) {
      // window.console.log("手指松开啦", e);
      if (e.changedTouches[0].clientX - this.startX >= this.slideDistance) {
        // console.log("移动距离大于" + this.slideDistance, this.currentData);
        this.handleCurrentListClick(this.currentData.length - 2);
        this.$emit("on-slide");
      }
    },

    // 切换组织/角色
    switchShowType() {
      switch (this.showType) {
        case "org":
          this.showType = "role";
          this.currentData = [];
          this.searchKey = "";
          break;
        case "role":
          this.showType = "org";
          this.currentData = [];
          this.searchKey = "";
        default:
          break;
      }
      this.$emit("on-switch-show-type", this.showType);
    },

    // 是否显示选中状态
    isChecked(data) {
      return this.selectedItems.find((item) => {
        return item[this.nodeKey] == data[this.nodeKey];
      });
    },

    // 点击选项
    handleItemClick(row) {
      // 多选
      if (this.isMultiple) {
        const data = JSON.parse(JSON.stringify(row));
        let isExist = this.selectedItems.find((i) => {
          return data[this.nodeKey] == i[this.nodeKey];
        });
        if (isExist) {
          // 存在当前项，则取消选择
          this.selectedItems = this.selectedItems.filter((res) => {
            return res[this.nodeKey] !== data[this.nodeKey];
          });
        } else {
          // 不存在当前项，则将其加入到所选列表中
          this.selectedItems.push(data);
        }
      } else {
        // 单选
        this.selectedItems = [];
        this.selectedItems.push(row);
      }
      this.$emit("on-select", row);
    },

    // 点击下级按钮获取下级目录及人员
    handleItemChildClick(row) {
      this.currentData.push(row);
      this.$emit("on-expand", row);
    },

    // 点击面包屑导航触发
    handleCurrentListClick(index) {
      // 点击全部的时候index == -1
      // 如果点击当前项则不做任何操作
      if (
        index == this.currentData.length - 1 ||
        (this.currentData.length === 0 && index == -1)
      ) {
        this.searchKey = "";
        this.$emit("on-nav", "-1");
        return;
      }
      // 处理导航栏数据
      if (index > -1) {
        this.currentData = this.currentData.slice(0, index + 1);
        this.$emit("on-nav", this.currentData[index]);
      } else {
        // 如果当前就是全部则不做任何操作
        this.currentData = [];
        this.$emit("on-nav", "-1");
      }
    },

    // 删除已选列表中的item
    delItem(data) {
      // console.log(data);
      this.selectedItems = this.selectedItems.filter((item) => {
        return item[this.nodeKey] !== data[this.nodeKey];
      });
    },

    // 提交
    handleSubmit() {
      if (this.isSelectRequired && !this.selectedItems.length) {
        alert("未做任何选择，请选择后重试。");
        return;
      }
      // 触发父组件绑定事件，将值传回去
      this.$emit("on-submit", this.selectedItems);
    },

    // 取消
    handleCancel() {
      this.$emit("on-cancel");
    },

    // 开始搜索
    handleSearch() {
      if (this.isTyping) {
        return;
      }
      console.log('search');
      this.$emit("on-search", this.searchKey.trim());
    },

    // 输入中文ing
    handleComposionstart() {
      this.isTyping = true;
      console.log('input start');
    },

    // 输入中文end
    handleComposionend() {
      this.isTyping = false;
      console.log('input end');
    },

    // 清楚搜索
    clearSearchKey() {
      this.searchKey = "";
      this.$emit("on-clear");
    }
  },

  watch: {
    defaultShowType: {
      handler(newVal, oldVal) {
        this.showType = newVal;
      },
      deep: true,
      immediate: true
    },

    // 监听父组件传来的值
    data: {
      handler(val) {
        this.renderData = val;
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.mobile-org-tree {
  position: absolute;
  inset: 10px;
  padding: 10px;
}

.mobile-org-tree .search {
  display: flex;
  height: 40px;
  justify-content: space-between;
  margin-bottom: 10px;
}

.mobile-org-tree .search .search-form {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
}

input[type="search"] {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  border: 1px solid #f7ecec;
  text-align: center;
}

input[type="search"]::-webkit-search-cancel-button {
  display: none;
}

.clear-search-key-btn {
  line-height: 15px;
  position: absolute;
  right: 0px;
  margin-right: 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  text-align: center;
  background: rgb(214 190 190);
  color: #fff;
  font-weight: 600;
}

.org-tree * {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.org-tree {
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #eee;
}

.org-tree .org-tree__current {
  display: flex;
  word-break: keep-all;
  font-size: 14px;
  /* padding: 0 10px; */
  /* height: 40px; */
  height: 100%;
  padding: 5px;
  align-items: center;
  box-shadow: 0px 0px 2px 2px #eee;
  overflow-x: auto;
  overflow-y: hidden;
  justify-content: space-between;
}

.org-tree .org-tree__current span {
  position: relative;
  margin-right: 10px;
}

.org-tree .org-tree__current span::after {
  display: block;
  position: absolute;
  content: "/";
  top: 0;
  right: -10px;
}

.org-tree .org-tree__current span:last-child {
  color: #808080;
}

.org-tree .org-tree__current span:last-child::after {
  display: none;
}

.org-tree .org-tree__warp {
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid #eee;
}

.org-tree .org-tree__warp .empty {
  padding: 20px 0;
  color: #999;
  text-align: center;
}

.org-tree .org-tree__warp .org-tree__ul {
  height: calc(100vh - 16rem);
  overflow: auto;
}
.org-tree .org-tree__warp .org-tree__item {
  border-bottom: 1px solid #eee;
  height: 38px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  padding: 8px 0;
  box-sizing: border-box;
}

.org-tree .org-tree__warp .org-tree__item:last-child {
  border: none;
}

.org-tree .org-tree__warp .org-tree__item:first-child {
  border-top: none;
}

/*复选框样式 */
.org-tree .org-tree__warp .org-tree__item .item-checkbox:checked {
  background: #1673ff;
}

.org-tree .org-tree__warp .org-tree__item .item-checkbox {
  width: 15px;
  height: 15px;
  background-color: #ffffff;
  border: solid 1px #dddddd;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  font-size: 0.8rem;
  margin: 0 5px 0 0;
  padding: 0;
  position: relative;
  display: inline-block;
  vertical-align: top;
  cursor: default;
  -webkit-appearance: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-transition: background-color ease 0.1s;
  transition: background-color ease 0.1s;
}

.org-tree .org-tree__warp .org-tree__item .avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 5px;
}

.org-tree .org-tree__warp .org-tree__item .item-checkbox:checked::after {
  content: "";
  top: 3px;
  left: 2px;
  position: absolute;
  background: transparent;
  border: #fff solid 2px;
  border-top: none;
  border-right: none;
  height: 3px;
  width: 7px;
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.org-tree .org-tree__warp .org-tree__item input {
  margin-right: 5px;
}

.org-tree .org-tree__warp .org-tree__item .org-tree__item-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.org-tree .org-tree__warp .org-tree__item .org-tree__item-count {
  width: 45px;
  padding-right: 5px;
  text-align: center;
  color: #999;
}

.org-tree .org-tree__warp .org-tree__item .org-tree__item-child {
  padding: 0 8px;
  width: max-content;
  color: #409eff;
  border-left: 1px solid #eee;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 600;
}

.org-tree .org-tree__operation {
  position: absolute;
  bottom: 0;
  left: 10px;
  right: 10px;
}

.org-tree .org-tree__operation .result-display {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-top: 1px solid rgb(247, 236, 236);
}

.org-tree
  .org-tree__operation
  .result-display
  .result-area__operation
  .cancel-btn {
  width: 40px;
  margin-right: 10px;
  padding: 0;
  color: #3c6eb7;
  text-align: center;
}

.org-tree
  .org-tree__operation
  .result-display
  .result-area__operation
  .submit-btn {
  width: 40px;
  padding: 0;
  color: #3c6eb7;
  text-align: center;
}
</style>
<style scoped>
.selected-item-list {
  height: 4rem;
  overflow: auto;
}

.seleted-item {
  background-color: #ecf5ff;
  display: inline-block;
  /* height: 1.3rem; */
  padding: 0 5px;
  line-height: 1.3rem;
  font-size: 15px;
  color: #409eff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  margin: 5px;
}

.close-icon:before {
  content: "\2716";
  font-size: xx-small;
  font-style: normal;
  opacity: 0.5;
}
</style>

<!-- less / scss -->
<!-- 为了通用型考虑暂时不启用 -->
<!-- <style lang="less" scoped> -->
<!-- 
<style lang="scss" scoped>
.org-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  * {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .org-tree__current {
    font-size: 14px;
    padding: 10px 0;
    box-shadow: 0px 0px 2px 2px #eee;
    span {
      position: relative;
      margin-right: 20px;
      &::after {
        display: block;
        position: absolute;
        content: "/";
        top: 0;
        right: -10px;
      }
      &:last-child {
        color: #808080;
        &::after {
          display: none;
        }
      }
    }
  }
  .org-tree__warp {
    flex: 1;
    overflow-y: auto;
    border-top: 1px solid #eee;
    .empty {
      padding: 20px 0;
      color: #999;
      text-align: center;
    }
    .org-tree__item {
      border-bottom: 1px solid #eee;
      height: 38px;
      margin: 0 10px;
      display: flex;
      align-items: center;
      padding: 8px 0;
      box-sizing: border-box;
      .org-tree__item-text {
        flex: 1;
      }
      .org-tree__item-count {
        width: 45px;
        padding-right: 5px;
        text-align: center;
        color: #999;
      }
      .org-tree__item-child {
        padding: 0 8px;
        width: max-content;
        color: #409eff;
        border-left: 1px solid #eee;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }
}
</style>
-->
