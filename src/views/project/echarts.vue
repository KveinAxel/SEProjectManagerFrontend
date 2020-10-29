<template>
    <div>
        <div ref="chart" style="width: 1200px;height:400px;">

        </div>
    </div>
</template>
<script>
    import store from '@/store'
    export default {
        name: "echarts",
        mounted() {
            setInterval(this.draw, 3000);
        },
        data() {
            return {
                tasks: [],
            }
        },
        methods: {
            draw() {
                let nodes = [];
                let edges = [];
                let taskMap = {};
                if (store.getters.eid) {
                    this.tasks = window.employeeTaskList;
                } else {
                    this.tasks = window.managerTaskList;
                }
                let m = {
                    'A': 0,
                    'B': 1,
                    'C': 2,
                };
                for (let item of this.tasks) {
                    nodes.push({'name': item.name, x: null, y: null, category: m[item.type]});
                    taskMap[item.id] = item.name;
                }
                for (let item of this.tasks) {
                    edges.push({source: taskMap[item.previousId], target: item.name});
                }

                let mc = this.$refs.chart;
                let myChart = this.$echarts.init(mc);
                let option = {
                    title: {
                        text: ''
                    },
                    tooltip: {},
                    animationDurationUpdate: 1000,
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
                            categories: ['A', 'B', 'C'],
                            center: [600, 200],
                            force: {
                                repulsion: 1000,
                                gravity: 0.1
                            },
                            // focusNodeAdjacency: true,

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
