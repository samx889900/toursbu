"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { publishedTrips, categories } from "@/lib/data/trips";
import { cn } from "@/lib/utils";
import { TripCard } from "@/components/shared/trip-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

type Difficulty = "ALL" | "EASY" | "MODERATE" | "HARD";
type SortOption = "date" | "price-low" | "price-high" | "popular";

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTrips = useMemo(() => {
    let trips = [...publishedTrips];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      trips = trips.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      trips = trips.filter((t) => t.categoryId === selectedCategory);
    }

    if (selectedDifficulty !== "ALL") {
      trips = trips.filter((t) => t.difficulty === selectedDifficulty);
    }

    switch (sortBy) {
      case "date":
        trips.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case "price-low":
        trips.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        trips.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        trips.sort((a, b) => (b.totalSeats - b.availableSeats) - (a.totalSeats - a.availableSeats));
        break;
    }

    return trips;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const activeFilters = [
    selectedCategory !== "all" && `Category: ${categories.find((c) => c.id === selectedCategory)?.name}`,
    selectedDifficulty !== "ALL" && `Difficulty: ${selectedDifficulty}`,
    selectedMonth && `Month: ${selectedMonth}`,
    selectedBudget && `Budget: ${selectedBudget}`,
    selectedDuration && `Duration: ${selectedDuration}`,
  ].filter(Boolean);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedMonth("");
    setSelectedBudget("");
    setSelectedDuration("");
    setSelectedCategory("all");
    setSelectedDifficulty("ALL");
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--tbu-background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Segmented Search Bar (Airbnb Style) */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center bg-[var(--tbu-canvas)] rounded-full border border-[var(--tbu-hairline)] shadow-tbu-2 p-2 relative z-20">
            {/* Destination */}
            <div className="flex-1 w-full md:w-auto px-4 py-2 hover:bg-[var(--tbu-surface)] rounded-full transition-colors cursor-pointer group">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--tbu-ink)] mb-0.5 group-hover:text-[var(--tbu-blue)] transition-colors cursor-pointer">
                Destination
              </label>
              <input 
                type="text" 
                placeholder="Where to?" 
                className="w-full bg-transparent border-none p-0 text-body-sm text-[var(--tbu-ink)] placeholder:text-[var(--tbu-muted)] focus:ring-0 cursor-pointer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="hidden md:block w-px h-8 bg-[var(--tbu-hairline)] mx-2" />
            
            {/* Month */}
            <div className="flex-1 w-full md:w-auto px-4 py-2 hover:bg-[var(--tbu-surface)] rounded-full transition-colors cursor-pointer group">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--tbu-ink)] mb-0.5 group-hover:text-[var(--tbu-blue)] transition-colors cursor-pointer">
                Month
              </label>
              <select 
                className="w-full bg-transparent border-none p-0 text-body-sm text-[var(--tbu-ink)] appearance-none cursor-pointer focus:ring-0"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Any month</option>
                <option value="jan">January</option>
                <option value="feb">February</option>
                <option value="mar">March</option>
                <option value="apr">April</option>
                <option value="may">May</option>
              </select>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-[var(--tbu-hairline)] mx-2" />
            
            {/* Budget */}
            <div className="flex-1 w-full md:w-auto px-4 py-2 hover:bg-[var(--tbu-surface)] rounded-full transition-colors cursor-pointer group">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--tbu-ink)] mb-0.5 group-hover:text-[var(--tbu-blue)] transition-colors cursor-pointer">
                Budget
              </label>
              <select 
                className="w-full bg-transparent border-none p-0 text-body-sm text-[var(--tbu-ink)] appearance-none cursor-pointer focus:ring-0"
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
              >
                <option value="">Any budget</option>
                <option value="under5k">Under ₹5,000</option>
                <option value="5k-10k">₹5,000 - ₹10,000</option>
                <option value="above10k">Above ₹10,000</option>
              </select>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-[var(--tbu-hairline)] mx-2" />
            
            {/* Duration */}
            <div className="flex-1 w-full md:w-auto px-4 py-2 hover:bg-[var(--tbu-surface)] rounded-full transition-colors cursor-pointer group">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--tbu-ink)] mb-0.5 group-hover:text-[var(--tbu-blue)] transition-colors cursor-pointer">
                Duration
              </label>
              <select 
                className="w-full bg-transparent border-none p-0 text-body-sm text-[var(--tbu-ink)] appearance-none cursor-pointer focus:ring-0"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                <option value="">Any duration</option>
                <option value="weekend">Weekend (1-3 days)</option>
                <option value="short">Short (4-6 days)</option>
                <option value="long">Long (7+ days)</option>
              </select>
            </div>
            
            <Button size="icon" className="w-12 h-12 rounded-full shrink-0 ml-2 shadow-sm hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Emoji Category Strip */}
        <div className="mb-8 overflow-x-auto pb-4 no-scrollbar border-b border-[var(--tbu-hairline)]">
          <div className="flex items-center gap-6 min-w-max mx-auto px-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "flex flex-col items-center gap-2 pb-3 border-b-2 transition-all min-w-[64px]",
                selectedCategory === "all"
                  ? "border-[var(--tbu-ink)] text-[var(--tbu-ink)] opacity-100"
                  : "border-transparent text-[var(--tbu-muted)] opacity-60 hover:opacity-100"
              )}
            >
              <div className="text-2xl">🌍</div>
              <span className="text-[11px] font-semibold uppercase tracking-wider">All</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-2 pb-3 border-b-2 transition-all min-w-[64px]",
                  selectedCategory === cat.id
                    ? "border-[var(--tbu-ink)] text-[var(--tbu-ink)] opacity-100"
                    : "border-transparent text-[var(--tbu-muted)] opacity-60 hover:opacity-100"
                )}
              >
                <div className="text-2xl">{cat.icon}</div>
                <span className="text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Active Tags */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="rounded-full shadow-sm gap-2 w-full sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] px-4 py-2 text-caption font-medium text-[var(--tbu-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] shadow-sm appearance-none cursor-pointer w-full sm:w-auto"
            >
              <option value="date">Sort: Upcoming First</option>
              <option value="price-low">Sort: Price Low → High</option>
              <option value="price-high">Sort: Price High → Low</option>
              <option value="popular">Sort: Most Popular</option>
            </select>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {activeFilters.map((f) => (
                <span
                  key={f as string}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-ink)] px-3 py-1 text-[11px] font-medium border border-[var(--tbu-hairline)]"
                >
                  {f}
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-medium text-[var(--tbu-blue)] hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Extra Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] shadow-sm animate-in fade-in slide-in-from-top-4">
            <h3 className="text-body font-semibold text-[var(--tbu-ink)] mb-4">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {(["ALL", "EASY", "MODERATE", "HARD"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-caption font-medium transition-colors border",
                    selectedDifficulty === d
                      ? "bg-[var(--tbu-ink)] text-[var(--tbu-canvas)] border-[var(--tbu-ink)]"
                      : "bg-transparent text-[var(--tbu-ink)] border-[var(--tbu-hairline)] hover:border-[var(--tbu-ink)]"
                  )}
                >
                  {d === "ALL" ? "All Levels" : d.charAt(0) + d.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {filteredTrips.length === 0 ? (
          <EmptyState
            title="No trips found"
            description="Try adjusting your search or filters to find available trips."
            action={{ label: "Clear Filters", onClick: clearAllFilters }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTrips.map((trip, i) => (
              <TripCard
                key={trip.id}
                trip={trip}
                index={i}
                animationMode="instant"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
