'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Send, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import sdb from '@/db/surrealdb'; // اتصال به SurrealDB
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// تعریف اینترفیس ChatRoom با فیلدهای مورد نیاز
interface ChatRoom {
  id: string;
  user: string;
  admin: string;
  status: 'pending' | 'activated' | 'viewed' | 'closed';
  lastMessage: string;
  createdAt: string;
}

type Message = {
  id: string
  sender: "user" | "admin"
  content: string
  timestamp: string
}

const sampleMessages: Message[] = [
  { id: "1", sender: "user", content: "سلام، من یک سوال دارم", timestamp: "2024-02-21T10:00:00" },
  { id: "2", sender: "admin", content: "سلام، بفرمایید. چطور می‌توانم کمکتان کنم؟", timestamp: "2024-02-21T10:05:00" },
  {
    id: "3",
    sender: "user",
    content: "من در مورد نحوه استفاده از این پلتفرم سوال دارم",
    timestamp: "2024-02-21T10:10:00",
  },
  {
    id: "4",
    sender: "admin",
    content: "بله، حتما. چه بخشی از پلتفرم برایتان مبهم است؟",
    timestamp: "2024-02-21T10:15:00",
  },
  {
    id: "5",
    sender: "user",
    content: "من نمی‌دانم چطور می‌توانم یک پروژه جدید ایجاد کنم",
    timestamp: "2024-02-21T10:20:00",
  },
]

const ChatView: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <ScrollArea className="flex-grow overflow-auto">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-start max-w-[70%] ${message.sender === "admin" ? "flex-row-reverse" : "flex-row"}`}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.sender === "admin" ? "/admin-avatar.png" : "/user-avatar.png"} />
                <AvatarFallback>{message.sender === "admin" ? "A" : "U"}</AvatarFallback>
              </Avatar>
              <div className={`mx-2 ${message.sender === "admin" ? "text-right" : "text-left"}`}>
                <div
                  className={`rounded-lg p-2 ${message.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(message.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

// تعریف ستون‌ها با استفاده از TanStack React Table
const columns: ColumnDef<ChatRoom>[] = [
  {
    accessorKey: 'user',
    header: 'Customer Name',
    cell: ({ row }) => <div>{row.getValue('user')}</div>,
  },
  {
    accessorKey: 'admin',
    header: 'Admin',
    cell: ({ row }) => <div>{row.getValue('admin')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className={
            status === 'pending'
              ? 'text-yellow-600'
              : status === 'activated'
              ? 'text-green-600'
              : status === 'viewed'
              ? 'text-blue-600'
              : status === 'closed'
              ? 'text-red-600'
              : 'text-gray-600'
          }
        >
          {status === 'pending'
            ? 'Pending'
            : status === 'activated'
            ? 'Activated'
            : status === 'viewed'
            ? 'Viewed'
            : status === 'closed'
            ? 'Closed'
            : 'Unknown'}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('createdAt')}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const chatRoom = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("Mark as viewed:", chatRoom.id)}>
              Mark as viewed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Sheet>
              <SheetTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Chatroom</DropdownMenuItem>
              </SheetTrigger>
              <SheetContent side="right" size="full" className="w-full sm:max-w-full">
                <div className="flex flex-col h-full">
                  <SheetHeader>
                    <SheetTitle>Chat with</SheetTitle>
                    <SheetDescription>View and respond to messages</SheetDescription>
                  </SheetHeader>
                  <div className="flex-grow flex flex-col overflow-hidden">
                    <ChatView messages={sampleMessages} />
                    <div className="p-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Textarea placeholder="Type your message here..." className="flex-grow" />
                        <Button size="icon">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send message</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Close chat room</DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will close the chat room and log all details.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => console.log("Chat room closed:", chatRoom.id)}>
                    <X className="mr-2 h-4 w-4" /> Close chat room
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

// کامپوننت اصلی جدول مدیریت چت روم
export function ChatRoomManagementTable() {
  const [data, setData] = React.useState<ChatRoom[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const db = await sdb();
        // Query برای دریافت اطلاعات Chat به همراه اطلاعات مشتری و ادمین
        const res = await db.query(
          'SELECT *, customer_id.* as ChatUser, admin_id.* as ChatAdmin FROM Chat ORDER BY created_at DESC'
        );
        const chats = res?.[0] || [];

        // نگاشت داده‌ها به ساختار ChatRoom
        const mappedData: ChatRoom[] = chats.map((chat: any) => ({
          id: chat.id,
          user: chat.ChatUser ? chat.ChatUser.name : '',
          admin: chat.ChatAdmin ? `${chat.ChatAdmin.firstname} ${chat.ChatAdmin.lastname}` : '',
          // نگاشت وضعیت: اگر pending یا activated باشد => open، اگر viewed باشد => viewed، در غیر این صورت closed
          status:
            chat.status === 'pending'
              ? 'pending'
              : chat.status === 'activated'
              ? 'activated'
              : chat.status === 'viewed'
              ? 'viewed'
              : chat.status === 'closed'
              ? 'closed'
              : 'unknown',
          createdAt: chat.created_at ? new Date(chat.created_at).toLocaleString() : '',
        }));

        setData(mappedData);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="ml-auto h-10 w-[100px]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((_, cellIndex) => (
                    <TableHead key={cellIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* قسمت سرچ: فیلتر بر اساس ستون user */}
        <Input
          placeholder="Filter by user..."
          value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('user')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto">
              Columns <ChevronDown className="mr-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
