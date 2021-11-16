import MobileTree from './MobileTree';
MobileTree.install = function (Vue) {
    Vue.component(MobileTree.name, MobileTree); //name就是开始说的vue文件暴露出来的name名
};
export default MobileTree;