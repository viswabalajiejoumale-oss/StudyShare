import { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import SubjectFilter from "./SubjectFilter";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, X, Share2, ThumbsUp, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NoteComments from "./NoteComments";
import { useNotes } from '@/hooks/useNotes';
import { getDownloadUrl } from '@/lib/googleDrive';
import { useAuth } from '@/hooks/useAuth';
import { incrementDownload, likeNote, unlikeNote, rateNote } from '@/lib/api';

import noteThumbnail1 from "@/assets/note-thumbnail-1.jpg";
import noteThumbnail2 from "@/assets/note-thumbnail-2.jpg";
import noteThumbnail3 from "@/assets/note-thumbnail-3.jpg";
import noteThumbnail4 from "@/assets/note-thumbnail-4.jpg";
import noteThumbnail5 from "@/assets/note-thumbnail-5.jpg";
import noteThumbnail6 from "@/assets/note-thumbnail-6.jpg";
import noteThumbnail7 from "@/assets/note-thumbnail-7.jpg";
import noteThumbnail8 from "@/assets/note-thumbnail-8.jpg";
import noteThumbnail9 from "@/assets/note-thumbnail-9.jpg";
import noteThumbnail10 from "@/assets/note-thumbnail-10.jpg";
import noteThumbnail11 from "@/assets/note-thumbnail-11.jpg";
import noteThumbnail12 from "@/assets/note-thumbnail-12.jpg";
import noteThumbnail13 from "@/assets/note-thumbnail-13.jpg";
import noteThumbnail14 from "@/assets/note-thumbnail-14.jpg";
import noteThumbnail15 from "@/assets/note-thumbnail-15.jpg";

/* ---------------- TYPES ---------------- */
type FileType = "pdf" | "docs" | "jpg" | "ppt";

type CommentType = {
  name: string;
  comment: string;
  rating: number;
};

type NoteType = {
  id: string;
  _id?: string;
  title: string;
  subject: string;
  description: string;
  author: string;
  likes: number;
  rating: number;
  downloads: number;
  fileType: FileType;
  thumbnail: string;
  createdAt: string;
  fileUrl?: string;
  comments?: CommentType[];
  google_drive_id?: string | null;
};

/* ---------------- SAMPLE DATA ---------------- */
const sampleNotes: NoteType[] = [
  {
    id: "1",
    title: "Calculus – Limits & Derivatives",
    subject: "Mathematics",
    description: "Well-structured calculus notes with solved problems.",
    author: "Ananya Sharma",
    likes: 120,
    rating: 4.6,
    downloads: 900,
    fileType: "pdf",
    thumbnail: noteThumbnail2,
    createdAt: "2 days ago",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    comments: [
      { name: "Ravi", comment: "Very helpful notes!", rating: 5 },
      { name: "Meena", comment: "Good but needs more examples.", rating: 3 },
    ],
  },
  {
    id: "2",
    title: "Physics – Laws of Motion",
    subject: "Physics",
    description: "Conceptual explanation with diagrams.",
    author: "Rahul Verma",
    likes: 98,
    rating: 4.2,
    downloads: 670,
    fileType: "ppt",
    thumbnail: noteThumbnail5,
    createdAt: "3 days ago",
    fileUrl: "https://file-examples.com/wp-content/uploads/2017/08/file_example_PPT_500kB.ppt",
    comments: [
      { name: "Amit", comment: "Slides are clear 👍", rating: 4 },
      { name: "Kiran", comment: "Too fast paced", rating: 2 },
    ],
  },
  {
    id: "3",
    title: "Organic Chemistry Reactions",
    subject: "Chemistry",
    description: "Reaction mechanisms explained simply.",
    author: "Neha Gupta",
    likes: 140,
    rating: 4.8,
    downloads: 1100,
    fileType: "docs",
    thumbnail: noteThumbnail3,
    createdAt: "1 week ago",
    fileUrl: "https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc",
    comments: [
      { name: "Suresh", comment: "Best chemistry notes!", rating: 5 },
    ],
  },
  {
    id: "4",
    title: "Data Structures Cheat Sheet",
    subject: "Computer Science",
    description: "Quick reference for interviews.",
    author: "Arjun Rao",
    likes: 300,
    rating: 4.9,
    downloads: 2000,
    fileType: "jpg",
    thumbnail: noteThumbnail1,
    createdAt: "4 days ago",
    fileUrl: "https://via.placeholder.com/800x600.png",
    comments: [
      { name: "Pooja", comment: "Very concise 👌", rating: 5 },
      { name: "Manoj", comment: "Missing trees section", rating: 3 },
    ],
  },
  {
    id: "5",
    title: "Electromagnetism Summary",
    subject: "Physics",
    description: "Maxwell equations and electromagnetic theory",
    author: "Rahul Verma",
    likes: 98,
    rating: 4.2,
    downloads: 670,
    fileType: "ppt",
    thumbnail: noteThumbnail7,
    createdAt: "3 days ago",
    fileUrl: "/files/physics.ppt",
    comments: [
      { name: "Joseph", comment: "Slides are clear 👍", rating: 4 },
      { name: "Abel", comment: "Too fast paced", rating: 2 },
    ],
  },
  {
    id: "6",
    title: "Mechanics Formula Sheet",
    subject: "Physics",
    description: "Newton laws and motion formulas.",
    author: "Suraj Singh",
    likes: 98,
    rating: 4.2,
    downloads: 670,
    fileType: "ppt",
    thumbnail: noteThumbnail6,
    createdAt: "3 days ago",
    fileUrl: "/files/physics.ppt",
    comments: [
      { name: "Aaron", comment: "Slides are clear 👍", rating: 4 },
      { name: "Suriya", comment: "Too fast paced", rating: 2 },
    ],
  },
  {
    id: "7",
    title: "Supply & Demand Analysis",
    subject: "Economics",
    description: "Market equilibrium and graphs explained.",
    author: "Neha Raj",
    likes: 98,
    rating: 4.2,
    downloads: 670,
    fileType: "ppt",
    thumbnail: noteThumbnail8,
    createdAt: "3 days ago",
    fileUrl: "/files/economics.ppt",
    comments: [
      { name: "Siva", comment: "Slides are clear 👍", rating: 4 },
      { name: "Keerthi", comment: "Too fast paced", rating: 2 },
    ],
  },
  {
    id: "8",
    title: "World War II Timeline",
    subject: "History",
    description: "Major events from 1939 to 1945.",
    author: "Virat Singh",
    likes: 98,
    rating: 4.2,
    downloads: 670,
    fileType: "ppt",
    thumbnail: noteThumbnail10,
    createdAt: "3 days ago",
    fileUrl: "/files/history.ppt",
    comments: [
      { name: "Shreya", comment: "Slides are clear 👍", rating: 4 },
      { name: "Lafan", comment: "Too fast paced", rating: 2 },
    ],
  },
  {
    id: "9",
    title: "Cold War Notes",
    subject: "History",
    description: "Political tensions.",
    author: "Praveen Kumar",
    likes: 98,
    rating: 4.2,
    downloads: 670,
    fileType: "ppt",
    thumbnail: noteThumbnail9,
    createdAt: "3 days ago",
    fileUrl: "/files/history.ppt",
    comments: [
      { name: "Veera", comment: "Slides are clear 👍", rating: 4.5 },
      { name: "Sai", comment: "Too fast paced", rating: 2 },
    ],
  },
];

/* ---------------- COMPONENT ---------------- */
const FeaturedNotes = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const { notes: dbNotes, loading: notesLoading } = useNotes(selectedSubject);
  const { user } = useAuth();
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  /* 🔍 LISTEN TO HERO SEARCH */
  useEffect(() => {
    const handler = (e: any) => {
      setSearchQuery(e.detail);
    };

    window.addEventListener("notes-search", handler);
    return () => window.removeEventListener("notes-search", handler);
  }, []);

  const sourceNotes = (dbNotes && dbNotes.length > 0) ? dbNotes.map(n => ({
    id: n.id,
    title: n.title,
    subject: n.subject,
    description: n.description || '',
    author: n.profiles?.display_name || 'Unknown',
    likes: n.likes_count || 0,
    rating: n.avg_rating || 0,
    downloads: n.download_count || 0,
    fileType: (n.file_type as any) || 'pdf',
    thumbnail: n.thumbnail_url || '',
    createdAt: new Date(n.created_at).toLocaleDateString(),
    fileUrl: n.file_url,
    google_drive_id: (n as any).google_drive_id ?? null,
  })) : sampleNotes;

  const filteredNotes = sourceNotes.filter(note => {
    if (!searchQuery) return true;

    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.subject.toLowerCase().includes(q) ||
      note.description.toLowerCase().includes(q)
    );
  });

  const handleDownload = async (note: any) => {
    if (!note.fileUrl) {
      alert("File has been deleted or removed.");
      return;
    }

    try {
      if (note._id ?? note.id) {
        await incrementDownload(note._id ?? note.id);
      }
    } catch (err) {
      // ignore
    }

    const dl = getDownloadUrl({ google_drive_id: note.google_drive_id, file_url: note.fileUrl });
    if (dl) window.open(dl, '_blank');
    else window.open(note.fileUrl, '_blank');
  };

  const handleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const handleRate = (id: string) => {
    setRatings(prev => ({
      ...prev,
      [id]: 5,
    }));
  };

  const navigate = useNavigate();

  return (
    <section id="anim-middle" className="py-16 md:py-24">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase">Featured</span>
            </div>
            <h2 className="text-3xl font-bold">Popular Study Notes</h2>
          </div>
        </div>

        <SubjectFilter />

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="cursor-pointer"
            >
              <NoteCard
                {...note}
                onPreview={(e) => { e?.stopPropagation(); navigate(`/preview/${note.id}`, { state: note }); }}
                onDownload={(e) => { e?.stopPropagation(); handleDownload(note); }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL (UNCHANGED) ================= */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-background w-[90%] max-w-4xl rounded-xl shadow-lg relative">

            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

              <div className="border rounded-lg flex items-center justify-center h-[400px] bg-muted">
                <p className="text-sm text-muted-foreground">
                  Preview available for {selectedNote.fileType.toUpperCase()}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">{selectedNote.title}</h3>
                <p className="text-sm">{selectedNote.description}</p>

                <p><b>Subject:</b> {selectedNote.subject}</p>
                <p><b>Author:</b> {selectedNote.author}</p>

                <div className="flex gap-4 mt-2">
                  <Button size="sm" onClick={async () => {
                    if (selectedNote._id) {
                      try {
                        try { await unlikeNote(selectedNote._id); }
                        catch { await likeNote(selectedNote._id); }
                        alert('Like toggled');
                      } catch (err) { console.error(err); alert('Failed to toggle like'); }
                    } else {
                      // local-only sample
                      setLikes(prev => ({ ...prev, [selectedNote.id]: (prev[selectedNote.id] ?? 0) + 1 }));
                    }
                  }}>
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {likes[selectedNote._id ?? selectedNote.id] ?? selectedNote.likes}
                  </Button>

                  <Button size="sm" variant="secondary" onClick={async () => {
                    if (selectedNote._id) {
                      if (!confirm('Set rating 5?')) return;
                      try {
                        await rateNote(selectedNote._id, 5);
                        alert('Rated 5');
                      } catch (err) { console.error(err); alert('Failed to rate'); }
                    } else {
                      setRatings(prev => ({ ...prev, [selectedNote.id]: 5 }));
                    }
                  }}>
                    <Star className="h-4 w-4 mr-1" />
                    {ratings[selectedNote._id ?? selectedNote.id] ?? selectedNote.rating}
                  </Button>

                  <Button size="sm" variant="outline" onClick={async () => {
                    // try to open share link if drive id exists
                    const driveId = (selectedNote as any).google_drive_id;
                    if (driveId) window.open(`https://drive.google.com/file/d/${driveId}/view?usp=sharing`, '_blank');
                    else alert('No drive share link available. Generate a Drive preview first from the note preview.');
                  }}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="secondary" onClick={() => handleDownload(selectedNote)}>
                    Preview
                  </Button>
                  <Button onClick={() => handleDownload(selectedNote)}>
                    Download
                  </Button>
                </div>

                <div className="mt-4">
                  <NoteComments noteId={selectedNote.id} />
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedNotes;
