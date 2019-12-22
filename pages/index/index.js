var context = null;
Page({
  data: {
    save: false,
    src: '',
    hat: {
      url: '/pages/img/sxu.png',
      w: 256,
      h: 256,
      x: 0,
      y: 0,
      b: 1,
    }
  },
  onLoad: function() {

  },
  onShareAppMessage: function () {
    return {
      title: "山西大学免挂头像制作", //转发的标题。当前小程序名称
      imageUrl: '/pages/img/share.png',//自
      }
  },

  // 选择头像图片
  upload: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res)
        that.setData({
          src: res.tempFilePaths[0]
        })
        that.drawAvatar()
      }
    })
  },


  // 绘制头像背景
  drawAvatar: function() {
    var that = this;
    var p = that.data;
    context = wx.createCanvasContext('myAvatar', this);
    context.clearRect(0, 0, 256, 256)
    context.drawImage(p.src, 0, 0, 256, 256);
    context.draw(true);
    context.save();
    context.drawImage(p.hat.url, 0, 0, 256, 256);
    context.draw(true);
    context.save();
    this.setData({
      save: true
    })
  },

  getUserInfo: function(res) {
    var that=this;
    console.log(res.detail)
    if (res.detail.errMsg == 'getUserInfo:ok') {
      wx.getImageInfo({
          src: res.detail.userInfo.avatarUrl,
        success: res => {
          console.log(res.path)
          that.setData({
            src: res.path
          })
          that.drawAvatar()
        },
        fail: res => {
          console.log(res)
        }
      })
    }
    else {
      wx.showToast({
        title: '获取用户头像失败',
        icon: 'none',
        duration: 2000
      })

    }
    // wx.getSetting({
    //   success:res=>{
    //   console.log(res)
    //   }
    // })

    // success: res => {
    //   console.log('获取用户头像成功')
    //   wx.getImageInfo({
    //     src: res.userInfo.avatarUrl,
    //     success: res => {
    //       console.log(res.path)
    //       that.setData({
    //         src: res.path
    //       })
    //       that.drawAvatar()
    //     },
    //     fail: res => {
    //       console.log(res)
    //     }
    //   })


    // },
    // fail:res=>{
    //   console.log(res)
    //  console.log('sss')
    // }


  },
  // 保存图片
  saveImg() {
    wx.canvasToTempFilePath({
      canvasId: 'myAvatar',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功'
            })
          },
          fail(res) {
            wx.showToast({
              title: '取消保存...',
              icon: 'none'
            })
          }
        })
      }
    })
  }


})