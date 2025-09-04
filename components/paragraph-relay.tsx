"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, BookOpen, Target, ArrowRight, Shuffle } from "lucide-react"

interface StoryChoice {
  id: string
  text: string
  nextSceneId?: string
  effect?: "positive" | "negative" | "neutral"
}

interface StoryScene {
  id: string
  title: string
  description: string
  content: string
  choices: StoryChoice[]
  isEnding?: boolean
  category: "narrative" | "argumentative" | "descriptive"
}

interface GameSession {
  id: string
  currentSceneId: string
  selectedChoices: string[]
  generatedParagraphs: string[]
  startTime: number
  isComplete: boolean
}

interface WritingFramework {
  id: string
  name: string
  structure: string[]
  description: string
  example: string
  tips: string[]
}

// 后端API接口预留
class ParagraphGameAPI {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  static async getStoryScenes(): Promise<StoryScene[]> {
    // TODO: 实现获取故事场景接口
    return mockScenes
  }

  static async generateParagraph(sceneId: string, choiceId: string): Promise<string> {
    // TODO: 实现根据选择生成文段接口
    return mockParagraphs[Math.floor(Math.random() * mockParagraphs.length)]
  }

  static async saveGameSession(session: GameSession): Promise<void> {
    // TODO: 实现保存游戏会话接口
    console.log("保存游戏会话:", session)
  }

  static async getFrameworks(): Promise<WritingFramework[]> {
    // TODO: 实现获取写作框架接口
    return mockFrameworks
  }
}

const mockScenes: StoryScene[] = [
  {
    id: "start",
    title: "故事开始",
    description: "选择你的故事开头方式",
    content: "你准备开始写一篇作文，选择你想要的开头方式：",
    category: "narrative",
    choices: [
      { id: "desc_start", text: "用环境描写开头", nextSceneId: "desc_scene" },
      { id: "dialog_start", text: "用对话开头", nextSceneId: "dialog_scene" },
      { id: "action_start", text: "用动作描写开头", nextSceneId: "action_scene" },
    ],
  },
  {
    id: "desc_scene",
    title: "环境描写",
    description: "选择环境描写的重点",
    content: "你选择了环境描写开头，现在选择描写的重点：",
    category: "descriptive",
    choices: [
      { id: "weather", text: "描写天气变化", nextSceneId: "development" },
      { id: "scenery", text: "描写周围景色", nextSceneId: "development" },
      { id: "atmosphere", text: "营造特定氛围", nextSceneId: "development" },
    ],
  },
  {
    id: "dialog_scene",
    title: "对话开头",
    description: "选择对话的类型",
    content: "你选择了对话开头，现在选择对话的类型：",
    category: "narrative",
    choices: [
      { id: "question", text: "疑问式对话", nextSceneId: "development" },
      { id: "exclaim", text: "感叹式对话", nextSceneId: "development" },
      { id: "normal", text: "平述式对话", nextSceneId: "development" },
    ],
  },
  {
    id: "action_scene",
    title: "动作描写",
    description: "选择动作描写的角度",
    content: "你选择了动作描写开头，现在选择描写角度：",
    category: "narrative",
    choices: [
      { id: "detailed", text: "细致入微的动作", nextSceneId: "development" },
      { id: "swift", text: "快速连贯的动作", nextSceneId: "development" },
      { id: "emotional", text: "带有情感的动作", nextSceneId: "development" },
    ],
  },
  {
    id: "development",
    title: "情节发展",
    description: "选择故事发展方向",
    content: "现在选择你的故事发展方向：",
    category: "narrative",
    choices: [
      { id: "conflict", text: "引入冲突矛盾", nextSceneId: "ending" },
      { id: "emotion", text: "深入情感描写", nextSceneId: "ending" },
      { id: "twist", text: "添加意外转折", nextSceneId: "ending" },
    ],
  },
  {
    id: "ending",
    title: "故事结尾",
    description: "选择结尾方式",
    content: "最后，选择你的结尾方式：",
    category: "narrative",
    isEnding: true,
    choices: [
      { id: "summary", text: "总结升华", effect: "positive" },
      { id: "open", text: "开放式结尾", effect: "neutral" },
      { id: "echo", text: "首尾呼应", effect: "positive" },
    ],
  },
]

const mockParagraphs = [
  "夕阳西下，金色的光芒洒在大地上，微风轻抚着脸颊，带来阵阵花香。在这个宁静的黄昏，我独自走在小径上，思绪万千。",
  '"你真的决定了吗？"妈妈的声音在耳边响起，带着一丝担忧和不舍。我转过身，看着她眼中的期待，心中涌起一阵暖流。',
  "我紧紧握住手中的笔，深深吸了一口气，然后在纸上写下第一个字。这个简单的动作，却承载着我内心的千言万语。",
  "突然，一阵急促的脚步声打破了教室的宁静。同学们纷纷抬起头，只见老师匆忙走进教室，脸上带着从未见过的严肃表情。",
  "回想起这段经历，我深深地感受到了成长的意义。每一次挫折都是一次历练，每一次坚持都是一次超越。这就是青春，这就是成长。",
]

const mockFrameworks: WritingFramework[] = [
  {
    id: "1",
    name: "记叙文六要素",
    structure: ["时间", "地点", "人物", "事件起因", "经过", "结果"],
    description: "记叙文的基本框架，确保故事完整性",
    example: "在某个时间，某个地点，某个人物因为某个原因做了某件事，经过了什么过程，最后得到了什么结果。",
    tips: ["时间地点要具体", "人物性格要鲜明", "事件要有波澜"],
  },
  {
    id: "2",
    name: "议论文三段式",
    structure: ["提出论点", "论证分析", "总结升华"],
    description: "经典的议论文结构，逻辑清晰有力",
    example: "开头提出明确观点，中间用事实和道理证明，结尾总结并升华主题。",
    tips: ["论点要鲜明", "论据要充分", "论证要严密"],
  },
]

export function ParagraphRelay() {
  const [activeTab, setActiveTab] = useState<"game" | "framework">("game")
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null)
  const [scenes, setScenes] = useState<StoryScene[]>([])
  const [frameworks, setFrameworks] = useState<WritingFramework[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    loadScenes()
    loadFrameworks()
  }, [])

  const loadScenes = async () => {
    try {
      const data = await ParagraphGameAPI.getStoryScenes()
      setScenes(data)
    } catch (error) {
      console.error("加载场景失败:", error)
    }
  }

  const loadFrameworks = async () => {
    try {
      const data = await ParagraphGameAPI.getFrameworks()
      setFrameworks(data)
    } catch (error) {
      console.error("加载框架失败:", error)
    }
  }

  const startNewGame = () => {
    const startScene = scenes.find((scene) => scene.id === "start")
    if (!startScene) return

    const newSession: GameSession = {
      id: Date.now().toString(),
      currentSceneId: "start",
      selectedChoices: [],
      generatedParagraphs: [],
      startTime: Date.now(),
      isComplete: false,
    }

    setGameSession(newSession)
    setCurrentScene(startScene)
    setDisplayedText("")
  }

  const handleChoice = async (choice: StoryChoice) => {
    if (!gameSession || !currentScene) return

    setIsAnimating(true)

    try {
      // 生成对应的文段
      const paragraph = await ParagraphGameAPI.generateParagraph(currentScene.id, choice.id)

      // 更新游戏状态
      const updatedSession = {
        ...gameSession,
        selectedChoices: [...gameSession.selectedChoices, choice.id],
        generatedParagraphs: [...gameSession.generatedParagraphs, paragraph],
      }

      // 播放文段动画
      await playTextAnimation(paragraph)

      // 检查是否有下一个场景
      if (choice.nextSceneId) {
        const nextScene = scenes.find((scene) => scene.id === choice.nextSceneId)
        if (nextScene) {
          setCurrentScene(nextScene)
          updatedSession.currentSceneId = nextScene.id

          if (nextScene.isEnding) {
            updatedSession.isComplete = true
          }
        }
      }

      setGameSession(updatedSession)
      await ParagraphGameAPI.saveGameSession(updatedSession)
    } catch (error) {
      console.error("处理选择失败:", error)
    } finally {
      setIsAnimating(false)
    }
  }

  const playTextAnimation = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      setDisplayedText("")
      setIsPlaying(true)

      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setIsPlaying(false)
          resolve()
        }
      }, 50) // 调整速度
    })
  }

  const resetGame = () => {
    setGameSession(null)
    setCurrentScene(null)
    setDisplayedText("")
    setIsPlaying(false)
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "narrative":
        return "记叙文"
      case "argumentative":
        return "议论文"
      case "descriptive":
        return "抒情文"
      default:
        return category
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-2">文段接龙</h2>
        <p className="text-sm text-muted-foreground">通过选择构建文段，体验不同的写作路径</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="game" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            文字游戏
          </TabsTrigger>
          <TabsTrigger value="framework" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            写作框架
          </TabsTrigger>
        </TabsList>

        <TabsContent value="game" className="flex-1 flex flex-col p-4 space-y-4">
          {!gameSession ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">文段接龙游戏</h3>
                <p className="text-muted-foreground">通过选择不同选项，构建你的专属文段</p>
              </div>

              <Card className="w-full max-w-md">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">游戏规则</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 text-left">
                      <li>• 根据场景选择不同的写作方向</li>
                      <li>• 系统会根据你的选择生成对应文段</li>
                      <li>• 观看文段的动态展示效果</li>
                      <li>• 体验不同选择带来的写作风格</li>
                    </ul>
                  </div>
                  <Button onClick={startNewGame} className="w-full" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    开始游戏
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{getCategoryName(currentScene?.category || "")}</Badge>
                  <span className="text-sm text-muted-foreground">第 {gameSession.selectedChoices.length + 1} 步</span>
                </div>
                <Button variant="ghost" size="sm" onClick={resetGame}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新开始
                </Button>
              </div>

              {currentScene && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{currentScene.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{currentScene.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base mb-4">{currentScene.content}</p>
                  </CardContent>
                </Card>
              )}

              {displayedText && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-primary animate-pulse" />
                        ) : (
                          <Play className="w-4 h-4 text-primary" />
                        )}
                        <span className="text-sm font-medium">生成的文段</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">{displayedText}</p>
                    {isPlaying && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                        <div
                          className="w-1 h-1 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-1 h-1 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span className="ml-2">正在生成...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {currentScene && !isAnimating && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">选择你的写作方向：</h4>
                  <div className="grid gap-3">
                    {currentScene.choices.map((choice) => (
                      <Button
                        key={choice.id}
                        variant="outline"
                        className="h-auto p-4 text-left justify-start bg-transparent"
                        onClick={() => handleChoice(choice)}
                        disabled={isAnimating}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="flex-1">{choice.text}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {gameSession.isComplete && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">游戏完成！</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-green-700">
                      恭喜你完成了这次文段接龙游戏！你总共生成了 {gameSession.generatedParagraphs.length} 个文段。
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={startNewGame} size="sm">
                        <Shuffle className="w-4 h-4 mr-2" />
                        再玩一次
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetGame}>
                        返回首页
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="framework" className="flex-1 p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">写作框架指导</h3>

            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {frameworks.map((framework) => (
                  <Card key={framework.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{framework.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{framework.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">结构框架:</h4>
                        <div className="flex flex-wrap gap-2">
                          {framework.structure.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <Badge variant="outline">{item}</Badge>
                              {index < framework.structure.length - 1 && (
                                <ArrowRight className="w-3 h-3 mx-2 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">示例说明:</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{framework.example}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">写作技巧:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {framework.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
