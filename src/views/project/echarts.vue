<template>
    <div>
        <div ref="chart" style="width: 600px;height:400px;">

        </div>
    </div>
</template>
<script>

    export default {
        name: "echarts",
        props: {
            // tasks: [{
            //     "id": String,
            //     "previousId": [String],
            //     "name": String,
            //     "type": String,
            //     "status": String,    // CREATED - 创建；ACTIVE - 执行中；INACTIVE - 随项目暂停; WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回 ; WAIT_REVIEW - 等待审核
            // }]
            task: Array
        },
        mounted() {
            this.draw();
        },
        watch: {
            isShow() {
                this.draw();
            }
        },
        computed: {
            tasks() {
                return this.task
            }
        },
        data() {
            return {}
        },
        methods: {
            draw() {
                let nodes = [];
                let edges = [{
                    source: 0,
                    target: 1,
                    symbolSize: [5, 20],
                    label: {
                        show: true
                    },
                    lineStyle: {
                        width: 5,
                        curveness: 0.2
                    }
                }];
                let taskMap = {};
                console.log(this.tasks);
                window.tasks = this.tasks;
                for (let item of this.tasks) {
                    nodes.push({'name': item.name, x: null, y: null});
                    console.log(item);
                    taskMap[item.id] = item.name;
                }
                for (let item of this.tasks) {
                    edges.push({source: taskMap[item.previousId], target: item.name});
                }
                console.log(nodes);
                console.log(edges);

                let mc = this.$refs.chart;
                let myChart = this.$echarts.init(mc);
                let option = {
                    title: {
                        text: ''
                    },
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            symbolSize: 50,
                            roam: true,
                            label: {
                                show: true
                            },
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                fontSize: 20
                            },
                            data: nodes,
                            // links: [],
                            links: edges,
                            lineStyle: {
                                opacity: 0.9,
                                width: 2,
                                curveness: 0
                            },
                            force: {
                                repulsion: 1000
                            }
                        }
                    ]
                };
                myChart.setOption(option);
            }
        }
    }
</script>

<style scoped>

</style>
