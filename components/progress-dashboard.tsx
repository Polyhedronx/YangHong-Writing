"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Trophy, Target, TrendingUp, Calendar, BookOpen } from "lucide-react"

export function ProgressDashboard() {
  // 模拟进度数据
  const progressData = {
    totalEssays: 15,
    averageScore: 82,
    improvementRate: 12,
    currentStreak: 7,
    achievements: [
      { id: "1", title: "初出茅庐", description: "完成第一篇作文", icon: "🎯", unlocked: true },
      { id: "2", title: "勤奋写手", description: "连续7天写作", icon: "🔥", unlocked: true },
      { id: "3", title: "进步之星", description: "分数提升超过10分", icon: "⭐", unlocked: true },
      { id: "4", title: "语法大师", description: "语法分数达到90分", icon: "📝", unlocked: false },
    ],
    weeklyScores: [
      { day: "周一", score: 78 },
      { day: "周二", score: 82 },
      { day: "周三", score: 85 },
      { day: "周四", score: 80 },
      { day: "周五", score: 88 },
      { day: "周六", score: 85 },
      { day: "周日", score: 90 },
    ],
    categoryProgress: [
      { category: "语法", current: 85, target: 90 },
      { category: "结构", current: 78, target: 85 },
      { category: "内容", current: 88, target: 90 },
      { category: "文采", current: 75, target: 80 },
    ],
    monthlyStats: [
      { month: "1月", essays: 3, avgScore: 75 },
      { month: "2月", essays: 5, avgScore: 78 },
      { month: "3月", essays: 7, avgScore: 82 },
      { month: "4月", essays: 6, avgScore: 85 },
    ],
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-auto">
      {/* 总览统计 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{progressData.totalEssays}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <BookOpen className="w-4 h-4" />
              总作文数
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">{progressData.averageScore}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Target className="w-4 h-4" />
              平均分数
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">+{progressData.improvementRate}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              本月提升
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">{progressData.currentStreak}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Calendar className="w-4 h-4" />
              连续天数
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 成就系统 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            我的成就
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {progressData.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                achievement.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-muted"
              }`}
            >
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className={`font-medium ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {achievement.title}
                </div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
              {achievement.unlocked && (
                <Badge variant="default" className="bg-primary">
                  已解锁
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 能力进度 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-secondary" />
            能力进度
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {progressData.categoryProgress.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.category}</span>
                <span className="text-muted-foreground">
                  {item.current}/{item.target}
                </span>
              </div>
              <Progress value={(item.current / item.target) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 本周分数趋势 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">本周分数趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData.weeklyScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 月度统计 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">月度统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="essays" fill="hsl(var(--primary))" name="作文数量" />
                <Bar dataKey="avgScore" fill="hsl(var(--secondary))" name="平均分数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
