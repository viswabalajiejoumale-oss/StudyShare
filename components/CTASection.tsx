import { Button } from "./ui/button";
import { ArrowRight, BookOpen, Users } from "lucide-react";

const CTASection = () => {
  return (
    <section id="anim-down" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-16">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Content */}
            <div className="text-center lg:text-left max-w-xl">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Ready to Share Your Knowledge?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join our community of students helping each other succeed. 
                Upload your first notes today and start making a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="hero" size="xl" className="gap-2">
                  Start Sharing
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button variant="hero-outline" size="xl" className="gap-2">
                  Browse Notes
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">25,000+</p>
                  <p className="text-sm text-primary-foreground/70">Notes Uploaded</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">10,000+</p>
                  <p className="text-sm text-primary-foreground/70">Active Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;