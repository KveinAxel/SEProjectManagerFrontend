<template>
    <div>
        <el-upload
            list-type="text"
            :multiple="false"
            :http-request="putFile">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传doc/docx文件，且不超过10MB</div>
        </el-upload>
    </div>
</template>
<script>

import {uploadDocument} from "@/api/resource";

export default {
    name: 'docUpload',
    props: {
        value
    },
    data() {
        return {
        };
    },
    methods: {
        emitInput(val) {
            this.$emit('input', val)
        },
        putFile(param) {
            uploadDocument(param.file).then(response => {
                if (response.status === '200') {
                    this.value = response.data;
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    })
                } else {
                    this.$message.error(response.message);
                }
            })
        }
    }
}
</script>
<style>

</style>


