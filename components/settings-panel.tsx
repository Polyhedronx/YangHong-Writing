"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Slider } from "./ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import {
  Settings,
  Monitor,
  Volume2,
  Play,
  Keyboard,
  Download,
  Upload,
  BarChart3,
  Moon,
  Sun,
  Palette,
  Clock,
  Zap,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UserSettings {
  // Playback preferences
  defaultPlaybackRate: number
  defaultVolume: number
  autoPlayNext: boolean
  rememberPosition: boolean
  skipIntroOutro: boolean

  // Interface preferences
  theme: "light" | "dark" | "system"
  language: "zh" | "en"
  showKeyboardShortcuts: boolean
  compactMode: boolean

  // Learning preferences
  noteAutoSave: boolean
  highlightNewContent: boolean
  showProgress: boolean
  dailyGoalMinutes: number

  // Advanced settings
  videoQuality: "auto" | "720p" | "1080p"
  bufferSize: number
  enableAnalytics: boolean
}

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  settings: UserSettings
  onSettingsChange: (settings: UserSettings) => void
  learningStats?: {
    totalWatchTime: number
    completedLessons: number
    totalLessons: number
    streak: number
    averageSessionTime: number
  }
}

export function SettingsPanel({ isOpen, onClose, settings, onSettingsChange, learningStats }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSettingChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(localSettings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `course-player-settings-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "设置已导出",
      description: "设置文件已下载到本地",
    })
  }

  const importSettings = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target?.result as string)
            setLocalSettings(importedSettings)
            onSettingsChange(importedSettings)
            toast({
              title: "设置已导入",
              description: "设置已成功应用",
            })
          } catch (error) {
            toast({
              title: "导入失败",
              description: "设置文件格式不正确",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const resetSettings = () => {
    if (confirm("确定要重置所有设置吗？此操作不可撤销。")) {
      const defaultSettings: UserSettings = {
        defaultPlaybackRate: 1,
        defaultVolume: 1,
        autoPlayNext: false,
        rememberPosition: true,
        skipIntroOutro: false,
        theme: "system",
        language: "zh",
        showKeyboardShortcuts: true,
        compactMode: false,
        noteAutoSave: true,
        highlightNewContent: true,
        showProgress: true,
        dailyGoalMinutes: 60,
        videoQuality: "auto",
        bufferSize: 30,
        enableAnalytics: true,
      }
      setLocalSettings(defaultSettings)
      onSettingsChange(defaultSettings)
      toast({
        title: "设置已重置",
        description: "所有设置已恢复默认值",
      })
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">设置与偏好</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportSettings}>
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
            <Button variant="outline" size="sm" onClick={importSettings}>
              <Upload className="h-4 w-4 mr-1" />
              导入
            </Button>
            <Button variant="outline" size="sm" onClick={resetSettings}>
              重置
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="playback" className="h-full flex">
            <TabsList className="flex flex-col h-full w-48 rounded-none border-r border-border bg-muted/30">
              <TabsTrigger value="playback" className="w-full justify-start">
                <Play className="h-4 w-4 mr-2" />
                播放设置
              </TabsTrigger>
              <TabsTrigger value="interface" className="w-full justify-start">
                <Monitor className="h-4 w-4 mr-2" />
                界面设置
              </TabsTrigger>
              <TabsTrigger value="learning" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                学习偏好
              </TabsTrigger>
              <TabsTrigger value="shortcuts" className="w-full justify-start">
                <Keyboard className="h-4 w-4 mr-2" />
                快捷键
              </TabsTrigger>
              <TabsTrigger value="stats" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                学习统计
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {/* Playback Settings */}
                  <TabsContent value="playback" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          播放控制
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">默认播放速度</label>
                          <Select
                            value={localSettings.defaultPlaybackRate.toString()}
                            onValueChange={(value) =>
                              handleSettingChange("defaultPlaybackRate", Number.parseFloat(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0.5">0.5x</SelectItem>
                              <SelectItem value="0.75">0.75x</SelectItem>
                              <SelectItem value="1">1x (正常)</SelectItem>
                              <SelectItem value="1.25">1.25x</SelectItem>
                              <SelectItem value="1.5">1.5x</SelectItem>
                              <SelectItem value="2">2x</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">默认音量</label>
                          <Slider
                            value={[localSettings.defaultVolume]}
                            onValueChange={([value]) => handleSettingChange("defaultVolume", value)}
                            max={1}
                            step={0.1}
                            className="w-full"
                          />
                          <div className="text-xs text-muted-foreground">
                            {Math.round(localSettings.defaultVolume * 100)}%
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">自动播放下一课程</label>
                            <Switch
                              checked={localSettings.autoPlayNext}
                              onCheckedChange={(checked) => handleSettingChange("autoPlayNext", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">记住播放位置</label>
                            <Switch
                              checked={localSettings.rememberPosition}
                              onCheckedChange={(checked) => handleSettingChange("rememberPosition", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">跳过片头片尾</label>
                            <Switch
                              checked={localSettings.skipIntroOutro}
                              onCheckedChange={(checked) => handleSettingChange("skipIntroOutro", checked)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>视频质量</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select
                          value={localSettings.videoQuality}
                          onValueChange={(value: any) => handleSettingChange("videoQuality", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">自动 (推荐)</SelectItem>
                            <SelectItem value="720p">720p</SelectItem>
                            <SelectItem value="1080p">1080p</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Interface Settings */}
                  <TabsContent value="interface" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          外观主题
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">主题模式</label>
                          <Select
                            value={localSettings.theme}
                            onValueChange={(value: any) => handleSettingChange("theme", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">
                                <div className="flex items-center gap-2">
                                  <Sun className="h-4 w-4" />
                                  浅色模式
                                </div>
                              </SelectItem>
                              <SelectItem value="dark">
                                <div className="flex items-center gap-2">
                                  <Moon className="h-4 w-4" />
                                  深色模式
                                </div>
                              </SelectItem>
                              <SelectItem value="system">
                                <div className="flex items-center gap-2">
                                  <Monitor className="h-4 w-4" />
                                  跟随系统
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">语言</label>
                          <Select
                            value={localSettings.language}
                            onValueChange={(value: any) => handleSettingChange("language", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zh">中文</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">显示键盘快捷键提示</label>
                            <Switch
                              checked={localSettings.showKeyboardShortcuts}
                              onCheckedChange={(checked) => handleSettingChange("showKeyboardShortcuts", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">紧凑模式</label>
                            <Switch
                              checked={localSettings.compactMode}
                              onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Learning Preferences */}
                  <TabsContent value="learning" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          学习体验
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">笔记自动保存</label>
                            <Switch
                              checked={localSettings.noteAutoSave}
                              onCheckedChange={(checked) => handleSettingChange("noteAutoSave", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">高亮新内容</label>
                            <Switch
                              checked={localSettings.highlightNewContent}
                              onCheckedChange={(checked) => handleSettingChange("highlightNewContent", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">显示学习进度</label>
                            <Switch
                              checked={localSettings.showProgress}
                              onCheckedChange={(checked) => handleSettingChange("showProgress", checked)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">每日学习目标</label>
                          <Slider
                            value={[localSettings.dailyGoalMinutes]}
                            onValueChange={([value]) => handleSettingChange("dailyGoalMinutes", value)}
                            min={15}
                            max={480}
                            step={15}
                            className="w-full"
                          />
                          <div className="text-xs text-muted-foreground">
                            {formatTime(localSettings.dailyGoalMinutes)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Keyboard Shortcuts */}
                  <TabsContent value="shortcuts" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Keyboard className="h-4 w-4" />
                          键盘快捷键
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: "空格", action: "播放/暂停" },
                            { key: "← →", action: "快退/快进 10秒" },
                            { key: "↑ ↓", action: "音量调节" },
                            { key: "M", action: "静音/取消静音" },
                            { key: "F", action: "全屏/退出全屏" },
                            { key: "N", action: "下一课程" },
                            { key: "P", action: "上一课程" },
                            { key: "Ctrl + S", action: "保存笔记" },
                            { key: "Ctrl + F", action: "搜索" },
                            { key: "Esc", action: "关闭面板" },
                          ].map((shortcut, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded border">
                              <span className="text-sm">{shortcut.action}</span>
                              <Badge variant="secondary" className="font-mono text-xs">
                                {shortcut.key}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Learning Statistics */}
                  <TabsContent value="stats" className="mt-0 space-y-6">
                    {learningStats && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <div>
                                  <div className="text-2xl font-bold">{formatTime(learningStats.totalWatchTime)}</div>
                                  <div className="text-xs text-muted-foreground">总学习时长</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-green-500" />
                                <div>
                                  <div className="text-2xl font-bold">
                                    {learningStats.completedLessons}/{learningStats.totalLessons}
                                  </div>
                                  <div className="text-xs text-muted-foreground">完成课程</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-orange-500" />
                                <div>
                                  <div className="text-2xl font-bold">{learningStats.streak}</div>
                                  <div className="text-xs text-muted-foreground">连续学习天数</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <div>
                                  <div className="text-2xl font-bold">
                                    {formatTime(learningStats.averageSessionTime)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">平均学习时长</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <Card>
                          <CardHeader>
                            <CardTitle>学习进度</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>课程完成度</span>
                                <span>
                                  {Math.round((learningStats.completedLessons / learningStats.totalLessons) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${(learningStats.completedLessons / learningStats.totalLessons) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
