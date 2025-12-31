import { Upload, Search, Star, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Notes",
    description: "Share your study materials in PDF or image format. Add a title, subject, and brief description.",
    color: "bg-primary",
  },
  {
    icon: Search,
    title: "Discover Content",
    description: "Browse thousands of notes by subject or use our powerful search to find exactly what you need.",
    color: "bg-accent",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Help the community by rating notes. The best content rises to the top based on peer reviews.",
    color: "bg-success",
  },
  {
    icon: Download,
    title: "Download & Learn",
    description: "Access high-quality study materials anytime. Download notes to study offline.",
    color: "bg-primary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How StudyShare Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join thousands of students already sharing and discovering study materials.
            Getting started takes just minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className="relative group"
              >
                {/* Connector Line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="flex flex-col items-center text-center">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-9 w-9 text-primary-foreground" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;