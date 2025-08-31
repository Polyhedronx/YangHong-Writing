"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Info, Star, TrendingUp } from "lucide-react"

interface Essay {
  id: string
  title: string
  content: string
  status: "draft" | "submitted" | "reviewed"
  score?: number
}

interface FeedbackPanelProps {
  essay: Essay | null
}

export function FeedbackPanel({ essay }: FeedbackPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // 模拟反馈数据
  const mockFeedback = {
    overallScore: 85,
    categories: {
      grammar: { score: 90, feedback: "语法运用较好，句式多样" },
      structure: { score: 80, feedback: "文章结构清晰，但段落间过渡可以更自然" },
      content: { score: 85, feedback: "内容丰富，观点明确，例子恰当" },
      style: { score: 82, feedback: "语言表达流畅，但可以更加生动" },
    },
    suggestions: [
      {
        type: "grammar",
        severity: "low",
        message: "第二段第三句建议使用更准确的词汇",
        suggestion: '将"很好"改为"出色"或"卓越"',
      },
      {
        type: "structure",
        severity: "medium",
        message: "第三段与第四段之间缺少过渡",
        suggestion: '可以添加"此外"、"另一方面"等过渡词',
      },
      {
        type: "content",
        severity: "low",
        message: "可以增加更多具体例子",
        suggestion: "在论述观点时，可以引用具体的事例或数据",
      },
    ],
    strengths: ["文章主题明确，立意深刻", "语言表达流畅自然", "例证恰当，说服力强", "结构完整，层次分明"],
    improvements: ["注意词汇的准确性和多样性", "加强段落间的逻辑连接", "可以尝试更多修辞手法"],
  }

  const categories = [
    { id: "all", label: "全部", icon: Star },
    { id: "grammar", label: "语法", icon: CheckCircle },
    { id: "structure", label: "结构", icon: Info },
    { id: "content", label: "内容", icon: TrendingUp },
    { id: "style", label: "文采", icon: Star },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high":
        return "重要"
      case "medium":
        return "一般"
      case "low":
        return "建议"
      default:
        return "建议"
    }
  }

  if (!essay || essay.status === "draft") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">暂无反馈</h3>
        <p className="text-muted-foreground mb-4">{!essay ? "请先创建一篇作文" : "请提交作文后查看AI反馈"}</p>
        <Button variant="outline">去写作</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* 总体评分 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">作文评分</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-primary">{mockFeedback.overallScore}</div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">总分</div>
              <div className="text-lg font-semibold">100</div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(mockFeedback.categories).map(([key, category]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">
                    {key === "grammar" ? "语法" : key === "structure" ? "结构" : key === "content" ? "内容" : "文采"}
                  </span>
                  <span className="font-medium">{category.score}/100</span>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          )
        })}
      </div>

      {/* 详细反馈 */}
      <div className="flex-1 space-y-4 overflow-auto">
        {/* 优点 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              写作优点
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockFeedback.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-primary/5 rounded border-l-2 border-primary">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 改进建议 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-secondary">
              <AlertCircle className="w-5 h-5" />
              改进建议
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockFeedback.suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={getSeverityColor(suggestion.severity) as any}>
                    {getSeverityLabel(suggestion.severity)}
                  </Badge>
                  <Badge variant="outline">
                    {suggestion.type === "grammar"
                      ? "语法"
                      : suggestion.type === "structure"
                        ? "结构"
                        : suggestion.type === "content"
                          ? "内容"
                          : "文采"}
                  </Badge>
                </div>
                <div className="text-sm text-foreground">{suggestion.message}</div>
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded">💡 {suggestion.suggestion}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 改进方向 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-accent">
              <TrendingUp className="w-5 h-5" />
              改进方向
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockFeedback.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-accent/5 rounded border-l-2 border-accent">
                <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
