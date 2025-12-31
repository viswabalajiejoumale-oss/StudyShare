import { useState } from "react";
import { Button } from "./ui/button";
import { 
  Calculator, 
  Beaker, 
  Code, 
  BookOpen, 
  Globe, 
  Music, 
  Palette, 
  TrendingUp,
  Atom,
  Languages,
  Scale,
  Heart
} from "lucide-react";

const subjects = [
  { id: "all", name: "All", label: "All Subjects", icon: BookOpen },
  { id: "Mathematics", name: "Mathematics", label: "Mathematics", icon: Calculator },
  { id: "Physics", name: "Physics", label: "Physics", icon: Atom },
  { id: "Chemistry", name: "Chemistry", label: "Chemistry", icon: Beaker },
  { id: "Computer Science", name: "Computer Science", label: "Computer Science", icon: Code },
  { id: "Economics", name: "Economics", label: "Economics", icon: TrendingUp },
  { id: "History", name: "History", label: "History", icon: Globe },
  { id: "Literature", name: "Literature", label: "Literature", icon: Languages },
  { id: "Biology", name: "Biology", label: "Biology", icon: Heart },
  { id: "Law", name: "Law", label: "Law", icon: Scale },
  { id: "Music", name: "Music", label: "Music", icon: Music },
  { id: "Art", name: "Art", label: "Art", icon: Palette },
];

interface SubjectFilterProps {
  onFilterChange?: (subjectName: string) => void;
}

const SubjectFilter = ({ onFilterChange }: SubjectFilterProps) => {
  const [activeSubject, setActiveSubject] = useState("all");

  const handleClick = (subjectName: string) => {
    setActiveSubject(subjectName);
    onFilterChange?.(subjectName === 'all' ? 'All' : subjectName);
  };

  return (
    <div className="w-full overflow-x-auto pb-2 -mb-2">
      <div className="flex gap-2 min-w-max px-1">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          const isActive = activeSubject === subject.id;
          
          return (
            <Button
              key={subject.id}
              variant={isActive ? "default" : "secondary"}
              size="sm"
              onClick={() => handleClick(subject.name)}
              className={`gap-2 whitespace-nowrap transition-all duration-200 ${
                isActive 
                  ? "shadow-md" 
                  : "hover:bg-secondary/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              {subject.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectFilter;