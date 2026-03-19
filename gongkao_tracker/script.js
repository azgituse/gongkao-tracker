// 公考计划跟踪器应用
class GongKaoTracker {
    constructor() {
        this.totalDays = 120;
        this.currentDay = 1;
        this.completedDays = new Set();
        this.planConfig = null; // 初始化为空，将在initializeApp中设置
        this.planData = {}; // 初始化为空，将在initializeApp中设置

        // 显示加载消息
        document.getElementById('loadingMessage').style.display = 'block';

        // 异步初始化
        this.init();
    }

    async init() {
        this.planConfig = await this.loadPlanConfig();
        this.planData = this.generatePlanData();
        this.initializeApp();

        // 隐藏加载消息
        document.getElementById('loadingMessage').style.display = 'none';
    }

    // 加载计划配置
    async loadPlanConfig() {
        // 默认配置
        let config = {
            totalDays: 120,
            plan: {
                "1-20": {
                    "title": "行测基础阶段",
                    "description": "学习行测各模块基础知识，掌握基本解题技巧",
                    "subjects": ["言语理解", "数量关系", "判断推理", "资料分析", "常识判断"]
                },
                "21-40": {
                    "title": "行测专项练习",
                    "description": "分模块进行专项练习，强化各模块解题能力",
                    "subjects": ["言语理解专项", "数量关系专项", "判断推理专项", "资料分析专项", "常识判断专项"]
                },
                "41-60": {
                    "title": "行测强化训练",
                    "description": "综合训练，提升解题速度和准确率",
                    "subjects": ["综合练习", "模考训练", "错题回顾"]
                },
                "61-80": {
                    "title": "申论基础与素材积累",
                    "description": "学习申论写作技巧，积累写作素材",
                    "subjects": ["申论基础", "素材积累", "范文分析"]
                },
                "81-100": {
                    "title": "申论强化练习",
                    "description": "专题练习，提升写作水平",
                    "subjects": ["大作文训练", "小题练习", "热点分析"]
                },
                "101-120": {
                    "title": "综合冲刺阶段",
                    "description": "全真模考，查漏补缺，调整心态",
                    "subjects": ["全真模考", "错题复习", "心理调节"]
                }
            },
            milestones: [
                {"day": 20, "title": "完成行测基础学习"},
                {"day": 40, "title": "完成行测专项训练"},
                {"day": 60, "title": "完成行测强化训练"},
                {"day": 80, "title": "完成申论基础学习"},
                {"day": 100, "title": "完成申论强化练习"},
                {"day": 120, "title": "完成全部备考计划"}
            ]
        };

        // 尝试从外部配置文件加载计划
        try {
            // 使用fetch API加载配置
            const response = await fetch('plan_config.json');
            if (response.ok) {
                config = await response.json();
                this.totalDays = config.totalDays;
            } else {
                console.warn('配置文件加载失败，使用默认配置');
            }
        } catch (e) {
            console.warn('无法加载配置文件，使用默认配置:', e);
        }

        return config;
    }

    // 初始化应用
    initializeApp() {
        // 等待配置加载完成后再初始化UI
        if (this.planConfig) {
            this.loadProgress();
            this.updateUI();
            this.setupEventListeners();
            this.showCurrentWeek();
        } else {
            // 如果配置还未加载完成，稍后重试
            setTimeout(() => this.initializeApp(), 100);
        }
    }

    // 生成120天计划数据
    generatePlanData() {
        const plan = {};

        // 根据配置生成计划数据
        for (let i = 1; i <= this.totalDays; i++) {
            let dayPlan = {};
            let phase = null;

            // 根据当前天数确定所属阶段
            for (const [range, details] of Object.entries(this.planConfig.plan)) {
                const [start, end] = range.split('-').map(Number);

                if (i >= start && i <= end) {
                    phase = { start, end, ...details };
                    break;
                }
            }

            if (phase) {
                // 计算在当前阶段中的第几天
                const dayInPhase = i - phase.start;

                // 使用当天的具体计划内容
                if (phase.subjects && phase.subjects[dayInPhase]) {
                    dayPlan.title = `${phase.title}-第${i}天`;
                    dayPlan.description = phase.subjects[dayInPhase];
                } else {
                    // 如果没有对应日期的具体内容，使用阶段描述
                    dayPlan.title = `${phase.title}-第${i}天`;
                    dayPlan.description = phase.description;
                }
            } else {
                // 默认值
                dayPlan.title = `第${i}天计划`;
                dayPlan.description = `学习内容：暂未设定具体计划`;
            }

            plan[i] = dayPlan;
        }

        return plan;
    }

    // 设置事件监听器
    setupEventListeners() {
        document.getElementById('markCompleteBtn').addEventListener('click', () => {
            this.markCurrentDayComplete();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetCurrentDay();
        });

        document.getElementById('prevWeekBtn').addEventListener('click', () => {
            this.showPreviousWeek();
        });

        document.getElementById('nextWeekBtn').addEventListener('click', () => {
            this.showNextWeek();
        });
    }

    // 加载进度
    loadProgress() {
        const savedProgress = localStorage.getItem('gongkaoProgress');
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            this.completedDays = new Set(parsed.completedDays);
            this.currentDay = parsed.currentDay || 1;
        }

        // 设置今天日期显示
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('todayDate').textContent = today.toLocaleDateString('zh-CN', options);
    }

    // 保存进度
    saveProgress() {
        const progressData = {
            completedDays: Array.from(this.completedDays),
            currentDay: this.currentDay
        };
        localStorage.setItem('gongkaoProgress', JSON.stringify(progressData));
    }

    // 标记当前天完成
    markCurrentDayComplete() {
        if (!this.completedDays.has(this.currentDay)) {
            this.completedDays.add(this.currentDay);

            // 如果当前是最后一天，则不前进到下一天
            if (this.currentDay < this.totalDays) {
                this.currentDay++;
            }

            this.saveProgress();
            this.updateUI();

            // 添加视觉反馈
            const btn = document.getElementById('markCompleteBtn');
            btn.textContent = '已标记！';
            setTimeout(() => {
                btn.textContent = '标记为完成';
            }, 1000);
        }
    }

    // 重置当前天状态
    resetCurrentDay() {
        this.completedDays.delete(this.currentDay);
        this.saveProgress();
        this.updateUI();
    }

    // 显示上一周
    showPreviousWeek() {
        const currentStart = parseInt(document.getElementById('currentWeekText').textContent.split('-')[0]);
        const newStart = Math.max(1, currentStart - 7);
        this.displayWeek(newStart);
    }

    // 显示下一周
    showNextWeek() {
        const currentStart = parseInt(document.getElementById('currentWeekText').textContent.split('-')[0]);
        const newStart = Math.min(this.totalDays - 6, currentStart + 7);
        this.displayWeek(newStart);
    }

    // 显示指定周
    showCurrentWeek() {
        const startDay = Math.floor((this.currentDay - 1) / 7) * 7 + 1;
        this.displayWeek(startDay);
    }

    // 显示特定周的计划
    displayWeek(startDay) {
        const weekGrid = document.getElementById('weekGrid');
        weekGrid.innerHTML = '';

        const endDay = Math.min(startDay + 6, this.totalDays);
        document.getElementById('currentWeekText').textContent = `${startDay}-${endDay}天`;

        for (let day = startDay; day <= endDay; day++) {
            if (day > this.totalDays) break;

            const dayCard = document.createElement('div');
            dayCard.className = `day-card ${this.getCardClass(day)}`;
            dayCard.dataset.day = day;

            dayCard.innerHTML = `
                <div class="day-number">${day}</div>
                <div class="day-title-sm">${this.planData[day]?.title || `第${day}天`}</div>
            `;

            dayCard.addEventListener('click', () => {
                this.goToDay(day);
            });

            weekGrid.appendChild(dayCard);
        }
    }

    // 获取卡片样式类
    getCardClass(day) {
        if (day === this.currentDay) {
            return 'current';
        } else if (this.completedDays.has(day)) {
            return 'completed';
        } else {
            return 'pending';
        }
    }

    // 跳转到指定天
    goToDay(day) {
        this.currentDay = day;
        this.saveProgress();
        this.updateUI();
        this.showCurrentWeek();
    }

    // 更新UI
    updateUI() {
        // 更新总进度
        const progressPercent = Math.round((this.completedDays.size / this.totalDays) * 100);
        document.getElementById('overallProgress').style.width = `${progressPercent}%`;
        document.getElementById('progressPercent').textContent = `${progressPercent}%`;

        // 更新统计信息
        document.getElementById('completedDays').textContent = this.completedDays.size;
        document.getElementById('currentDay').textContent = this.currentDay;
        document.getElementById('remainingDays').textContent = this.totalDays - this.completedDays.size;

        // 更新今日计划
        this.updateDailyPlan();
    }

    // 更新今日计划显示
    updateDailyPlan() {
        const dailyPlanEl = document.getElementById('dailyPlan');
        const dayData = this.planData[this.currentDay];

        if (dayData) {
            const status = this.completedDays.has(this.currentDay) ?
                '<span class="day-status status-completed">✓ 已完成</span>' :
                '<span class="day-status status-pending">○ 待完成</span>';

            dailyPlanEl.innerHTML = `
                <div class="day-item">
                    <div class="day-title">${dayData.title}</div>
                    <div class="day-description">${dayData.description}</div>
                    ${status}
                </div>
            `;
        } else {
            dailyPlanEl.innerHTML = '<p>暂无计划内容</p>';
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new GongKaoTracker();
});