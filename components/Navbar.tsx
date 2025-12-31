import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { BookOpen, Menu, X, Upload } from "lucide-react";
import AdminLink from './AdminLink';
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "./ui/dropdown-menu";
import { UploadNoteDialog } from "./UploadNoteDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const scrollToSection = (pos: 'up' | 'middle' | 'down') => {
    const id = `anim-${pos}`;
    const el = document.getElementById(id);
    if (!el) {
      // if section not found, fallback to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // choose animation class based on pos
    const animClass = pos === 'up' ? 'animate-up' : pos === 'middle' ? 'animate-middle' : 'animate-down';

    // scroll and add animation class
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('animate-up','animate-middle','animate-down');
    void el.offsetWidth; // force reflow so animation can restart
    el.classList.add(animClass);

    // remove class after animation completes
    setTimeout(() => el.classList.remove(animClass), 900);
  };



  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              StudyShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => { scrollToSection('up'); setIsOpen(false); }}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Browse Notes
            </button>

            <button
              onClick={() => { scrollToSection('middle'); setIsOpen(false); }}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Subjects
            </button>

            <button
              onClick={() => { scrollToSection('down'); setIsOpen(false); }}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              About
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* ❌ Search icon removed */}

            <UploadNoteDialog triggerLabel="Upload" triggerClassName="gap-2" onSuccess={() => navigate('/my-uploads')} />

            {user && <AdminLink />}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">
                      {profile?.display_name ?? user.email?.split("@")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => navigate("/profile")}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate("/my-uploads")}>
                    My Uploads
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async () => {
                      await signOut();
                      navigate("/");
                    }}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">

              <button
                onClick={() => { setIsOpen(false); scrollToSection('up'); }}
                className="text-left text-muted-foreground hover:text-foreground font-medium px-2 py-2"
              >
                Browse Notes
              </button>

              <button
                onClick={() => { setIsOpen(false); scrollToSection('middle'); }}
                className="text-left text-muted-foreground hover:text-foreground font-medium px-2 py-2"
              >
                Subjects
              </button>

              <button
                onClick={() => { setIsOpen(false); scrollToSection('down'); }}
                className="text-left text-muted-foreground hover:text-foreground font-medium px-2 py-2"
              >
                About
              </button>

              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <UploadNoteDialog
                  triggerLabel="Upload Notes"
                  triggerClassName="gap-2 w-full"
                />

                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={async () => {
                      await signOut();
                      setIsOpen(false);
                      navigate("/");
                    }}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
