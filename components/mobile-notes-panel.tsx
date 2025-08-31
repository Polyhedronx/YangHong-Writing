"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Plus, Clock, Edit, Trash2 } from "lucide-react"

interface Note {
  id: string
  content: string
  timestamp: number
  createdAt: string
}

interface MobileNotesPanelProps {
  notes: Note[]
  onAddNote: (content: string, timestamp: number) => void
  currentTime: number
}

export function MobileNotesPanel({ notes, onAddNote, currentTime }: MobileNotesPanelProps) {
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteContent, setNoteContent] = useState("")

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleAddNote = () => {
    if (noteContent.trim()) {
      onAddNote(noteContent, currentTime)
      setNoteContent("")
      setShowAddNote(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 添加笔记按钮 */}
      <div className="p-4 border-b border-border">
        <Button onClick={() => setShowAddNote(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          添加笔记
        </Button>
      </div>

      {/* 笔记列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">还没有笔记</p>
            <p className="text-sm text-muted-foreground mt-1">在观看视频时点击笔记按钮添加学习笔记</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(note.timestamp)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(note.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加笔记弹窗 */}
      {showAddNote && (
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="bg-background w-full rounded-t-lg p-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">添加笔记</h3>
            <p className="text-sm text-muted-foreground mb-2">时间点: {formatTime(currentTime)}</p>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="记录你的学习心得..."
              className="w-full h-24 p-3 border border-border rounded-md resize-none"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={handleAddNote} className="flex-1">
                保存笔记
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddNote(false)
                  setNoteContent("")
                }}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
