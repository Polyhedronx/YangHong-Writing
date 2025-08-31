"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { ChevronDown, ChevronRight, Play, CheckCircle, Search, Clock, Star, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl: string
  completed?: boolean
  bookmarked?: boolean
  difficulty?: "beginner" | "intermediate" | "advanced"
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  description?: string
}

interface Course {
  id: string
  title: string
  modules: Module[]
}

interface CourseNavigationProps {
  course: Course
  currentLesson: Lesson
  onLessonSelect: (lesson: Lesson) => void
  onToggleBookmark?: (lessonId: string) => void
}

export function CourseNavigation({ course, currentLesson, onLessonSelect, onToggleBookmark }: CourseNavigationProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([course.modules[0]?.id]))
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "completed" | "bookmarked" | "incomplete">("all")
  const [sortBy, setSortBy] = useState<"order" | "duration" | "title">("order")

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const expandAll = () => {
    setExpandedModules(new Set(course.modules.map((m) => m.id)))
  }

  const collapseAll = () => {
    setExpandedModules(new Set())
  }

  const getTotalLessons = () => {
    return course.modules.reduce((total, module) => total + module.lessons.length, 0)
  }

  const getCompletedLessons = () => {
    return course.modules.reduce(
      (total, module) => total + module.lessons.filter((lesson) => lesson.completed).length,
      0,
    )
  }

  const getFilteredLessons = (lessons: Lesson[]) => {
    let filtered = lessons

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((lesson) => lesson.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply type filter
    switch (filterType) {
      case "completed":
        filtered = filtered.filter((lesson) => lesson.completed)
        break
      case "bookmarked":
        filtered = filtered.filter((lesson) => lesson.bookmarked)
        break
      case "incomplete":
        filtered = filtered.filter((lesson) => !lesson.completed)
        break
    }

    // Apply sorting
    switch (sortBy) {
      case "duration":
        filtered = [...filtered].sort((a, b) => {
          const aDuration = Number.parseInt(a.duration.split(":")[0]) * 60 + Number.parseInt(a.duration.split(":")[1])
          const bDuration = Number.parseInt(b.duration.split(":")[0]) * 60 + Number.parseInt(b.duration.split(":")[1])
          return aDuration - bDuration
        })
        break
      case "title":
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
        break
      // 'order' keeps original order
    }

    return filtered
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTotalDuration = () => {
    const totalMinutes = course.modules.reduce((total, module) => {
      return (
        total +
        module.lessons.reduce((moduleTotal, lesson) => {
          const [minutes, seconds] = lesson.duration.split(":").map(Number)
          return moduleTotal + minutes + seconds / 60
        }, 0)
      )
    }, 0)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.floor(totalMinutes % 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-2">{course.title}</h2>
        <div className="text-sm text-sidebar-foreground/70 space-y-1">
          <div className="flex items-center justify-between">
            <span>
              {getCompletedLessons()} / {getTotalLessons()} 课程已完成
            </span>
            <span className="text-xs">{getTotalDuration()}</span>
          </div>
        </div>
        <div className="w-full bg-sidebar-border rounded-full h-2 mt-2">
          <div
            className="bg-sidebar-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getCompletedLessons() / getTotalLessons()) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-4 border-b border-sidebar-border space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
          <Input
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-sidebar-accent/50 border-sidebar-border"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Filter className="h-3 w-3 mr-1" />
                {filterType === "all"
                  ? "全部"
                  : filterType === "completed"
                    ? "已完成"
                    : filterType === "bookmarked"
                      ? "已收藏"
                      : "未完成"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("all")}>
                全部课程 {filterType === "all" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("completed")}>
                已完成 {filterType === "completed" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("bookmarked")}>
                已收藏 {filterType === "bookmarked" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("incomplete")}>
                未完成 {filterType === "incomplete" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                {sortBy === "order" ? "默认" : sortBy === "duration" ? "时长" : "标题"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("order")}>
                默认顺序 {sortBy === "order" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("duration")}>
                按时长 {sortBy === "duration" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>按标题 {sortBy === "title" && "✓"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Expand/Collapse All */}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll} className="flex-1 text-xs">
            展开全部
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="flex-1 text-xs">
            收起全部
          </Button>
        </div>
      </div>

      {/* Course Content */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {course.modules.map((module) => {
            const filteredLessons = getFilteredLessons(module.lessons)

            // Hide module if no lessons match filter
            if (filteredLessons.length === 0 && (searchQuery || filterType !== "all")) {
              return null
            }

            return (
              <div key={module.id} className="mb-2">
                {/* Module Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleModule(module.id)}
                  className="w-full justify-start p-3 h-auto text-left hover:bg-sidebar-accent/50"
                >
                  <div className="flex items-center gap-2 w-full">
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="h-4 w-4 text-sidebar-foreground/70" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-sidebar-foreground/70" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sidebar-foreground">{module.title}</div>
                      <div className="text-xs text-sidebar-foreground/70 flex items-center gap-2">
                        <span>{filteredLessons.length} 课程</span>
                        <span>
                          {module.lessons.filter((l) => l.completed).length}/{module.lessons.length} 已完成
                        </span>
                      </div>
                    </div>
                    {module.lessons.every((l) => l.completed) && (
                      <Badge variant="secondary" className="text-xs">
                        完成
                      </Badge>
                    )}
                  </div>
                </Button>

                {/* Module Lessons */}
                {expandedModules.has(module.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {filteredLessons.map((lesson) => (
                      <div key={lesson.id} className="relative group">
                        <Button
                          variant="ghost"
                          onClick={() => onLessonSelect(lesson)}
                          className={cn(
                            "w-full justify-start p-3 h-auto text-left hover:bg-sidebar-accent/50",
                            currentLesson.id === lesson.id &&
                              "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                          )}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : currentLesson.id === lesson.id ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-current opacity-50" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate flex items-center gap-2">
                                {lesson.title}
                                {lesson.bookmarked && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                              </div>
                              <div className="text-xs opacity-70 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {lesson.duration}
                                {lesson.difficulty && (
                                  <Badge
                                    variant="secondary"
                                    className={cn("text-xs", getDifficultyColor(lesson.difficulty))}
                                  >
                                    {lesson.difficulty === "beginner"
                                      ? "初级"
                                      : lesson.difficulty === "intermediate"
                                        ? "中级"
                                        : "高级"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleBookmark?.(lesson.id)
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        >
                          <Star
                            className={cn(
                              "h-3 w-3",
                              lesson.bookmarked ? "fill-yellow-400 text-yellow-400" : "text-sidebar-foreground/50",
                            )}
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="text-xs text-sidebar-foreground/70 space-y-1">
          <div className="flex justify-between">
            <span>总课程数:</span>
            <span>{getTotalLessons()}</span>
          </div>
          <div className="flex justify-between">
            <span>已收藏:</span>
            <span>
              {course.modules.reduce((total, module) => total + module.lessons.filter((l) => l.bookmarked).length, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>完成率:</span>
            <span>{Math.round((getCompletedLessons() / getTotalLessons()) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
