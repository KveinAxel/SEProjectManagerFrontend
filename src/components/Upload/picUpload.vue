<template>
    <div>
        <el-upload
            list-type="picture"
            action="/api/resource/image"
            :multiple="false" :show-file-list="showFileList"
            :file-list="fileList"
            :headers="head"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            :on-success="handleUploadSuccess"
        >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="fileList[0].url" alt="">
        </el-dialog>
    </div>
</template>
<script>

import {getToken} from "@/utils/auth";

export default {
    name: 'picUpload',
    props: {
        value: Object
    },
    computed: {
        imageUrl() {
            return this.value;
        },
        imageName() {
            if (this.value != null && this.value !== '') {
                return this.value.substr(this.value.lastIndexOf("/") + 1);
            } else {
                return null;
            }
        },
        fileList() {
            return [{
                name: this.imageName,
                url: this.imageUrl
            }]
        },
        showFileList: {
            get: function () {
                return this.value !== null && this.value !== '' && this.value !== undefined;
            },
            set: function (newValue) {
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            head: {
                'Authorization': getToken()
            }
        };
    },
    methods: {
        emitInput(val) {
            this.$emit('input', val)
        },
        handleRemove(file, fileList) {
            this.emitInput('');
        },
        handlePreview(file) {
            this.dialogVisible = true;
        },
        handleUploadSuccess(res, file) {
            this.value = res.data;
            window.resourceObject = res.data;
            this.showFileList = true;
            this.fileList.pop();
            this.fileList.push({name: file.name, url: this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name});
            this.emitInput(this.fileList[0].url);
        },
    }
}
</script>
<style>

</style>


