<template>
  <section
    class="crop-wrapper"
    id="crop-wrapper"
  >
    <div>
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
import { compress } from "@/utils/image.js";
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
          aspectRatio: aspectRatio || 1,
          autoCropArea: 0,
          viewMode: 1,
          dragMode: "move",
          guides: aspectRatio !== "Free",
          cropBoxResizable: aspectRatio !== "Free",
          cropBoxMovable: aspectRatio !== "Free",
          dragCrop: aspectRatio !== "Free",
          background: false,
          checkOrientation: true,
          checkCrossOrigin: true,
          zoomable: true,
          zoomOnWheel: false,
          center: false,
          toggleDragModeOnDblclick: false,
          ready: () => {
            if (aspectRatio === "Free") {
              let cropBox = this.cropper.cropBox;
              cropBox.querySelector("span.cropper-view-box").style.outline =
                "none";
              this.cropper.disable();
            }
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
        // 压缩完成，将base64回调给父组件
        this.$emit('finish', data)
      };
    },
    removeCrop() {
      // 取消裁剪，销毁裁剪对象
      this.$emit("hide");
      this.cropper.destroy();
      this.cropper = null;
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
</style>
