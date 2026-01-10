"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock, Users, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils"

const mockEvents = [
  {
    id: "1",
    title: "Tech Meetup 2024",
    description: "Join us for an evening of networking and talks about the latest in tech.",
    date: "2024-02-15",
    time: "6:00 PM",
    location: "San Francisco, CA",
    image: "/tech-conference-meetup.jpg",
    attendees: 156,
    interested: 342,
    host: { name: "Tech Community SF", avatar: "/tech-community-logo.png" },
    category: "Technology",
  },
  {
    id: "2",
    title: "Photography Workshop",
    description: "Learn the basics of portrait photography from professionals.",
    date: "2024-02-20",
    time: "2:00 PM",
    location: "New York, NY",
    image: "/photography-workshop-camera.jpg",
    attendees: 45,
    interested: 128,
    host: { name: "Creative Arts Studio", avatar: "/art-studio-logo.png" },
    category: "Arts",
  },
  {
    id: "3",
    title: "Fitness Bootcamp",
    description: "Get fit with our outdoor bootcamp session. All fitness levels welcome!",
    date: "2024-02-18",
    time: "7:00 AM",
    location: "Los Angeles, CA",
    image: "/fitness-bootcamp-outdoor-exercise.jpg",
    attendees: 89,
    interested: 215,
    host: { name: "FitLife Community", avatar: "/fitness-logo.png" },
    category: "Health",
  },
  {
    id: "4",
    title: "Book Club Meeting",
    description: "This month we are discussing 'The Midnight Library' by Matt Haig.",
    date: "2024-02-22",
    time: "5:00 PM",
    location: "Online",
    image: "/book-club-reading-library.jpg",
    attendees: 32,
    interested: 67,
    host: { name: "Readers United", avatar: "/book-club-logo.png" },
    category: "Social",
  },
]

const categories = ["All", "Technology", "Arts", "Health", "Social", "Music", "Business"]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatEventDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Header */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-muted-foreground font-medium">
                {day}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredEvents.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No events found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-40">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-3 left-3">{event.category}</Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-center bg-primary/10 rounded-lg p-2 min-w-[50px]">
                    <p className="text-xs text-primary font-medium uppercase">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </p>
                    <p className="text-xl font-bold text-primary">{new Date(event.date).getDate()}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatEventDate(event.date)} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendees} going · {event.interested} interested
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={event.host.avatar || "/placeholder.svg"} alt={event.host.name} />
                      <AvatarFallback>{getInitials(event.host.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{event.host.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Interested
                    </Button>
                    <Button size="sm">Going</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
