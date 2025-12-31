import { useState } from "react";
import { Search, BookOpen, Users, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const HeroSection = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;

    // Dispatch global search event
    window.dispatchEvent(
      new CustomEvent("notes-search", {
        detail: query.toLowerCase(),
      })
    );
  };

  return (
    <section id="anim-up" className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm animate-fade-up">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span>Trusted by 10,000+ students</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl animate-fade-up">
            Share Knowledge, <span className="relative">Succeed Together</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 text-lg text-primary-foreground/80 md:text-xl max-w-2xl mx-auto animate-fade-up">
            The collaborative platform where students share, discover, and rate study materials.
          </p>

          {/* 🔍 SEARCH BAR (WORKING) */}
          <div className="mx-auto max-w-2xl animate-fade-up">
            <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/60" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search for notes, subjects, or courses..."
                  className="h-12 pl-12 bg-primary-foreground text-foreground border-0 placeholder:text-muted-foreground focus-visible:ring-accent"
                />
              </div>
              <Button
                variant="hero"
                size="lg"
                className="h-12"
                onClick={handleSearch}
              >
                Search Notes
              </Button>
            </div>

            <p className="mt-3 text-sm text-primary-foreground/60">
              Popular: Calculus, Organic Chemistry, Data Structures, Economics
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up">
            <div className="text-center">
              <BookOpen className="mx-auto h-6 w-6 text-accent" />
              <p className="font-bold text-primary-foreground">25K+</p>
              <p className="text-sm text-primary-foreground/70">Notes Shared</p>
            </div>
            <div className="text-center">
              <Users className="mx-auto h-6 w-6 text-accent" />
              <p className="font-bold text-primary-foreground">10K+</p>
              <p className="text-sm text-primary-foreground/70">Students</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto h-6 w-6 text-accent fill-accent" />
              <p className="font-bold text-primary-foreground">4.9</p>
              <p className="text-sm text-primary-foreground/70">Avg Rating</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
