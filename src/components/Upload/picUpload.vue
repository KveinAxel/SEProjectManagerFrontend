<template>
    <div>
        <el-upload
            list-type="picture"
            action="/api/resource/image"
            :show-file-list="false"
            :headers="head"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            :on-success="handleUploadSuccess"
        >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
        </el-upload>
    </div>
</template>
<script>

import {getToken} from "@/utils/auth";

export default {
    name: 'picUpload',
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
        },
    }
}
</script>
<style>

</style>


