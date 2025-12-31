import { Link } from "react-router-dom";
import { BookOpen, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  /* ---------- HANDLERS ---------- */

  const scrollToHeroSearch = () => {
    const el = document.getElementById("hero-search");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const triggerUpload = () => {
    const uploadBtn = document.getElementById("upload-btn");
    if (uploadBtn) {
      uploadBtn.click();
    }
  };

  const scrollToNotes = () => {
    const notes = document.getElementById("notes-section");
    if (notes) {
      notes.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-semibold">StudyShare</span>
            </Link>

            <p className="text-primary-foreground/70 text-sm mb-6">
              Empowering students to share knowledge and succeed together through collaborative learning.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://twitter.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-accent transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>

              <a
                href="https://github.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-accent transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>

              <a
                href="https://www.linkedin.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-accent transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              <a
                href="https://accounts.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-accent transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={scrollToHeroSearch}
                  className="text-primary-foreground/70 hover:text-accent text-sm transition-colors"
                >
                  Browse Notes
                </button>
              </li>
              <li>
                <button
                  onClick={triggerUpload}
                  className="text-primary-foreground/70 hover:text-accent text-sm transition-colors"
                >
                  Upload Notes
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToNotes}
                  className="text-primary-foreground/70 hover:text-accent text-sm transition-colors"
                >
                  Subjects
                </button>
              </li>
              <li>
                <Link to="/top-rated" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                  Top Rated
                </Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Popular Subjects</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={scrollToNotes} className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                  Mathematics
                </button>
              </li>
              <li>
                <button onClick={scrollToNotes} className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                  Physics
                </button>
              </li>
              <li>
                <button onClick={scrollToNotes} className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                  Computer Science
                </button>
              </li>
              <li>
                <button onClick={scrollToNotes} className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                  Economics
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} StudyShare. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Made with ❤️ for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
