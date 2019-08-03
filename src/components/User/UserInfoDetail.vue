<template>
  <section class="user-info-editor">
    <BackHeader title="个人信息" />
    <Crop
      v-show="showCrop"
      ref="crop"
      @hide="onCancelCrop"
      @finish="onCropFinish"
    />
    <SettingInfoSection>
      <md-field>
        <label for="my_file">
          <md-cell-item
            title="头像"
            arrow
          >
            <img
              class="avatar"
              slot="right"
              :src="(user && user.avatar !== '' ? `/img/avatar/${user.avatar}` :'/img/avatar/head.jpg') || '/img/avatar/head.jpg'"
              alt="头像"
            >
            <!-- 头像上传 -->
            <input
              v-if="!destroyInput"
              type="file"
              ref="upload"
              name="avatar"
              id='my_file'
              style="display:none;"
              accept="image/jpg,image/jpeg,image/png,image/gif"
              @change="changeAvatar"
            />
          </md-cell-item>
        </label>
        <md-cell-item
          title="用户名"
          :addon="user && user.realname"
          arrow
          @click="onEditText(title = '用户名', key = 'realname' , value = user && user.realname, length = 6)"
        />
        <md-cell-item
          title="昵称"
          :addon="user && user.nickname"
          arrow
          @click="onEditText(title = '昵称', key = 'nickname', value = user && user.nickname, length = 7)"
        />
        <md-cell-item
          title="性别"
          :addon="user && user.gender === 0 ? '女' : user && user.gender === 1 ? '男' : '保密'"
          arrow
          @click="showGenderSelector"
        />
        <md-cell-item
          title="生日"
          :addon="user && user.birth.split('T')[0]"
          arrow
          @click="showBirthPicker"
        />
        <md-cell-item
          title="个性签名"
          :addon="user && user.brief"
          arrow
          @click="onEditText(title = '个性签名', key = 'brief', value = user && user.brief, length = 20)"
        />
        <md-cell-item
          title="地址"
          :addon="user && user.address"
          arrow
        />
      </md-field>
    </SettingInfoSection>

    <!-- 性别选择 -->
    <md-selector
      v-model="isSelectorShow"
      :default-value="user && user.gender"
      :data="genderData"
      max-height="320px"
      title="选择性别"
      large-radius
      @choose="onChooseGender"
    ></md-selector>

    <!-- 生日选择 -->
    <md-date-picker
      v-model="isDatePickerShow"
      ref="datePicker"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="new Date(user && user.birth)"
      :title="`选择生日`"
      @confirm="onDatePickerConfirm"
    ></md-date-picker>

    <transition name="right-left">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import { changeAvatar } from "@/api/user";
import { getObjectUrl } from "@/utils/image.js";
import BackHeader from "@/components/BackHeader.vue";
import Crop from "@/components/Crop.vue";
import SettingInfoSection from "@/components/SettingInfoSection.vue";
import { Field, CellItem, Toast, Selector, DatePicker } from "mand-mobile";
import { mapGetters, mapActions } from "vuex";
import Exif from "exif-js";
import { updateUser } from "../../api/user";
import { localDate } from "@/utils/time.js";

// TODO: Add Better-Scroll in some pages
export default {
  name: "userInfoDetail",
  components: {
    BackHeader: BackHeader,
    SettingInfoSection: SettingInfoSection,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [Selector.name]: Selector,
    [DatePicker.name]: DatePicker,
    Crop: Crop
  },
  props: {},
  data() {
    return {
      filename: "", // 上传头像名
      orientation: null, // 裁切角度
      showCrop: false, // 显示裁剪头像组件
      destroyInput: false, // 删除头像上传input
      isSelectorShow: false, // 性别
      isDatePickerShow: false, // 生日
      genderData: [
        {
          value: 0,
          text: "女"
        },
        {
          value: 1,
          text: "男"
        },
        {
          value: 2,
          text: "保密"
        }
      ],
      minDate: new Date("1900/1/1"),
      maxDate: new Date()
    };
  },
  computed: {
    ...mapGetters(["user", "editing"])
  },
  methods: {
    // 修改文本
    onEditText(title, key, value, length) {
      this.setUserEditing({
        title,
        key,
        value,
        length
      });
      this.$router.push({
        name: "editingForm"
      });
    },

    checkImg(img) {
      // 上传数量检测
      if (img.length > 1) {
        Toast.failed("最多上传一张图片");
        return false;
      }
      // 上传类型检测
      if (
        ["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(
          img.type
        ) < 0
      ) {
        Toast.Toast("请选择图片");
        return false;
      }
      let size = img.size;
      // 图片不大于3M
      if (size > 3 * 1024 * 1024) {
        Toast.failed("图片不要超过3M");
        return false;
      }
      return true;
    },

    initFormData(imgBlob) {
      let formData = new FormData();
      formData.append("avatar", imgBlob, this.filename);
      console.log("avatar", formData);
      return formData;
    },
    // TODO:
    // - fix taking photo for avatar
    // - diable submit button
    // 取消并隐藏裁切组件
    onCancelCrop() {
      this.showCrop = false;
    },

    // 提交头像文件
    async onCropFinish(img) {
      // 构建提交表单
      let formData = this.initFormData(img);
      let res = await changeAvatar(formData);
      // 更新头像成功
      if (res.code === 0) {
        Toast.succeed(res.message);
        this.getUser();
      } else if (res.code === 1) {
        // 更新失败
        Toast.failed(res.message);
      }
      // 销毁裁剪组件
      this.$refs.crop.removeCrop();
    },
    // 重新加载input
    // 防止重名图片不触发onchange，
    initImgInput() {
      this.destroyInput = true;
      setTimeout(() => {
        this.destroyInput = false;
      }, 20);
    },
    // 修改头像
    changeAvatar(event) {
      let img = event.target.files[0];
      console.log("img", img);

      // 检查图片有效性
      if (this.checkImg(img) === false) {
        return false;
      }

      // 获取选区图片的临时引用路径
      let url = getObjectUrl(img);

      // 保存图片名
      this.filename = img.name;

      // 防止第二次选择相同名称图片时不触发onChange，每次都重新加载input
      this.initImgInput();

      // 初始化裁剪框
      Exif.getData(img, () => {
        let orientation = Exif.getTag(img, "Orientation");
        console.log(orientation);
        this.orientation = orientation;
        let url = getObjectUrl(img);
        this.showCrop = true; // 显示裁剪组件
        this.$refs.crop.initCrop(url, this.orientation);
      });

      // 提交头像文件表单 => Crop.vue $emit触发onCropFinsh
    },

    showGenderSelector() {
      this.isSelectorShow = true;
    },

    showBirthPicker() {
      this.isDatePickerShow = true;
    },

    async onDatePickerConfirm(columnsValue) {
      const date = localDate(this.$refs.datePicker.getFormatDate("yyyy/MM/dd"));
      let res = await updateUser("birth", date);
      if (res.code === 0) {
        // 成功
        this.getUser();
      } else if (res.code === 1) {
        // 失败
        Toast.failed("更新生日失败");
      }
    },

    async onChooseGender({ text, value }) {
      console.log(value);
      let res = await updateUser("gender", value);
      if (res.code === 0) {
        this.getUser();
      } else {
        Toast.failed(res.message);
      }
    },
    ...mapActions(["setUserEditing", "getUser"])
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-info-editor {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
  transition: all ease 0.4s;
  background-color: $mainBgGrayColor;
  .md-field {
    zoom: 0.5;
    padding: 0;
    .md-cell-item-right {
      img {
        width: $avatarBigSize;
        overflow: hidden;
        border-radius: 50%;
      }
    }
  }
  .md-selector {
    zoom: 0.5;
  }
  .md-date-picker {
    .md-popup-title-bar {
      zoom: 0.6;
    }
    .md-popup-box {
      zoom: 0.8;
    }
  }
}
</style>