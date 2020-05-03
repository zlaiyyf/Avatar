// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init('xq-ci0eb')

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const result = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value:  Buffer.from(event.img)
      }
    })
    return result
  }catch (err) {
    // 错误处理
    // err.errCode !== 0
    return err
  }



 
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}