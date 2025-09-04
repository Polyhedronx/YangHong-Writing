"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Send,
  Lightbulb,
  BookOpen,
  Clock,
  ArrowLeft,
  Star,
  Target,
  Award,
  Zap,
  BarChart3,
  MessageSquare,
  CheckCircle,
} from "lucide-react"

interface Essay {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  status: "draft" | "submitted" | "reviewed"
  score?: number
}

interface EssayEditorProps {
  essay: Essay | null
  onEssayChange: (content: string, title: string) => void
  onGetFeedback: (content: string) => Promise<any[]>
}

export function EssayEditor({ essay, onEssayChange, onGetFeedback }: EssayEditorProps) {
  const [title, setTitle] = useState(essay?.title || "")
  const [content, setContent] = useState(essay?.content || "")
  const [wordCount, setWordCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [currentView, setCurrentView] = useState<"writing" | "feedback">("writing")
  const autoSaveTimer = useRef<NodeJS.Timeout>()

  const essayPrompts = [
    "我的校园生活",
    "难忘的课堂",
    "我的老师",
    "我的家人",
    "家庭聚餐",
    "未来的世界",
    "如果我会飞",
    "保护环境从我做起",
    "我的梦想",
    "第一次尝试",
  ]

  const allPrompts = essayPrompts

  useEffect(() => {
    const count = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    setWordCount(count)

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
    }

    if (count > 0) {
      autoSaveTimer.current = setTimeout(() => {
        handleAutoSave()
      }, 2000)
    }
  }, [content, title])

  const handleAutoSave = () => {
    if (content.trim() || title.trim()) {
      onEssayChange(content, title)
    }
  }

  const handleSave = () => {
    onEssayChange(content, title)
  }

  const aiHelpOptions = [
    { id: "opening", label: "生成作文开头", desc: "为你的作文创作引人入胜的开头" },
    { id: "expand", label: "段落扩写建议", desc: "帮助你丰富段落内容" },
    { id: "grammar", label: "语法错误检查", desc: "检查并修正语法问题" },
    { id: "structure", label: "结构优化建议", desc: "改善作文整体结构" },
  ]

  const handleAIHelp = async (type: string) => {
    if (!content.trim()) return

    setIsLoading(true)

    try {
      const feedback = await onGetFeedback(content)

      const newSuggestions = {
        opening: ["考虑用一个生动的场景描述开头", "可以从一个有趣的问题开始", "试试用对话或感叹句作为开头"],
        expand: ["添加更多具体的细节描述", "可以加入你的真实感受", "用比喻或拟人的修辞手法"],
        grammar: ["注意句子的完整性", "检查标点符号的使用", "避免重复用词"],
        structure: ["确保开头、正文、结尾结构清晰", "每段要有明确的中心思想", "段落之间要有逻辑连接"],
      }

      setSuggestions(newSuggestions[type as keyof typeof newSuggestions] || [])
    } catch (error) {
      console.error("获取AI帮助失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEssayStatus = () => {
    if (!content.trim() || wordCount < 50) {
      return { text: "待完成", variant: "secondary" as const, icon: Award }
    }
    if (essay?.status === "submitted") {
      return { text: "已提交", variant: "default" as const, icon: CheckCircle }
    }
    if (essay?.status === "reviewed") {
      return { text: "已批改", variant: "default" as const, icon: CheckCircle }
    }
    return { text: "草稿", variant: "secondary" as const, icon: Save }
  }

  const status = getEssayStatus()
  const recommendedWordCount = "300-500"

  const mockFeedback = {
    overallScore: 85,
    level: "良好",
    categories: {
      grammar: { score: 90, feedback: "语法运用较好，句式多样，标点符号使用规范" },
      structure: { score: 80, feedback: "文章结构清晰，层次分明，但段落间过渡可以更自然" },
      content: { score: 85, feedback: "内容丰富，观点明确，例子恰当，主题突出" },
      style: { score: 82, feedback: "语言表达流畅，词汇运用得当，但可以更加生动形象" },
      creativity: { score: 78, feedback: "想象力丰富，有一定创新性，可以尝试更多新颖的表达方式" },
    },
    detailedAnalysis: {
      wordDistribution: { 开头: 15, 正文: 70, 结尾: 15 },
      sentenceTypes: { 陈述句: 60, 疑问句: 15, 感叹句: 20, 祈使句: 5 },
      vocabularyLevel: "中等偏上",
      readability: "良好",
    },
    suggestions: [
      {
        type: "grammar",
        severity: "medium",
        position: "第二段第三句",
        message: "建议使用更准确的词汇",
        suggestion: '将"很好"改为"出色"或"卓越"',
        example: "原句：这个方法很好。\n建议：这个方法十分出色。",
      },
      {
        type: "structure",
        severity: "medium",
        position: "第三段与第四段之间",
        message: "缺少过渡连接",
        suggestion: '可以添加"此外"、"另一方面"等过渡词',
        example: "在第四段开头添加：此外，我们还应该...",
      },
      {
        type: "content",
        severity: "low",
        position: "全文",
        message: "可以增加更多具体例子",
        suggestion: "在论述观点时，可以引用具体的事例或数据",
        example: "例如：可以加入'据统计...'或'有一次...'等具体描述",
      },
    ],
    strengths: [
      "文章主题明确，立意深刻，体现了积极向上的价值观",
      "语言表达流畅自然，句式富有变化",
      "例证恰当，说服力强，逻辑清晰",
      "结构完整，层次分明，开头结尾呼应",
    ],
    improvements: [
      "注意词汇的准确性和多样性，避免重复用词",
      "加强段落间的逻辑连接，使文章更加连贯",
      "可以尝试更多修辞手法，如比喻、拟人等",
      "适当增加细节描写，让文章更加生动具体",
    ],
    nextSteps: ["多阅读优秀范文，学习表达技巧", "练习使用过渡词和连接词", "尝试写作不同类型的文章", "注重积累好词好句"],
  }

  const feedbackCategories = [
    { id: "all", label: "全部", icon: Star },
    { id: "score", label: "评分", icon: Award },
    { id: "analysis", label: "分析", icon: BarChart3 },
    { id: "suggestions", label: "建议", icon: MessageSquare },
    { id: "improvement", label: "提升", icon: Target },
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

  const handleSubmitEssay = () => {
    if (wordCount < 50) {
      return
    }
    /* TODO: 实际提交逻辑 */
  }

  const renderFeedbackView = () => {
    if (!essay || essay.status === "draft") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">暂无反馈</h3>
          <p className="text-muted-foreground mb-4">{!essay ? "请先创建一篇作文" : "请提交作文后查看AI反馈"}</p>
          <Button variant="outline" onClick={() => setCurrentView("writing")}>
            去写作
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 p-4 pb-2 border-b bg-background">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView("writing")}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回写作
            </Button>
            <h2 className="text-lg font-semibold">智能批改报告</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {feedbackCategories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView(category.id as "writing" | "feedback")}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 space-y-4">
            {(essay?.status === "reviewed" || currentView === "score") && (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-1">
                    <Award className="w-3 h-3 text-primary" />
                    综合评分
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2"></CardContent>
              </Card>
            )}

            {(essay?.status === "reviewed" || currentView === "analysis") && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    文章分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-xs">篇幅分布</h4>
                      {Object.entries(mockFeedback.detailedAnalysis.wordDistribution).map(([part, percentage]) => (
                        <div key={part} className="flex justify-between text-xs">
                          <span>{part}</span>
                          <span>{percentage}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-xs">句式分析</h4>
                      {Object.entries(mockFeedback.detailedAnalysis.sentenceTypes).map(([type, percentage]) => (
                        <div key={type} className="flex justify-between text-xs">
                          <span>{type}</span>
                          <span>{percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div className="text-xs">
                      <span className="text-muted-foreground">词汇水平：</span>
                      <span className="font-medium">{mockFeedback.detailedAnalysis.vocabularyLevel}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">可读性：</span>
                      <span className="font-medium">{mockFeedback.detailedAnalysis.readability}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentView === "all" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    写作亮点
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockFeedback.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-green-50 rounded border-l-2 border-green-500"
                    >
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{strength}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {(currentView === "all" || currentView === "suggestions") && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-orange-600">
                    <MessageSquare className="w-4 h-4" />
                    具体建议与改写示例
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      type: "grammar",
                      severity: "medium",
                      position: "第二段第三句",
                      message: "词汇选择可以更加精准",
                      original: "这个方法很好，能够帮助我们解决问题。",
                      suggestion: "使用更具体、更有力的形容词",
                      rewritten: "这个方法十分有效，能够帮助我们迅速解决问题。",
                      explanation: "将模糊的'很好'替换为具体的'十分有效'，增加'迅速'来强调效果",
                    },
                    {
                      type: "structure",
                      severity: "high",
                      position: "第三段与第四段之间",
                      message: "段落间缺少逻辑过渡",
                      original: "...这就是我的看法。\n\n另外一个重要的方面是...",
                      suggestion: "添加承上启下的过渡句",
                      rewritten: "...这就是我的看法。正是基于这样的认识，我们还需要关注另外一个重要的方面...",
                      explanation: "用'正是基于这样的认识'建立前后段落的逻辑联系",
                    },
                    {
                      type: "content",
                      severity: "low",
                      position: "第四段",
                      message: "论述可以更加具体生动",
                      original: "读书对我们很重要，我们应该多读书。",
                      suggestion: "加入具体例子和感受描述",
                      rewritten:
                        "读书如同与智者对话，每当我翻开《论语》，孔子的智慧便如甘露般滋润着我的心田。正如培根所说'读书使人充实'，我们应该让阅读成为生活的习惯。",
                      explanation: "用比喻修辞、具体书目、名人名言和个人感受让论述更加生动有力",
                    },
                    {
                      type: "style",
                      severity: "medium",
                      position: "全文",
                      message: "句式变化可以更丰富",
                      original: "我喜欢春天。春天很美。春天有很多花。",
                      suggestion: "运用不同句式和修辞手法",
                      rewritten: "我喜欢春天。你看，桃花笑红了脸，柳絮舞动着腰肢，整个世界都被这温柔的季节唤醒了。",
                      explanation: "将三个简单句改为一个复句，运用拟人修辞，增强表达效果",
                    },
                    {
                      type: "creativity",
                      severity: "low",
                      position: "结尾段",
                      message: "结尾可以更有感染力",
                      original: "总之，我们要好好学习。",
                      suggestion: "用呼应开头或展望未来的方式结尾",
                      rewritten:
                        "正如开头所说，学习是人生最美的风景。让我们在知识的海洋中扬帆起航，去拥抱那个更好的自己！",
                      explanation: "呼应开头，用比喻和感叹句增强感染力，给读者留下深刻印象",
                    },
                  ].map((suggestion, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-3 bg-orange-50">
                      <div className="flex items-center justify-between">
                        <Badge variant={getSeverityColor(suggestion.severity) as any} className="text-xs">
                          {getSeverityLabel(suggestion.severity)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.position}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-medium text-foreground">{suggestion.message}</div>

                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground bg-red-50 p-2 rounded border-l-2 border-red-400">
                            <strong>原文：</strong>
                            <div className="mt-1 font-mono text-xs">{suggestion.original}</div>
                          </div>

                          <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded border-l-2 border-green-400">
                            <strong>改写后：</strong>
                            <div className="mt-1 font-mono text-xs">{suggestion.rewritten}</div>
                          </div>

                          <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border-l-2 border-blue-400">
                            <strong>改写说明：</strong> {suggestion.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {(currentView === "all" || currentView === "improvement") && (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-blue-600">
                      <Target className="w-4 h-4" />
                      改进方向
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {mockFeedback.improvements.map((improvement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 bg-blue-50 rounded border-l-2 border-blue-500"
                      >
                        <Target className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{improvement}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-purple-600">
                      <Zap className="w-4 h-4" />
                      下一步行动
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {mockFeedback.nextSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 bg-purple-50 rounded border-l-2 border-purple-500"
                      >
                        <Zap className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{step}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderWritingView = () => (
    <div className="flex flex-col h-full p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            作文题目
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="输入作文标题..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />

          <div className="flex flex-wrap gap-2">
            {allPrompts.slice(0, 6).map((prompt, index) => (
              <Badge
                key={index}
                variant={title === prompt ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                onClick={() => setTitle(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">开始写作</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span
                  className={wordCount < 50 ? "text-orange-500" : wordCount > 500 ? "text-blue-500" : "text-green-500"}
                >
                  {wordCount} 字
                </span>
              </div>
              <Badge variant={status.variant} className="flex items-center gap-1">
                <status.icon className="w-3 h-3" />
                {status.text}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          <Textarea
            placeholder="在这里开始你的作文创作..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[300px] resize-none text-base leading-relaxed"
          />

          {suggestions.length > 0 && (
            <Card className="bg-accent/5 border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-accent">
                  <Lightbulb className="w-4 h-4" />
                  AI写作建议
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="text-sm text-muted-foreground p-2 bg-background rounded border-l-2 border-accent"
                  >
                    {suggestion}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleSave} className="flex-1 bg-transparent">
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>

            <Button
              onClick={handleSubmitEssay}
              disabled={!title.trim() || !content.trim() || wordCount < 50}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              提交批改
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return currentView === "writing" ? renderWritingView() : renderFeedbackView()
}
