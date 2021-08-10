const fs = require('fs');
const $path = require('path');

const { imagePdf } = require("./js/index.js");

//获取当前图片的格式
function getImageType(str) {
  var reg = /\.(png|jpg|gif|jpeg|webp)$/;
  return str.match(reg)[1];
}

// 图片转为Base64
function getImageBase64(imgPath, fileName) {
  let data = fs.readFileSync(imgPath, 'binary')
  const buffer = new Buffer(data, 'binary');
  let img64 = 'data: image/' + getImageType(fileName) + ';base64,' + buffer.toString('base64');
  return img64 || ""
}


window.exports = {
  //单张图片转为pdf
  "convert": {
    mode: "none",
    args: {
      enter: (action, callbackSetList) => {
        utools.hideMainWindow()
        let files = action.payload
          // 遍历选中文件
        for (const element of files) {
          if (element.isFile) {
            let { name, path } = element
            let img64 = getImageBase64(path, name)
            imagePdf([{
              data: img64
            }], name.slice(0, name.lastIndexOf('.')))
          }
        }
        utools.showNotification('转换完成！')
      }
    }
  },
  "convert_merge": {
    mode: "none",
    args: {
      enter: (action, callbackSetList) => {
        utools.hideMainWindow()
        let files = action.payload
        let images = []
          // 遍历选中文件
        for (const element of files) {
          if (element.isFile) {
            let { name, path } = element
            let img64 = getImageBase64(path, name)
            images.push({
              data: img64
            })
          }
        }
        imagePdf(images, new Date().getTime())
        utools.showNotification('转换合并完成！')
      }
    }
  }
}