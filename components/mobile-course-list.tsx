"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Play, Clock, User, BookOpen } from "lucide-react"

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
  lessons: any[]
}

interface MobileCourseListProps {
  courses: Course[]
  onCourseSelect: (course: Course) => void
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
}

const difficultyLabels = {
  beginner: "初级",
  intermediate: "中级",
  advanced: "高级",
}

export function MobileCourseList({ courses, onCourseSelect }: MobileCourseListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-card rounded-lg border border-border overflow-hidden">
            {/* 课程缩略图 */}
            <div className="relative">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={() => onCourseSelect(course)}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <Play className="w-5 h-5 mr-2" />
                  开始学习
                </Button>
              </div>
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* 课程信息 */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground line-clamp-2">{course.title}</h3>
                <Badge className={difficultyColors[course.difficulty]}>{difficultyLabels[course.difficulty]}</Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

              {/* 课程元信息 */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(course.duration / 60)}小时</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{course.lessons.length}课时</span>
                </div>
              </div>

              {/* 进度信息 */}
              {course.progress > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">学习进度</span>
                  <span className="text-primary font-medium">{course.progress}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
