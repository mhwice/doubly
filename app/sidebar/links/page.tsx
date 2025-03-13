"use client"

import { useState } from "react"
import {
  BarChart,
  ChevronDown,
  Filter,
  LinkIcon,
  MoreVertical,
  PieChart,
  Plus,
  Search,
  Settings,
  Zap,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Sample data for the table
const links = [
  {
    id: "1",
    shortUrl: "uurl.dev/u5TR6X7",
    destination: "leetcode.com/problemset",
    clicks: 0,
    createdAt: "21s",
  },
  {
    id: "2",
    shortUrl: "uurl.dev/kL9p2R",
    destination: "github.com/vercel/next.js",
    clicks: 24,
    createdAt: "2d",
  },
  {
    id: "3",
    shortUrl: "uurl.dev/mN7q3Z",
    destination: "docs.google.com/spreadsheets",
    clicks: 15,
    createdAt: "5d",
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter links based on search query
  const filteredLinks = links.filter(
    (link) =>
      link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.destination.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                <span className="text-xs font-bold">NE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">NextAuth</span>
                <span className="text-xs text-muted-foreground">Free</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/sidebar/links">
                    <LinkIcon className="h-4 w-4" />
                    <span>Links</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/sidebar/analytics">
                    <PieChart className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Zap className="h-4 w-4" />
                    <span>Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          {/* <SidebarFooter className="border-t">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Bulk Link Actions</h3>
                <p className="text-xs text-muted-foreground">
                  You can now update, archive and delete your links in bulk operations.
                </p>
                <div className="h-24 border rounded-md bg-muted/40 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Bulk actions preview</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Usage</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      <span>Events</span>
                    </div>
                    <span>0 of 1K</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-3 w-3" />
                      <span>Links</span>
                    </div>
                    <span>1 of 25</span>
                  </div>
                  <Progress value={33} className="h-1 mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">Usage will reset Apr 4, 2025</p>
                </div>
              </div>
              <Button className="w-full" variant="default">
                Get Dub Pro
              </Button>
            </div>
          </SidebarFooter> */}
        </Sidebar>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden w-screen">
          <header className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-bold">Links</h1>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Getting Started</span>
              <Badge variant="outline" className="ml-2">
                33% complete
              </Badge>
            </div> */}
          </header>

          <main className="flex-1 overflow-auto p-4">
            <div className="flex flex-col gap-4">
              {/* Filters and search */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    Display
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2" />
                    Create link
                    <kbd className="ml-2 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                      ⌘K
                    </kbd>
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Link</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLinks.length > 0 ? (
                      filteredLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                                <span className="text-amber-600 text-xs">↗</span>
                              </div>
                              {link.shortUrl}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{link.destination}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <BarChart className="h-3 w-3" />
                              {link.clicks}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">{link.createdAt}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem>Archive</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Viewing{" "}
                  {filteredLinks.length > 0 ? `1-${filteredLinks.length} of ${filteredLinks.length}` : "0-0 of 0"} links
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={filteredLinks.length === 0}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={filteredLinks.length === 0}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

