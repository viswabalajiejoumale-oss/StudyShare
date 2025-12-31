import { Heart, Star, Download, Eye, FileText, Image } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface NoteCardProps {
  id: string;
  title: string;
  subject: string;
  description: string;
  author: string;
  authorAvatar?: string;
  likes: number;
  rating: number;
  downloads: number;
  fileType: "pdf" | "docs" | "jpg" | "ppt" | "image";
  thumbnail?: string;
  createdAt: string;
  onPreview?: (e?: any) => void;
  onDownload?: (e?: any) => void;
  googleDriveId?: string | null;
  fileUrl?: string | null;
}

const NoteCard = ({
  title,
  subject,
  description,
  author,
  authorAvatar,
  likes,
  rating,
  downloads,
  fileType,
  thumbnail,
  createdAt,
  onPreview,
  onDownload,
}: NoteCardProps) => {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            {fileType === "pdf" ? (
              <FileText className="h-16 w-16 text-primary/40" />
            ) : (
              <Image className="h-16 w-16 text-primary/40" />
            )}
          </div>
        )}
        
        {/* File Type Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 uppercase text-xs font-semibold bg-background/90 backdrop-blur-sm"
        >
          {fileType}
        </Badge>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button size="sm" variant="secondary" className="gap-1" onClick={(e) => { e.stopPropagation(); onPreview && onPreview(e); }}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button size="sm" variant="hero" className="gap-1" onClick={(e) => { e.stopPropagation(); onDownload && onDownload(e); }}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Subject */}
        <Badge variant="outline" className="w-fit mb-2 text-xs border-primary/30 text-primary">
          {subject}
        </Badge>

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {authorAvatar ? (
              <img src={authorAvatar} alt={author} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-primary">
                {author.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">{author}</p>
            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors group/like">
              <Heart className="h-4 w-4 group-hover/like:fill-destructive" />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="h-4 w-4" />
            <span className="text-sm">{downloads}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;