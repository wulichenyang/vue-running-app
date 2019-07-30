<template>
  <section class="user-info-editor">
    <BackHeader title="个人信息" />
    <Crop
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
              :src="user.avatar !== '' ? `/img/avatar/${user.avatar}` :'/img/avatar/head.jpg'"
              alt="头像"
            >
            <!-- 头像上传 -->
            <input
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
          :addon="user.realname"
          arrow
          @click="onEditText(title = '用户名', key = 'realname' , value = user.realname, length = 6)"
        />
        <md-cell-item
          title="昵称"
          :addon="user.nickname"
          arrow
          @click="onEditText(title = '昵称', key = 'nickname', value = user.nickname, length = 7)"
        />
        <md-cell-item
          title="性别"
          :addon="user.gender === 0 ? '女' : user.gender === 1 ? '男' : '未知'"
          arrow
        />
        <md-cell-item
          title="年龄"
          :addon="user.age === 0 ? '未知': user.age"
          arrow
        />
        <md-cell-item
          title="个性签名"
          :addon="user.brief"
          arrow
          @click="onEditText(title = '个性签名', key = 'brief', value = user.brief, length = 20)"
        />
        <md-cell-item
          title="地址"
          :addon="user.address"
          arrow
        />
      </md-field>
    </SettingInfoSection>
    <transition name="right-left">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import { changeAvatar } from "@/api/user";
import BackHeader from "@/components/BackHeader.vue";
import Crop from "@/components/Crop.vue";
import SettingInfoSection from "@/components/SettingInfoSection.vue";
import { Field, CellItem, Toast } from "mand-mobile";
import { mapGetters, mapActions } from "vuex";
// TODO: Add Better-Scroll in some pages
export default {
  name: "userInfoEditor",
  components: {
    BackHeader: BackHeader,
    SettingInfoSection: SettingInfoSection,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    Crop: Crop
  },
  props: {},
  data() {
    return {};
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

    getFormData(img) {
      let formData = new FormData();
      formData.append("avatar", img, img.name);
      console.log("avatar", formData);
      return formData;
    },
    
    onCancelCrop() {

    },

    onCropFinish() {

    },
    // 修改头像
    async changeAvatar(event) {
      let img = event.target.files[0];
      console.log("img", img);
      // 检查图片有效性
      if (checkImg(img) === false) {
        return false;
      }

      // 构建提交表单
      let formData = getFormData(img);
      let res = await changeAvatar(formData);
      // 更新头像成功
      if (res.code === 0) {
        Toast.succeed(res.message);
        this.getUser();
      } else if (res.code === 1) {
        // 更新失败
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
}
</style>