import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t py-6 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>© 2025, made with</span>
          <Heart size={16} className="text-red-500 fill-red-500" />
          <span>by</span>
          <a
            href="https://www.creative-tim.com/?_ga=2.144777527.2047538345.1768887475-571404473.1768887475"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Creative Tim
          </a>
          <span> for a better web.</span>
          <span> • Distributed by</span>
          <a
            href="https://themewagon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            ThemeWagon
          </a>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a
            href="#!"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Creative Tim
          </a>
          <a
            href="#!"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            About Us
          </a>
          <a
            href="#!"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Blog
          </a>
          <a
            href="#!"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            License
          </a>
        </div>
      </div>
    </footer>
  );
}

