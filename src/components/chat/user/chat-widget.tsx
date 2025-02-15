"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface Message {
  id: number
  content: string
  sender: "user" | "admin"
  timestamp: Date
}

const activeAdmins = [
  {
    name: "Sofia D",
    image: "https://i.pinimg.com/736x/6e/8b/67/6e8b67bee54342c802046c1dae07f718.jpg",
  },
  { name: "John M", image: "https://i.pinimg.com/736x/5e/2b/b7/5e2bb708503711ecf7bea10ebb6ee17a.jpg" },
  { name: "Emma K", image: "https://i.pinimg.com/736x/e5/cd/a4/e5cda443d5be7b58ee938fa459603b26.jpg" },
  { name: "Mike R", image: "https://i.pinimg.com/736x/86/0d/07/860d07f2e1e10f37891640d08c035f31.jpg" },
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      content: "Hi, how can I help you today?",
      sender: "admin",
      timestamp: new Date(),
    },
  ])
  const [showMainAdmin, setShowMainAdmin] = React.useState(false)
  const [showUserInfoDialog, setShowUserInfoDialog] = React.useState(true)
  const [userName, setUserName] = React.useState("")
  const [userEmail, setUserEmail] = React.useState("")

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    if (isOpen && !showUserInfoDialog) {
      scrollToBottom()
    }
  }, [isOpen, showUserInfoDialog, scrollToBottom])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        content: message,
        sender: "user",
        timestamp: new Date(),
      },
    ])
    setMessage("")
    setTimeout(scrollToBottom, 0)
  }

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userEmail) {
      setShowUserInfoDialog(false)
    }
  }

  const renderChatInterface = () => (
    <Card className="w-[320px] h-[480px] flex flex-col">
      <CardHeader className="space-y-1.5 p-4">
        <div className="flex justify-between items-center">
          {showMainAdmin ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={activeAdmins[0].image} alt="Sofia" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Sofia Davis</h3>
                <p className="text-xs text-muted-foreground">m@example.com</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {activeAdmins.slice(0, 3).map((admin, i) => (
                  <Avatar key={i} className="border-2 border-background">
                    <AvatarImage src={admin.image} alt={admin.name} />
                    <AvatarFallback>
                      {admin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm">+{activeAdmins.length - 3}</span>
            </div>
          )}
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => setShowMainAdmin(!showMainAdmin)}>
              <Users className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[340px] p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%]",
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="secondary">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )

  const renderUserInfoForm = () => (
    <Card className="w-[320px] h-[480px] flex flex-col">
      <CardHeader className="space-y-1.5 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Welcome to Chat</h3>
          <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center">
        <form onSubmit={handleUserInfoSubmit} className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">
            Start Chatting
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        showUserInfoDialog ? (
          renderUserInfoForm()
        ) : (
          renderChatInterface()
        )
      ) : (
        <Button onClick={() => setIsOpen(true)} size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

