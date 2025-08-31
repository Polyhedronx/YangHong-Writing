"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, Bell, Download, Upload, LogOut, Edit } from "lucide-react"

export function ProfilePanel() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "小明",
    grade: "初二",
    school: "实验中学",
    avatar: "",
    email: "xiaoming@example.com",
  })

  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    darkMode: false,
    aiSuggestions: true,
  })

  const userStats = {
    level: 5,
    experience: 750,
    nextLevelExp: 1000,
    totalEssays: 15,
    bestScore: 95,
    averageScore: 82,
  }

  const handleSaveProfile = () => {
    // TODO: 调用后端API保存用户信息
    setIsEditing(false)
  }

  const handleExportData = () => {
    // TODO: 导出用户数据
    console.log("导出用户数据")
  }

  const handleImportData = () => {
    // TODO: 导入用户数据
    console.log("导入用户数据")
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-auto">
      {/* 用户信息卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">个人信息</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "取消" : "编辑"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={userInfo.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {userInfo.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    placeholder="姓名"
                  />
                  <Input
                    value={userInfo.grade}
                    onChange={(e) => setUserInfo({ ...userInfo, grade: e.target.value })}
                    placeholder="年级"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                  <p className="text-muted-foreground">
                    {userInfo.grade} · {userInfo.school}
                  </p>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="school">学校</Label>
                <Input
                  id="school"
                  value={userInfo.school}
                  onChange={(e) => setUserInfo({ ...userInfo, school: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                保存信息
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 等级进度 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            学习等级
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">Lv.{userStats.level}</div>
              <div className="text-sm text-muted-foreground">写作新星</div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {userStats.experience}/{userStats.nextLevelExp} EXP
            </Badge>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(userStats.experience / userStats.nextLevelExp) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">{userStats.totalEssays}</div>
              <div className="text-xs text-muted-foreground">总作文</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-secondary">{userStats.bestScore}</div>
              <div className="text-xs text-muted-foreground">最高分</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-accent">{userStats.averageScore}</div>
              <div className="text-xs text-muted-foreground">平均分</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 应用设置 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-secondary" />
            应用设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span>消息通知</span>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>自动保存</span>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>AI写作建议</span>
            </div>
            <Switch
              checked={settings.aiSuggestions}
              onCheckedChange={(checked) => setSettings({ ...settings, aiSuggestions: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 数据管理 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">数据管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleExportData} className="w-full justify-start bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            导出我的数据
          </Button>

          <Button variant="outline" onClick={handleImportData} className="w-full justify-start bg-transparent">
            <Upload className="w-4 h-4 mr-2" />
            导入数据
          </Button>

          <Button variant="destructive" className="w-full justify-start">
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
