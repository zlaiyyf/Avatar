var context = null;
Page({
  data: {
    save: false,
    src: '',
    hat: {
      url: '/pages/img/1.png',
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
      title: "山西大学校庆头像制作", //转发的标题。当前小程序名称
      imageUrl: '/pages/img/xz.png',//自
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
    const FileSystemManager = wx.getFileSystemManager()
    var that = this;
    var p = that.data;
    console.log(p.src,'图片路劲')
    FileSystemManager.readFile({
      filePath:p.src,
      success:res=>{
      console.log(res.data,'success')
      wx.cloud.callFunction({
        name: 'im',
        data:{'img':res.data},
        success:res=>{
          console.log(res.result,)
          if(res.result.errCode==87014){
            wx.showModal({
              title: '违规提示',
              content: '图片内容含有违法违规内容 请换一张',
              showCancel: false,           // 是否显示取消按钮，默认为 true
              // cancelText : "自定取消",
              // cancelColor: "red",
              confirmText : "确定",
              confirmColor : "#000000",
        
              /** success返回参数说明
               * confirm 为 true 时，表示用户点击了确定按钮
               * cancel 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）
              */
              success:res=> {
                if (res.confirm) {
                  this.setData({
                    save: false
                  })
                }
                if (res.cancel) {
                  console.log("点击了取消");
                }
            }
          })
        }
        },
        fail:res=>{
          wx.showToast({
            title: '未知错误',
            icon: 'none',
            duration: 1500
        })
             
        },
        complete:res=>{
          console.log(res.result,)
        }
      })
      } ,
    
      fail:res=>{
        console.log(res,'fail')
      }
    }
    )
   

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
    console.log('用户头像获取')
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