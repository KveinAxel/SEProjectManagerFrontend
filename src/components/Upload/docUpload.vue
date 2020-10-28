<template>
    <div>
        <el-upload
            list-type="text"
            action="/api/resource/document"
            :multiple="false" :show-file-list="showFileList"
            :file-list="fileList"
            :on-remove="handleRemove"
            :headers="head"
            :on-preview="handlePreview"
            :on-success="handleUploadSuccess"
        >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传doc/docx文件，且不超过10MB</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="fileList[0].url" alt="">
        </el-dialog>
    </div>
</template>
<script>

import {getToken} from "../../utils/auth";

export default {
    name: 'docUpload',
    props: {
        value: String
    },
    computed: {
        docUrl() {
            return this.value;
        },
        docName() {
            if (this.value != null && this.value !== '') {
                return this.value.substr(this.value.lastIndexOf("/") + 1);
            } else {
                return null;
            }
        },
        fileList() {
            return [{
                name: this.docName,
                url: this.docUrl
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


