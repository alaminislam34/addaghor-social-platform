"use client"

import { useState } from "react"
import { Search, Plus, MapPin, Grid, List, Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getInitials } from "@/lib/utils"

const mockListings = [
  {
    id: "1",
    title: 'MacBook Pro 14" M3',
    price: 1800,
    description: "Like new condition, used for 6 months. Comes with original box and charger.",
    images: ["/macbook-pro-laptop-silver.jpg"],
    location: "San Francisco, CA",
    seller: { name: "John Doe", avatar: "/thoughtful-man-portrait.png", rating: 4.9 },
    category: "Electronics",
    condition: "Like New",
    postedAt: "2024-01-10",
    saved: false,
  },
  {
    id: "2",
    title: "Vintage Leather Sofa",
    price: 450,
    description: "Beautiful vintage brown leather sofa in excellent condition.",
    images: ["/vintage-leather-sofa-brown.jpg"],
    location: "New York, NY",
    seller: { name: "Jane Smith", avatar: "/woman-portrait.png", rating: 4.7 },
    category: "Furniture",
    condition: "Good",
    postedAt: "2024-01-08",
    saved: true,
  },
  {
    id: "3",
    title: "Mountain Bike - Trek",
    price: 650,
    description: "Trek mountain bike, 21 speed, great for trails and city riding.",
    images: ["/mountain-bike-trek-outdoors.jpg"],
    location: "Los Angeles, CA",
    seller: { name: "Mike Brown", avatar: "/smiling-man-portrait.png", rating: 5.0 },
    category: "Sports",
    condition: "Good",
    postedAt: "2024-01-12",
    saved: false,
  },
  {
    id: "4",
    title: "Canon EOS R6 Camera",
    price: 1500,
    description: "Professional mirrorless camera with 24-105mm lens kit.",
    images: ["/canon-camera-professional.jpg"],
    location: "Seattle, WA",
    seller: { name: "Sarah Wilson", avatar: "/professional-woman-portrait.png", rating: 4.8 },
    category: "Electronics",
    condition: "Excellent",
    postedAt: "2024-01-11",
    saved: false,
  },
  {
    id: "5",
    title: "Nike Air Jordan 1 Retro",
    price: 220,
    description: "Brand new, size 10. Never worn, with original box.",
    images: ["/nike-air-jordan-sneakers.jpg"],
    location: "Chicago, IL",
    seller: { name: "Alex Johnson", avatar: "/person-casual-portrait.jpg", rating: 4.6 },
    category: "Clothing",
    condition: "New",
    postedAt: "2024-01-09",
    saved: true,
  },
  {
    id: "6",
    title: "IKEA Standing Desk",
    price: 180,
    description: "Adjustable height standing desk, white finish. Barely used.",
    images: ["/standing-desk-white-office.jpg"],
    location: "Austin, TX",
    seller: { name: "Emily Davis", avatar: "/woman-young-portrait.jpg", rating: 4.9 },
    category: "Furniture",
    condition: "Like New",
    postedAt: "2024-01-13",
    saved: false,
  },
]

const categories = ["All", "Electronics", "Furniture", "Vehicles", "Clothing", "Sports", "Home & Garden"]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [savedItems, setSavedItems] = useState(
    mockListings.reduce((acc, item) => ({ ...acc, [item.id]: item.saved }), {}),
  )

  const filteredListings = mockListings
    .filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    })

  const toggleSaved = (id) => {
    setSavedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
      price,
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Sell Something
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
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

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No listings found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative aspect-square">
                <img
                  src={listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSaved(listing.id)
                  }}
                  className="absolute top-3 right-3 p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
                >
                  <Heart className={`h-5 w-5 ${savedItems[listing.id] ? "fill-destructive text-destructive" : ""}`} />
                </button>
                <Badge className="absolute top-3 left-3">{listing.condition}</Badge>
              </div>
              <CardContent className="p-4">
                <p className="text-xl font-bold text-primary">{formatPrice(listing.price)}</p>
                <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{listing.description}</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
                    <img
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 left-3">{listing.condition}</Badge>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-bold text-primary">{formatPrice(listing.price)}</p>
                        <h3 className="font-semibold text-lg">{listing.title}</h3>
                        <p className="text-muted-foreground mt-1">{listing.description}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSaved(listing.id)
                        }}
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                      >
                        <Heart
                          className={`h-5 w-5 ${savedItems[listing.id] ? "fill-destructive text-destructive" : ""}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location}</span>
                      </div>
                      <span>·</span>
                      <span>{listing.category}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={listing.seller.avatar || "/placeholder.svg"} alt={listing.seller.name} />
                          <AvatarFallback>{getInitials(listing.seller.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{listing.seller.name}</p>
                          <p className="text-xs text-muted-foreground">Rating: {listing.seller.rating}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          <MessageCircle className="h-4 w-4" />
                          Message
                        </Button>
                        <Button size="sm">Buy Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
