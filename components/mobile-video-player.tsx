"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Play, Pause, SkipBack, SkipForward, StickyNote } from "lucide-react"

interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl: string
  description: string
  completed: boolean
}

interface MobileVideoPlayerProps {
  lesson: Lesson
  onProgress: (currentTime: number, duration: number) => void
  onAddNote: (content: string, timestamp: number) => void
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
}

export function MobileVideoPlayer({
  lesson,
  onProgress,
  onAddNote,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: MobileVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [noteContent, setNoteContent] = useState("")

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      onProgress(video.currentTime, video.duration)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (hasNext) {
        onNext()
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
    }
  }, [hasNext, onNext, onProgress])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.volume = value[0]
    setVolume(value[0])
  }

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleAddNote = () => {
    if (noteContent.trim()) {
      onAddNote(noteContent, currentTime)
      setNoteContent("")
      setShowNoteInput(false)
    }
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
  }

  return (
    <div className="relative bg-black">
      {/* 视频元素 */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        src={lesson.videoUrl}
        poster="/video-thumbnail.png"
        onClick={() => setShowControls(!showControls)}
      />

      {/* 视频控制层 */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          {/* 顶部信息 */}
          <div className="absolute top-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg font-semibold mb-1">{lesson.title}</h3>
            <p className="text-white/80 text-sm">{lesson.description}</p>
          </div>

          {/* 中央播放按钮 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button size="lg" onClick={togglePlay} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>

          {/* 底部控制栏 */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* 进度条 */}
            <div className="mb-4">
              <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} className="w-full" />
              <div className="flex justify-between text-white/80 text-xs mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skip(-10)}
                  className="text-white hover:bg-white/20 text-xs"
                >
                  -10s
                </Button>

                <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skip(10)}
                  className="text-white hover:bg-white/20 text-xs"
                >
                  +10s
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  disabled={!hasNext}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {/* 倍速选择 */}
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                  className="bg-white/20 text-white text-xs rounded px-2 py-1 border-none"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNoteInput(true)}
                  className="text-white hover:bg-white/20"
                >
                  <StickyNote className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 笔记输入弹窗 */}
      {showNoteInput && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-3">添加笔记</h3>
            <p className="text-sm text-muted-foreground mb-2">时间点: {formatTime(currentTime)}</p>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="在这里记录你的想法..."
              className="w-full h-24 p-2 border border-border rounded-md resize-none"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={handleAddNote} className="flex-1">
                保存笔记
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNoteInput(false)
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
