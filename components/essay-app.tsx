"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EssayEditor } from "./essay-editor"
import { FeedbackPanel } from "./feedback-panel"
import { ParagraphRelay } from "./paragraph-relay" // 导入文段接龙组件替代进度模块
import { ProfilePanel } from "./profile-panel"
import { CoursePlayer } from "./course-player"
import { PenTool, MessageSquare, BarChart3, User, Menu, X, Play } from "lucide-react"

// 后端接口类型定义
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface Essay {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  status: "draft" | "submitted" | "reviewed"
  score?: number
  feedback?: Feedback[]
}

interface Feedback {
  id: string
  type: "grammar" | "structure" | "content" | "style"
  severity: "low" | "medium" | "high"
  message: string
  suggestion: string
  position: { start: number; end: number }
}

interface UserProgress {
  totalEssays: number
  averageScore: number
  improvementRate: number
  strengths: string[]
  weaknesses: string[]
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: number
  instructor: string
  lessons: Lesson[]
  progress: number
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface Lesson {
  id: string
  title: string
  videoUrl: string
  duration: number
  description: string
  completed: boolean
  notes: Note[]
}

interface Note {
  id: string
  content: string
  timestamp: number
  createdAt: string
}

interface VideoProgress {
  lessonId: string
  currentTime: number
  duration: number
  completed: boolean
  lastWatched: string
}

// 后端API接口预留
class EssayAPI {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  static async saveEssay(essay: Partial<Essay>): Promise<ApiResponse<Essay>> {
    // TODO: 实现保存作文接口
    return { success: true, data: essay as Essay }
  }

  static async getAIFeedback(content: string): Promise<ApiResponse<Feedback[]>> {
    // TODO: 实现AI反馈接口
    return { success: true, data: [] }
  }

  static async getUserProgress(): Promise<ApiResponse<UserProgress>> {
    // TODO: 实现用户进度接口
    return { success: true, data: {} as UserProgress }
  }

  static async submitEssay(essayId: string): Promise<ApiResponse<Essay>> {
    // TODO: 实现提交作文接口
    return { success: true, data: {} as Essay }
  }

  // 网课相关接口
  static async getCourses(): Promise<ApiResponse<Course[]>> {
    // TODO: 实现获取课程列表接口
    return { success: true, data: [] }
  }

  static async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    // TODO: 实现获取单个课程接口
    return { success: true, data: {} as Course }
  }

  static async updateVideoProgress(progress: VideoProgress): Promise<ApiResponse<void>> {
    // TODO: 实现更新视频进度接口
    return { success: true, data: undefined }
  }

  static async saveNote(lessonId: string, note: Partial<Note>): Promise<ApiResponse<Note>> {
    // TODO: 实现保存笔记接口
    return { success: true, data: {} as Note }
  }

  static async getLessonNotes(lessonId: string): Promise<ApiResponse<Note[]>> {
    // TODO: 实现获取课程笔记接口
    return { success: true, data: [] }
  }

  static async markLessonComplete(lessonId: string): Promise<ApiResponse<void>> {
    // TODO: 实现标记课程完成接口
    return { success: true, data: undefined }
  }
}

export function EssayApp() {
  const [activeTab, setActiveTab] = useState<"write" | "feedback" | "relay" | "profile" | "courses">("write") // 将 progress 改为 relay
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)

  const tabs = [
    { id: "write", label: "写作", icon: PenTool },
    { id: "courses", label: "网课", icon: Play },
    { id: "feedback", label: "反馈", icon: MessageSquare },
    { id: "relay", label: "接龙", icon: BarChart3 }, // 替换进度为接龙，暂时使用相同图标
    { id: "profile", label: "我的", icon: User },
  ]

  const handleEssayChange = async (content: string, title: string) => {
    // 自动保存功能
    const essayData = {
      ...currentEssay,
      title,
      content,
      updatedAt: new Date().toISOString(),
    }

    try {
      const response = await EssayAPI.saveEssay(essayData)
      if (response.success) {
        setCurrentEssay(response.data)
      }
    } catch (error) {
      console.error("保存作文失败:", error)
    }
  }

  const handleGetFeedback = async (content: string) => {
    try {
      const response = await EssayAPI.getAIFeedback(content)
      if (response.success) {
        // 处理AI反馈
        return response.data
      }
    } catch (error) {
      console.error("获取AI反馈失败:", error)
    }
    return []
  }

  const handleCourseSelect = async (courseId: string) => {
    try {
      const response = await EssayAPI.getCourseById(courseId)
      if (response.success) {
        setCurrentCourse(response.data)
      }
    } catch (error) {
      console.error("获取课程失败:", error)
    }
  }

  const handleVideoProgress = async (progress: VideoProgress) => {
    try {
      await EssayAPI.updateVideoProgress(progress)
    } catch (error) {
      console.error("保存视频进度失败:", error)
    }
  }

  const handleSaveNote = async (lessonId: string, content: string, timestamp: number) => {
    try {
      const noteData = {
        content,
        timestamp,
        createdAt: new Date().toISOString(),
      }
      const response = await EssayAPI.saveNote(lessonId, noteData)
      if (response.success) {
        // 处理保存成功
        return response.data
      }
    } catch (error) {
      console.error("保存笔记失败:", error)
    }
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 移动端顶部导航栏 */}
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <PenTool className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">杨红智能作文</h1>
        </div>

        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 移动端标签页内容 */}
        <div className="flex-1 overflow-auto">
          {activeTab === "write" && (
            <EssayEditor essay={currentEssay} onEssayChange={handleEssayChange} onGetFeedback={handleGetFeedback} />
          )}
          {activeTab === "courses" && (
            <CoursePlayer
              course={currentCourse}
              onCourseSelect={handleCourseSelect}
              onVideoProgress={handleVideoProgress}
              onSaveNote={handleSaveNote}
            />
          )}
          {activeTab === "feedback" && <FeedbackPanel essay={currentEssay} />}
          {activeTab === "relay" && <ParagraphRelay />} {/* 替换进度模块为文段接龙 */}
          {activeTab === "profile" && <ProfilePanel />}
        </div>

        {/* 移动端底部导航栏 */}
        <nav className="flex bg-card border-t border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                  isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && <div className="w-4 h-0.5 bg-primary rounded-full" />}
              </button>
            )
          })}
        </nav>
      </div>

      {/* 移动端侧边菜单覆盖层 */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-card border-l border-border p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">菜单</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any)
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
