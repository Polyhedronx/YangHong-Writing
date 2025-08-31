"use client"

import { useState } from "react"
import { MobileVideoPlayer } from "./mobile-video-player"
import { MobileCourseList } from "./mobile-course-list"
import { MobileNotesPanel } from "./mobile-notes-panel"
import { Button } from "./ui/button"
import { ArrowLeft, BookOpen, StickyNote } from "lucide-react"

const mockCourses = [
  {
    id: "1",
    title: "作文写作基础课程",
    description: "掌握作文写作的基本技巧和方法",
    thumbnail: "/writing-course-thumbnail.png",
    instructor: "杨红老师",
    duration: 180, // minutes
    progress: 65,
    category: "基础写作",
    difficulty: "beginner" as const,
    lessons: [
      {
        id: "lesson-1",
        title: "作文结构与框架",
        duration: "15:30",
        videoUrl: "/placeholder.mp4",
        description: "学习作文的基本结构：开头、正文、结尾",
        completed: true,
        notes: [],
      },
      {
        id: "lesson-2",
        title: "如何写好开头段",
        duration: "22:45",
        videoUrl: "/placeholder.mp4",
        description: "掌握吸引读者的开头写作技巧",
        completed: true,
        notes: [],
      },
      {
        id: "lesson-3",
        title: "论证方法与技巧",
        duration: "18:20",
        videoUrl: "/placeholder.mp4",
        description: "学习各种论证方法的运用",
        completed: false,
        notes: [],
      },
    ],
  },
  {
    id: "2",
    title: "议论文写作进阶",
    description: "提升议论文写作水平的高级技巧",
    thumbnail: "/advanced-writing-course.png",
    instructor: "李明老师",
    duration: 240,
    progress: 30,
    category: "议论文",
    difficulty: "intermediate" as const,
    lessons: [
      {
        id: "lesson-4",
        title: "论点的提出与论证",
        duration: "25:15",
        videoUrl: "/placeholder.mp4",
        description: "如何提出有力的论点并进行有效论证",
        completed: false,
        notes: [],
      },
      {
        id: "lesson-5",
        title: "素材的选择与运用",
        duration: "28:30",
        videoUrl: "/placeholder.mp4",
        description: "学会选择和运用恰当的写作素材",
        completed: false,
        notes: [],
      },
    ],
  },
]

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: string
  duration: number
  progress: number
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl: string
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

interface CoursePlayerProps {
  course?: Course | null
  onCourseSelect: (courseId: string) => void
  onVideoProgress: (progress: any) => void
  onSaveNote: (lessonId: string, content: string, timestamp: number) => Promise<Note | null>
}

export function CoursePlayer({ course, onCourseSelect, onVideoProgress, onSaveNote }: CoursePlayerProps) {
  const [currentView, setCurrentView] = useState<"courses" | "player" | "notes">("courses")
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [notes, setNotes] = useState<Note[]>([])

  const displayCourses = course ? [course] : mockCourses

  const handleCourseSelect = (selectedCourse: Course) => {
    onCourseSelect(selectedCourse.id)
    if (selectedCourse.lessons.length > 0) {
      setCurrentLesson(selectedCourse.lessons[0])
      setCurrentView("player")
    }
  }

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    setCurrentView("player")
  }

  const handleAddNote = async (content: string, timestamp: number) => {
    if (!currentLesson) return

    const savedNote = await onSaveNote(currentLesson.id, content, timestamp)
    if (savedNote) {
      setNotes((prev) => [...prev, savedNote])
    }
  }

  const handleVideoProgress = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime)
    setDuration(duration)

    if (currentLesson) {
      onVideoProgress({
        lessonId: currentLesson.id,
        currentTime,
        duration,
        completed: currentTime / duration > 0.9,
        lastWatched: new Date().toISOString(),
      })
    }
  }

  const handleNextLesson = () => {
    if (!course || !currentLesson) return

    const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id)
    if (currentIndex < course.lessons.length - 1) {
      setCurrentLesson(course.lessons[currentIndex + 1])
    }
  }

  const handlePreviousLesson = () => {
    if (!course || !currentLesson) return

    const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id)
    if (currentIndex > 0) {
      setCurrentLesson(course.lessons[currentIndex - 1])
    }
  }

  // 课程列表视图
  if (currentView === "courses") {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">网课学习</h2>
          <p className="text-sm text-muted-foreground mt-1">提升写作技能的专业课程</p>
        </div>

        <MobileCourseList courses={displayCourses} onCourseSelect={handleCourseSelect} />
      </div>
    )
  }

  // 笔记视图
  if (currentView === "notes") {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("player")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">课程笔记</h2>
        </div>

        <MobileNotesPanel notes={notes} onAddNote={handleAddNote} currentTime={currentTime} />
      </div>
    )
  }

  // 视频播放器视图
  return (
    <div className="flex flex-col h-full bg-background">
      {/* 移动端视频播放器头部 */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView("courses")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">{currentLesson?.title}</h2>
          <p className="text-sm text-muted-foreground truncate">{course?.title}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setCurrentView("notes")}>
          <StickyNote className="w-4 h-4" />
        </Button>
      </div>

      {/* 视频播放器 */}
      <div className="flex-1">
        {currentLesson && (
          <MobileVideoPlayer
            lesson={currentLesson}
            onProgress={handleVideoProgress}
            onAddNote={handleAddNote}
            onNext={handleNextLesson}
            onPrevious={handlePreviousLesson}
            hasNext={
              course ? course.lessons.findIndex((l) => l.id === currentLesson.id) < course.lessons.length - 1 : false
            }
            hasPrevious={course ? course.lessons.findIndex((l) => l.id === currentLesson.id) > 0 : false}
          />
        )}
      </div>

      {/* 课程列表快速访问 */}
      {course && (
        <div className="border-t border-border bg-card">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">课程目录</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                    currentLesson?.id === lesson.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      lesson.completed
                        ? "bg-green-500 text-white"
                        : currentLesson?.id === lesson.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {lesson.completed ? "✓" : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
