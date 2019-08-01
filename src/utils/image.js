const getObjectUrl = file => {
  // 获取待上传图片url
  let URL = window.URL || window.webkitURL || window.mozURL
  let url = URL.createObjectURL(file)
  return url
}

const rotateImg = (img, direction, canvas) => {
  // 图片旋转
  // 最小与最大旋转方向，图片旋转4次后回到原方向
  const minStep = 0
  const maxStep = 3
  if (img == null) return
  // img的高度和宽度不能在img元素隐藏后获取，否则会出错
  let height = img.height
  let width = img.width
  let step = 2
  if (step == null) { step = minStep }
  if (direction === 'right') {
    step++// 旋转到原位置，即超过最大值
    step > maxStep && (step = minStep)
  } else {
    step--
    step < minStep && (step = maxStep)
  }// 旋转角度以弧度值为参数
  let degree = step * 90 * Math.PI / 180
  let ctx = canvas.getContext('2d')
  switch (step) {
    case 0:
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0)
      break
    case 1:
      canvas.width = height
      canvas.height = width
      ctx.rotate(degree)
      ctx.drawImage(img, 0, -height)
      break
    case 2:
      canvas.width = width
      canvas.height = height
      ctx.rotate(degree)
      ctx.drawImage(img, -width, -height)
      break
    case 3:
      canvas.width = height
      canvas.height = width
      ctx.rotate(degree)
      ctx.drawImage(img, -width, 0)
      break
  }
}

const compress = (img) => {
  // 图片压缩
  // alert('图片的朝向' + orientation)
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d') // 瓦片canvas
  let tCanvas = document.createElement('canvas')
  let tctx = tCanvas.getContext('2d')
  let initSize = img.src.length
  let width = img.width
  let height = img.height // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  let ratio
  if ((ratio = width * height / 4000000) > 1) {
    console.log('大于400万像素')
    ratio = Math.sqrt(ratio)
    width /= ratio
    height /= ratio
  } else {
    ratio = 1
  }
  canvas.width = width
  canvas.height = height
  // 铺底色
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // 如果图片像素大于100万则使用瓦片绘制
  let count;
  if ((count = width * height / 1000000) > 1) {
    count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
    // 计算每块瓦片的宽和高
    let nw = ~~(width / count)
    let nh = ~~(height / count)
    tCanvas.width = nw
    tCanvas.height = nh
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
      }
    }
  } else { ctx.drawImage(img, 0, 0, width, height) }
  // 修复ios上传图片的时候 被旋转的问题
  // if (orientation && orientation !== '' && orientation !== 1) {
  //   alert(orientation)
  //   switch (orientation) {
  //     case 6: // 需要逆时针（向左）90度旋转
  //       rotateImg(img, 'left', canvas)
  //       break
  //     case 8: // 需要顺时针（向右）90度旋转
  //       rotateImg(img, 'right', canvas)
  //       break
  //     case 3: // 需要180度旋转
  //       rotateImg(img, 'right', canvas)
  //       // 转两次
  //       rotateImg(img, 'right', canvas)
  //       break
  //   }
  // }

  // 设置jpegs图片的质量
  let ndata = canvas.toDataURL('image/jpeg', 1)
  console.log(`压缩前：${initSize}`)
  console.log(`压缩后：${ndata.length}`)
  console.log(`压缩率：${~~(100 * (initSize - ndata.length) / initSize)}%`)
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
  return ndata
}

const base64Img2Blob = base64str => {
  // base64编码转为Blob对象
  // 文件类型和编码内容
  let parts = base64str.split(';base64,')
  // 去除data，保存为contentType
  let contentType = parts[0].split(':')[1]
  // atob方法解码base64
  let raw = window.atob(parts[1])
  let rawLength = raw.length
  // 创建一个存储解码后数据的数组
  let uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

export {
  getObjectUrl,
  compress,
  base64Img2Blob,
}