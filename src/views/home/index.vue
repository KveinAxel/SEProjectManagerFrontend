<template>
    <div style="margin: 30px 30px 30px 30px">
        <el-card class="operate-container" shadow="never" style="margin-top: 30px">
            <i class="el-icon-tickets"></i>
            <span>项目状态</span>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-row>
                <el-col :span="1">暂停:</el-col>
                <el-col :span="23">
                    <el-progress :text-inside="true" :stroke-width="22" :percentage="project['INACTIVE']" status="warning"></el-progress>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px">
                <el-col :span="1">启动</el-col>
                <el-col :span="23">
                    <el-progress :text-inside="true" :stroke-width="24" :percentage="project['ACTIVE']"
                                 status="success"></el-progress>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="1">完成</el-col>
                <el-col :span="23">
                    <el-progress :text-inside="true" :stroke-width="26" :percentage="project['DONE']"
                    ></el-progress>
                </el-col>
            </el-row>

        </el-card>
        <el-card class="operate-container" shadow="never" style="margin-top: 30px">
            <i class="el-icon-tickets"></i>
            <span>任务状态</span>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-row style="text-align: center" type="flex" justify="center">
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" :percentage="task['CREATED']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        创建
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" :percentage="task['ACTIVE']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        运行
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" status="warning" :percentage="task['INACTIVE']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        暂停
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" :percentage="task['WAIT_COMMIT']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        等待结果
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" :percentage="task['WAIT_REVIEW']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        等待审核
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" status="success" :percentage="task['DONE']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        完成
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" status="exception"
                                     :percentage="task['REJECTED']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        被打回
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import store from '@/store'
    import {taskStat} from "../../api/task";

    export default {
        name: "index",
        data() {
            return {
                task: {},
                project: {}
            }
        },
        created() {
            taskStat().then(response => {
                if (response.status === 200) {
                    this.task = response.data.task;
                    this.project = response.data.project;
                    for (let key in this.task) {
                        this.task[key] = this.task[key] * 100;
                        this.task[key] = parseFloat(this.task[key].toFixed(2));
                    }
                    for (let key in this.project) {
                        this.project[key] *= 100;
                        this.project[key] = parseFloat(this.project[key].toFixed(2));
                    }

                } else {
                    this.$message.error(response.message);
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .panel-group {
        margin-top: 18px;

        .card-panel-col {
            margin-bottom: 32px;
        }

        .card-panel {
            height: 108px;
            cursor: pointer;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #fff;
            box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
            border-color: rgba(0, 0, 0, .05);

            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }

                .icon-people {
                    background: #40c9c6;
                }

                .icon-message {
                    background: #36a3f7;
                }

                .icon-money {
                    background: #f4516c;
                }

                .icon-shopping {
                    background: #34bfa3
                }
            }

            .icon-people {
                color: #40c9c6;
            }

            .icon-message {
                color: #36a3f7;
            }

            .icon-money {
                color: #f4516c;
            }

            .icon-shopping {
                color: #34bfa3
            }

            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }

            .card-panel-icon {
                float: left;
                font-size: 48px;
            }

            .card-panel-description {
                float: right;
                font-weight: bold;
                margin: 26px;
                margin-left: 0px;

                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 16px;
                    margin-bottom: 12px;
                }

                .card-panel-num {
                    font-size: 20px;
                }
            }
        }
    }

    @media (max-width: 550px) {
        .card-panel-description {
            display: none;
        }

        .card-panel-icon-wrapper {
            float: none !important;
            width: 100%;
            height: 100%;
            margin: 0 !important;

            .svg-icon {
                display: block;
                margin: 14px auto !important;
                float: none !important;
            }
        }
    }
</style>
