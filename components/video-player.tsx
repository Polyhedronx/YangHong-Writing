"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface VideoPlayerProps {
  videoUrl: string
  title: string
  onAddNote: (timestamp: number, content: string) => void
  onPreviousLesson?: () => void
  onNextLesson?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  autoPlayNext?: boolean
}

export function VideoPlayer({
  videoUrl,
  title,
  onAddNote,
  onPreviousLesson,
  onNextLesson,
  hasPrevious = false,
  hasNext = false,
  autoPlayNext = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [showAddNote, setShowAddNote] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [watchedTime, setWatchedTime] = useState(0)

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const video = videoRef.current
      if (!video) return

      // Prevent default behavior when video is focused or no input is focused
      const activeElement = document.activeElement
      const isInputFocused = activeElement?.tagName === "INPUT" || activeElement?.tagName === "TEXTAREA"

      if (isInputFocused) return

      switch (event.code) {
        case "Space":
          event.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          event.preventDefault()
          skip(-10)
          break
        case "ArrowRight":
          event.preventDefault()
          skip(10)
          break
        case "ArrowUp":
          event.preventDefault()
          handleVolumeChange([Math.min(1, volume + 0.1)])
          break
        case "ArrowDown":
          event.preventDefault()
          handleVolumeChange([Math.max(0, volume - 0.1)])
          break
        case "KeyM":
          event.preventDefault()
          toggleMute()
          break
        case "KeyF":
          event.preventDefault()
          toggleFullscreen()
          break
        case "KeyN":
          event.preventDefault()
          if (hasNext) onNextLesson?.()
          break
        case "KeyP":
          event.preventDefault()
          if (hasPrevious) onPreviousLesson?.()
          break
      }
    },
    [volume, hasNext, hasPrevious, onNextLesson, onPreviousLesson],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      setWatchedTime(Math.max(watchedTime, video.currentTime))
    }

    const updateDuration = () => setDuration(video.duration)

    const handleWaiting = () => setIsBuffering(true)
    const handleCanPlay = () => setIsBuffering(false)

    const handleEnded = () => {
      setIsPlaying(false)
      if (autoPlayNext && hasNext) {
        setTimeout(() => {
          onNextLesson?.()
        }, 3000) // 3 second delay before auto-playing next
      }
    }

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [autoPlayNext, hasNext, onNextLesson, watchedTime])

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

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    toast({
      title: `音量: ${Math.round(newVolume * 100)}%`,
      duration: 1000,
    })
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
    video.currentTime = newTime

    toast({
      title: `${seconds > 0 ? "快进" : "快退"} ${Math.abs(seconds)} 秒`,
      duration: 1000,
    })
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)

    toast({
      title: `播放速度: ${rate}x`,
      duration: 1000,
    })
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const restartVideo = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    setCurrentTime(0)
    if (!isPlaying) {
      video.play()
      setIsPlaying(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleAddNoteClick = () => {
    const noteContent = prompt("请输入笔记内容:")
    if (noteContent) {
      onAddNote(currentTime, noteContent)
      toast({
        title: "笔记已添加",
        description: `时间点: ${formatTime(currentTime)}`,
      })
    }
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
  const watchedPercentage = duration > 0 ? (watchedTime / duration) * 100 : 0

  return (
    <div className="relative bg-black group">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src="/placeholder.mp4"
        poster="/video-course-thumbnail.png"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(true)}
      />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Video Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Center Play Button */}
        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              onClick={togglePlay}
              className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground"
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full h-1">
              <div
                className="bg-white/40 h-full rounded-full transition-all duration-300"
                style={{ width: `${watchedPercentage}%` }}
              />
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full relative z-10"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreviousLesson}
                disabled={!hasPrevious}
                className="text-white hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onNextLesson}
                disabled={!hasNext}
                className="text-white hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => skip(-10)} className="text-white hover:bg-white/20">
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => skip(10)} className="text-white hover:bg-white/20">
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={restartVideo} className="text-white hover:bg-white/20">
                <RotateCcw className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 ml-2">
                <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <span className="text-white text-sm ml-4">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleAddNoteClick} className="text-white hover:bg-white/20">
                <MessageSquarePlus className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => changePlaybackRate(0.5)}>
                    0.5x {playbackRate === 0.5 && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(0.75)}>
                    0.75x {playbackRate === 0.75 && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1)}>
                    1x {playbackRate === 1 && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1.25)}>
                    1.25x {playbackRate === 1.25 && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1.5)}>
                    1.5x {playbackRate === 1.5 && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(2)}>
                    2x {playbackRate === 2 && "✓"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/80 text-white text-xs p-2 rounded space-y-1">
          <div>空格: 播放/暂停</div>
          <div>← →: 快退/快进 10秒</div>
          <div>↑ ↓: 音量调节</div>
          <div>M: 静音</div>
          <div>F: 全屏</div>
          <div>N/P: 下一课/上一课</div>
        </div>
      </div>
    </div>
  )
}
