"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Send, Lightbulb, BookOpen, Clock } from "lucide-react"

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

  useEffect(() => {
    setWordCount(
      content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    )
  }, [content])

  const handleSave = () => {
    onEssayChange(content, title)
  }

  const handleGetAIHelp = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const feedback = await onGetFeedback(content)
      // 处理AI建议
      setSuggestions([
        "考虑在开头添加一个引人入胜的问题",
        "可以使用更多具体的例子来支持你的观点",
        "结尾部分可以更好地总结全文要点",
      ])
    } catch (error) {
      console.error("获取AI帮助失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const essayPrompts = ["我的梦想", "难忘的一天", "我最敬佩的人", "保护环境从我做起", "读书的乐趣"]

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* 作文题目选择 */}
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
            {essayPrompts.map((prompt, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setTitle(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 写作区域 */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">开始写作</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{wordCount} 字</span>
              </div>
              <Badge variant={essay?.status === "draft" ? "secondary" : "default"}>
                {essay?.status === "draft" ? "草稿" : essay?.status === "submitted" ? "已提交" : "已批改"}
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

          {/* AI建议区域 */}
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

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleSave} className="flex-1 bg-transparent">
              <Save className="w-4 h-4 mr-2" />
              保存草稿
            </Button>

            <Button
              variant="secondary"
              onClick={handleGetAIHelp}
              disabled={isLoading || !content.trim()}
              className="flex-1"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {isLoading ? "分析中..." : "AI帮助"}
            </Button>

            <Button
              onClick={() => {
                /* TODO: 提交作文 */
              }}
              disabled={!title.trim() || !content.trim()}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              提交作文
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
