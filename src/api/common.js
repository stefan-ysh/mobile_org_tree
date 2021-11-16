//src/api/common.js
import request from "@/utils/request";

/**
 * POST 方法 与 GET方法  区别
 *
 * post ==>  data: obj
 * get  ==>  params: obj
 *
 */

//    例如(post)：
// function getInitList(obj) {
//   return request({
//     url: "/init", // url = base url + request url
//     method: "post",
//     data: obj //----------------->>>区别
//   });
// }


//    例如(get)：
// function getDataList(obj) {
//   return request({
//     url: '/data', // url = base url + request url
//     method: "get",
//     params: obj //----------------->>>区别
//   });
// }

const treeApi = {
  //
  getInitList() {
    return request({
      url: "/initList", // url = base url + request url
      method: "get",
      //   data: obj, //----------------->>>区别
    });
  },
  // 例如(get)：
  getDataList(url) {
    return request({
      url, // url = base url + request url
      method: "get",
      //    params: {obj:2},    //----------------->>>区别
    });
  },
};
export { treeApi };
