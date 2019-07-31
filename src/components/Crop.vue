<template>
  <section
    class="crop-wrapper"
    id="crop-wrapper"
  >
    <div class="crop-image-wrapper">
      <img
        id="preview-image"
        :src="previewImageUrl"
      >
    </div>
    <button @click="removeCrop">取消</button>
    <button @click="startCrop">确定</button>
  </section>
</template>

<script>
import Cropper from "cropperjs";
import { compress, base64Img2Blob } from "@/utils/image.js";
import 'cropperjs/dist/cropper.css';
export default {
  name: "Crop",
  components: {
    Cropper: Cropper
  },
  data() {
    return {
      orientation: null,
      cropper: null,
      previewImageEl: null,
      previewImageUrl: null
    };
  },
  methods: {
    initCrop(url, orientation) {
      this.orientation = orientation;
      let aspectRatio = 1;
      if (!this.cropper) {
        // 初始化裁剪框
        this.previewImageEl = document.getElementById("preview-image");
        this.cropper = new Cropper(this.previewImageEl, {
          aspectRatio: 1 / 1, // 默认比例
          preview: "#preview-image", // 预览视图
          guides: true, // 裁剪框的虚线(九宫格)
          autoCropArea: 0.5, // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8
          movable: true, // 是否允许移动图片
          dragCrop: true, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
          movable: true, // 是否允许移动剪裁框
          resizable: true, // 是否允许改变裁剪框的大小
          zoomable: true, // 是否允许缩放图片大小
          mouseWheelZoom: true, // 是否允许通过鼠标滚轮来缩放图片
          touchDragZoom: true, // 是否允许通过触摸移动来缩放图片
          rotatable: true, // 是否允许旋转图片
          crop: function(e) {
            // 输出结果数据裁剪图像
            console.log(e)
          }
        });
      }
      this.previewImageUrl = url;
      this.cropper.replace(url);
    },
    getRoundedCanvas(sourceCanvas) {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      let width = sourceCanvas.width;
      let height = sourceCanvas.height;
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = "destination-in";
      context.beginPath();
      context.rect(0, 0, width, height);
      context.fill();
      return canvas;
    },
    compress(base64) {
      let image = new Image();
      image.src = base64;
      image.onload = () => {
        let data = compress(image, this.orientation);
        // 压缩完成，将base64回调转换成Blob给父组件
        this.$emit("finish", base64Img2Blob(data));
      };
    },
    removeCrop() {
      // 取消裁剪，销毁裁剪对象
      this.cropper.destroy();
      this.cropper = null;
      this.$emit("hide");
    },
    startCrop() {
      // 开始裁剪
      setTimeout(() => {
        let croppedCanvas = this.cropper.getCroppedCanvas();
        let roundedCanvas = this.getRoundedCanvas(croppedCanvas);
        let base64 = roundedCanvas.toDataURL();
        this.compress(base64);
      }, 20);
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.crop-wrapper {
  height: calc(100% - 64px) !important;
  .crop-image-wrapper {
    margin-top: 50px;
    height: calc(100% - 100px) !important;
    text-align: center;
    img {
      max-width: 100%;
    }
  }
}
</style>
