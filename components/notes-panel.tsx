"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { Plus, Clock, Trash2, Edit3, Search, Tag, Download, BookOpen, Star, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Note {
  id: string
  timestamp: number
  content: string
  lessonId: string
  title?: string
  tags?: string[]
  color?: string
  isBookmark?: boolean
  createdAt: Date
  updatedAt: Date
}

interface NotesPanelProps {
  notes: Note[]
  onAddNote: (timestamp: number, content: string, title?: string, tags?: string[], isBookmark?: boolean) => void
  onUpdateNote?: (noteId: string, updates: Partial<Note>) => void
  onDeleteNote?: (noteId: string) => void
  onJumpToTimestamp?: (timestamp: number) => void
}

export function NotesPanel({ notes, onAddNote, onUpdateNote, onDeleteNote, onJumpToTimestamp }: NotesPanelProps) {
  const [newNote, setNewNote] = useState("")
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteTags, setNewNoteTags] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isAddingBookmark, setIsAddingBookmark] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "notes" | "bookmarks">("all")
  const [selectedColor, setSelectedColor] = useState("#10b981")
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const noteColors = [
    { name: "绿色", value: "#10b981" },
    { name: "蓝色", value: "#3b82f6" },
    { name: "紫色", value: "#8b5cf6" },
    { name: "粉色", value: "#ec4899" },
    { name: "黄色", value: "#f59e0b" },
    { name: "红色", value: "#ef4444" },
  ]

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleAddNote = (isBookmark = false) => {
    if (newNote.trim()) {
      const tags = newNoteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
      onAddNote(
        0, // Using 0 as timestamp for now
        newNote.trim(),
        newNoteTitle.trim() || undefined,
        tags.length > 0 ? tags : undefined,
        isBookmark,
      )
      setNewNote("")
      setNewNoteTitle("")
      setNewNoteTags("")
      setIsAddingNote(false)
      setIsAddingBookmark(false)
      toast({
        title: isBookmark ? "书签已添加" : "笔记已添加",
        description: "内容已保存到当前课程",
      })
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
  }

  const handleUpdateNote = () => {
    if (editingNote && onUpdateNote) {
      onUpdateNote(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
        tags: editingNote.tags,
        color: editingNote.color,
        updatedAt: new Date(),
      })
      setEditingNote(null)
      toast({
        title: "笔记已更新",
        description: "修改已保存",
      })
    }
  }

  const handleDeleteNote = (noteId: string) => {
    if (onDeleteNote && confirm("确定要删除这条笔记吗？")) {
      onDeleteNote(noteId)
      toast({
        title: "笔记已删除",
        description: "笔记已从课程中移除",
      })
    }
  }

  const handleExportNotes = () => {
    const exportData = filteredNotes.map((note) => ({
      title: note.title || "无标题",
      content: note.content,
      timestamp: formatTime(note.timestamp),
      tags: note.tags?.join(", ") || "",
      type: note.isBookmark ? "书签" : "笔记",
      createdAt: note.createdAt.toLocaleString(),
    }))

    const csvContent = [
      ["标题", "内容", "时间点", "标签", "类型", "创建时间"],
      ...exportData.map((note) => [note.title, note.content, note.timestamp, note.tags, note.type, note.createdAt]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `课程笔记_${new Date().toLocaleDateString()}.csv`
    link.click()

    toast({
      title: "笔记已导出",
      description: "CSV文件已下载到本地",
    })
  }

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        !searchQuery ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesFilter =
        filterType === "all" ||
        (filterType === "bookmarks" && note.isBookmark) ||
        (filterType === "notes" && !note.isBookmark)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => a.timestamp - b.timestamp)

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])))

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-card-foreground">学习笔记</h3>
          <div className="flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  添加
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsAddingNote(true)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  添加笔记
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddingBookmark(true)}>
                  <Star className="h-4 w-4 mr-2" />
                  添加书签
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" variant="outline" onClick={handleExportNotes}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索笔记内容、标题或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Filter className="h-3 w-3 mr-1" />
                  {filterType === "all" ? "全部" : filterType === "notes" ? "笔记" : "书签"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  全部 {filterType === "all" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("notes")}>
                  笔记 {filterType === "notes" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("bookmarks")}>
                  书签 {filterType === "bookmarks" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {allTags.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Tag className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {allTags.map((tag) => (
                    <DropdownMenuItem key={tag} onClick={() => setSearchQuery(tag)}>
                      #{tag}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {(isAddingNote || isAddingBookmark) && (
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="space-y-3">
            <Input
              placeholder={isAddingBookmark ? "书签标题（可选）" : "笔记标题（可选）"}
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />

            <Textarea
              placeholder={isAddingBookmark ? "书签描述..." : "在这里输入你的笔记..."}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] resize-none"
            />

            <Input
              placeholder="标签（用逗号分隔）"
              value={newNoteTags}
              onChange={(e) => setNewNoteTags(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">颜色:</span>
              {noteColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    selectedColor === color.value ? "border-foreground scale-110" : "border-transparent",
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleAddNote(isAddingBookmark)}>
                {isAddingBookmark ? "保存书签" : "保存笔记"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingNote(false)
                  setIsAddingBookmark(false)
                  setNewNote("")
                  setNewNoteTitle("")
                  setNewNoteTags("")
                }}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-2">{searchQuery ? "没有找到匹配的笔记" : "还没有笔记"}</div>
              <div className="text-sm">
                {searchQuery ? "尝试其他搜索词" : "点击上方按钮或视频播放器中的笔记按钮来添加笔记"}
              </div>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Card
                key={note.id}
                className={cn("border transition-all hover:shadow-md", note.isBookmark && "border-l-4")}
                style={{
                  borderLeftColor: note.isBookmark ? note.color || "#10b981" : undefined,
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {note.isBookmark ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        )}
                        {note.title && <h4 className="font-medium text-sm">{note.title}</h4>}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <button
                          onClick={() => onJumpToTimestamp?.(note.timestamp)}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Clock className="h-3 w-3" />
                          {formatTime(note.timestamp)}
                        </button>
                        <span className="text-xs">{note.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-card-foreground leading-relaxed mb-2">{note.content}</p>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setSearchQuery(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑{editingNote?.isBookmark ? "书签" : "笔记"}</DialogTitle>
          </DialogHeader>

          {editingNote && (
            <div className="space-y-4">
              <Input
                placeholder="标题（可选）"
                value={editingNote.title || ""}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    title: e.target.value,
                  })
                }
              />

              <Textarea
                placeholder="内容"
                value={editingNote.content}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    content: e.target.value,
                  })
                }
                className="min-h-[100px]"
              />

              <Input
                placeholder="标签（用逗号分隔）"
                value={editingNote.tags?.join(", ") || ""}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag),
                  })
                }
              />

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">颜色:</span>
                {noteColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setEditingNote({
                        ...editingNote,
                        color: color.value,
                      })
                    }
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all",
                      editingNote.color === color.value ? "border-foreground scale-110" : "border-transparent",
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingNote(null)}>
                  取消
                </Button>
                <Button onClick={handleUpdateNote}>保存修改</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>总笔记:</span>
            <span>{notes.filter((n) => !n.isBookmark).length}</span>
          </div>
          <div className="flex justify-between">
            <span>书签:</span>
            <span>{notes.filter((n) => n.isBookmark).length}</span>
          </div>
          <div className="flex justify-between">
            <span>标签:</span>
            <span>{allTags.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
