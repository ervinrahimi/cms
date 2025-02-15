"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Eye, MessageSquare, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Chatroom = {
  id: string
  user: {
    name: string
    email: string
  }
  admin: {
    name: string
    email: string
  }
  lastMessage: string
  status: "new" | "viewed" | "closed"
  createdAt: string
  messages: number
}

const columns = [
  {
    accessorKey: "user.name",
    header: "User Name",
  },
  {
    accessorKey: "user.email",
    header: "User Email",
  },
  {
    accessorKey: "admin.name",
    header: "Admin",
  },
  {
    accessorKey: "messages",
    header: "Messages",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    header: "Actions",
  },
]

const data: Chatroom[] = [
  {
    id: "1",
    user: { name: "John Doe", email: "john@example.com" },
    admin: { name: "Admin Alice", email: "alice@admin.com" },
    lastMessage: "Hello, I have a question...",
    status: "new",
    createdAt: "2024-02-14 15:30",
    messages: 5,
  },
  {
    id: "2",
    user: { name: "Jane Smith", email: "jane@example.com" },
    admin: { name: "Admin Bob", email: "bob@admin.com" },
    lastMessage: "Thank you for your help",
    status: "viewed",
    createdAt: "2024-02-14 14:45",
    messages: 3,
  },
  {
    id: "3",
    user: { name: "Mike Johnson", email: "mike@example.com" },
    admin: { name: "Admin Carol", email: "carol@admin.com" },
    lastMessage: "Issue resolved, thanks!",
    status: "closed",
    createdAt: "2024-02-13 18:20",
    messages: 8,
  },
]

export default function ChatroomManagement() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chatrooms</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold my-5">Chatroom Management</h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.accessorKey || column.id}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey || column.id}>
                      {column.accessorKey === "status" ? (
                        <Badge
                          variant={row.status === "new" ? "default" : row.status === "viewed" ? "secondary" : "outline"}
                        >
                          {row.status === "new" ? "New" : row.status === "viewed" ? "Viewed" : "Closed"}
                        </Badge>
                      ) : column.id === "actions" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => console.log("View chatroom:", row.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Chatroom
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log("Send message to chatroom:", row.id)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                  <X className="mr-2 h-4 w-4" />
                                  Close Chatroom
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently close the chatroom and remove it
                                    from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => console.log("Closing chatroom:", row.id)}>
                                    Close Chatroom
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        (row as any)[column.accessorKey as string]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      )}
    </div>
  )
}

