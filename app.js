App({
  onLaunch: function () {
//     let xhr = new XMLHttpRequest();
// xhr.open("get", "/pages/img/1.png", true);
// xhr.responseType = "blob";
// xhr.onload = function (res) {
//   if (this.status == 200) {
//     var blob = this.response;
//     console.log(blob)
//   }
// }

wx.cloud.init({
  traceUser: true, 
})
  },
  globalData: {
    userInfo: null
  }

})