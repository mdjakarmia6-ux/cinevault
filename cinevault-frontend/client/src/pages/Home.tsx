import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Film,
  Menu,
  Play,
  Search,
  SlidersHorizontal,
  Star,
  Tv,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AD_LINK, getAdminConfig, getYoutubeEmbedUrl, getYoutubeLink, type AdminConfig } from "../videoLinks";

type Title = {
  title: string;
  type: "Movie" | "TV Show" | "Documentary";
  region: "India" | "USA" | "UK" | "International";
  year: string;
  genre: string;
  language: "Hindi" | "Chinese" | "English" | "Bangla";
  rating: string;
  image: string;
  providers: string[];
  tag?: string;
};

const titles: Title[] = [
  { title: "Jawan", type: "Movie", region: "India", year: "2023", genre: "Action", language: "Hindi", rating: "7.0", tag: "Hindi", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=88" },
  { title: "3 Idiots", type: "Movie", region: "India", year: "2009", genre: "Drama", language: "Hindi", rating: "8.4", tag: "Hindi", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=88" },
  { title: "Dangal", type: "Movie", region: "India", year: "2016", genre: "Drama", language: "Hindi", rating: "8.3", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=88" },
  { title: "Pathaan", type: "Movie", region: "India", year: "2023", genre: "Action", language: "Hindi", rating: "5.8", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=88" },
  { title: "Lagaan", type: "Movie", region: "India", year: "2001", genre: "Drama", language: "Hindi", rating: "8.1", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=88&sat=-12" },
  { title: "Andhadhun", type: "Movie", region: "India", year: "2018", genre: "Thriller", language: "Hindi", rating: "8.2", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=88&hue=12" },
  { title: "Queen", type: "Movie", region: "India", year: "2013", genre: "Romance", language: "Hindi", rating: "8.1", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=88&sat=-10" },
  { title: "Ne Zha 2", type: "Movie", region: "International", year: "2025", genre: "Adventure", language: "Chinese", rating: "8.3", tag: "Chinese", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=88&sat=-20" },
  { title: "Hero", type: "Movie", region: "International", year: "2002", genre: "Action", language: "Chinese", rating: "7.9", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=88" },
  { title: "The Wandering Earth", type: "Movie", region: "International", year: "2019", genre: "Sci-Fi", language: "Chinese", rating: "6.9", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=88&sat=-15" },
  { title: "Crouching Tiger, Hidden Dragon", type: "Movie", region: "International", year: "2000", genre: "Adventure", language: "Chinese", rating: "7.9", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88" },
  { title: "Infernal Affairs", type: "Movie", region: "International", year: "2002", genre: "Thriller", language: "Chinese", rating: "8.0", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=88&sat=-16" },
  { title: "Ip Man", type: "Movie", region: "International", year: "2008", genre: "Action", language: "Chinese", rating: "8.0", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=88&sat=-17" },
  { title: "Farewell My Concubine", type: "Movie", region: "International", year: "1993", genre: "Drama", language: "Chinese", rating: "8.1", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88&hue=12" },
  { title: "Interstellar", type: "Movie", region: "USA", year: "2014", genre: "Sci-Fi", language: "English", rating: "8.7", tag: "English", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=88" },
  { title: "Inception", type: "Movie", region: "USA", year: "2010", genre: "Sci-Fi", language: "English", rating: "8.8", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=88&sat=-25" },
  { title: "The Dark Knight", type: "Movie", region: "USA", year: "2008", genre: "Action", language: "English", rating: "9.0", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=88&sat=-30" },
  { title: "The Shawshank Redemption", type: "Movie", region: "USA", year: "1994", genre: "Drama", language: "English", rating: "9.3", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=88" },
  { title: "The Matrix", type: "Movie", region: "USA", year: "1999", genre: "Sci-Fi", language: "English", rating: "8.7", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=88&hue=85" },
  { title: "Pulp Fiction", type: "Movie", region: "USA", year: "1994", genre: "Thriller", language: "English", rating: "8.9", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=88&sat=-18" },
  { title: "The Godfather", type: "Movie", region: "USA", year: "1972", genre: "Drama", language: "English", rating: "9.2", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=88&sat=-22" },
  { title: "Hawa", type: "Movie", region: "International", year: "2022", genre: "Drama", language: "Bangla", rating: "8.0", tag: "Bangla", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1507525421634-bd6d6a1a6f3a?auto=format&fit=crop&w=800&q=88" },
  { title: "Aynabaji", type: "Movie", region: "International", year: "2016", genre: "Thriller", language: "Bangla", rating: "8.1", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=88&sat=-18" },
  { title: "Debi", type: "Movie", region: "International", year: "2018", genre: "Thriller", language: "Bangla", rating: "7.5", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=88&hue=15" },
  { title: "Poran", type: "Movie", region: "International", year: "2022", genre: "Romance", language: "Bangla", rating: "7.8", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=88" },
  { title: "Matir Moina", type: "Movie", region: "International", year: "2002", genre: "Drama", language: "Bangla", rating: "7.9", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=88&hue=22" },
  { title: "Television", type: "Movie", region: "International", year: "2012", genre: "Drama", language: "Bangla", rating: "7.8", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88&sat=-12" },
  { title: "No Bed of Roses", type: "Movie", region: "International", year: "2017", genre: "Drama", language: "Bangla", rating: "7.1", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=88&sat=-18" },
  { title: "Toy Story", type: "Movie", region: "USA", year: "1995", genre: "Animation", language: "English", rating: "8.3", tag: "Cartoon", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=88&sat=20" },
  { title: "The Lion King", type: "Movie", region: "USA", year: "1994", genre: "Animation", language: "English", rating: "8.5", tag: "Cartoon", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=88&hue=30" },
  { title: "Spirited Away", type: "Movie", region: "International", year: "2001", genre: "Animation", language: "English", rating: "8.6", tag: "Cartoon", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88&hue=55" },
  { title: "Frozen", type: "Movie", region: "USA", year: "2013", genre: "Animation", language: "English", rating: "7.4", tag: "Cartoon", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=88&sat=-20" },
  { title: "Coco", type: "Movie", region: "USA", year: "2017", genre: "Animation", language: "English", rating: "8.4", tag: "Cartoon", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=88&hue=22" },
  { title: "How to Train Your Dragon", type: "Movie", region: "USA", year: "2010", genre: "Animation", language: "English", rating: "8.1", tag: "Cartoon", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=88&hue=18" },
  { title: "Kung Fu Panda", type: "Movie", region: "USA", year: "2008", genre: "Animation", language: "English", rating: "7.6", tag: "Cartoon", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=88&hue=8" },
  { title: "Ne Zha", type: "Movie", region: "International", year: "2019", genre: "Animation", language: "Chinese", rating: "7.4", tag: "Cartoon", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=88&hue=320" },
  { title: "Hanuman", type: "Movie", region: "India", year: "2005", genre: "Animation", language: "Hindi", rating: "6.0", tag: "Cartoon", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=88&hue=12" },
  { title: "Nocturne Protocol", type: "Movie", region: "USA", year: "2025", genre: "Sci-Fi", language: "English", rating: "8.7", tag: "New", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=88" },
  { title: "The Last Frame", type: "Movie", region: "USA", year: "2024", genre: "Drama", language: "English", rating: "8.4", tag: "Popular", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=88" },
  { title: "Velvet Horizon", type: "Movie", region: "India", year: "2025", genre: "Romance", language: "Hindi", rating: "8.1", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=88" },
  { title: "Static Bloom", type: "TV Show", region: "India", year: "2023", genre: "Thriller", language: "English", rating: "8.5", tag: "Popular", providers: ["NF", "CV"], image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=88" },
  { title: "Afterlight", type: "Movie", region: "UK", year: "2024", genre: "Drama", language: "English", rating: "8.9", tag: "Editor's pick", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88" },
  { title: "Neon Saints", type: "Movie", region: "USA", year: "2025", genre: "Action", language: "English", rating: "8.3", providers: ["AP", "NF"], image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=88" },
  { title: "Low Tide", type: "TV Show", region: "UK", year: "2022", genre: "Mystery", language: "English", rating: "7.9", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88&sat=-20" },
  { title: "The Sound Between", type: "Documentary", region: "International", year: "2024", genre: "Music", language: "English", rating: "8.8", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=88" },
  { title: "Monsoon Letters", type: "Movie", region: "India", year: "2025", genre: "Drama", language: "Hindi", rating: "8.6", tag: "India pick", providers: ["CV", "PM"], image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=88" },
  { title: "Golden State", type: "Movie", region: "USA", year: "2024", genre: "Action", language: "English", rating: "8.2", providers: ["NF", "AP"], image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=88" },
  { title: "Northbound", type: "Movie", region: "UK", year: "2025", genre: "Romance", language: "English", rating: "8.0", tag: "UK pick", providers: ["CV", "NF"], image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=800&q=88" },
  { title: "Midnight Atlas", type: "Movie", region: "International", year: "2025", genre: "Adventure", language: "English", rating: "8.5", tag: "World cinema", providers: ["CV", "AP"], image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88&hue=30" },
];

const providers = ["All providers", "CineVault", "Netflix", "Prime Video", "Apple TV+", "Free to watch"];
const genres = ["All genres", "Action", "Drama", "Sci-Fi", "Romance", "Thriller", "Animation", "Documentary"];
const regions = ["All regions", "India", "USA", "UK", "International"] as const;
const languages = ["All languages", "Hindi", "Chinese", "English", "Bangla"] as const;

function ProviderChips({ providers: providerList }: { providers: string[] }) {
  return <div className="provider-chips">{providerList.map((provider) => <span key={provider} className={`provider-chip ${provider.toLowerCase()}`}>{provider}</span>)}</div>;
}

function TitleCard({ item, saved, onSave, onPlay }: { item: Title; saved: boolean; onSave: () => void; onPlay: () => void }) {
  return (
    <article className="guide-card">
      <div className="guide-poster-wrap">
        <img src={item.image} alt={`${item.title} poster`} className="guide-poster" loading="lazy" />
        <div className="guide-poster-gradient" />
        {item.tag ? <span className="guide-tag">{item.tag}</span> : null}
        <button className="guide-play" aria-label={`Play ${item.title}`} onClick={onPlay}><Play size={16} fill="currentColor" /></button>
        <button className={`guide-save ${saved ? "saved" : ""}`} aria-label={saved ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`} onClick={onSave}>{saved ? <Check size={16} /> : <Bookmark size={16} />}</button>
      </div>
      <div className="guide-card-body">
        <div className="guide-card-title"><h3>{item.title}</h3><span><Star size={12} fill="currentColor" /> {item.rating}</span></div>
        <p>{item.year} <i /> {item.type} <i /> {item.genre} <i /> {item.language} <i /> {item.region}</p>
        <div className="where-row"><span>Stream on</span><ProviderChips providers={item.providers} /></div>
      </div>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"All" | "Movies" | "TV Shows">("All");
  const [provider, setProvider] = useState("All providers");
  const [genre, setGenre] = useState("All genres");
  const [language, setLanguage] = useState<(typeof languages)[number]>("All languages");
  const [region, setRegion] = useState<(typeof regions)[number]>("All regions");
  const [sort, setSort] = useState("Popular");
  const [saved, setSaved] = useState<string[]>([]);
  const [mobileNav, setMobileNav] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [playback, setPlayback] = useState<{ title: Title; stage: "ad" | "ready"; seconds: number; adOpened: boolean } | null>(null);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => getAdminConfig());
  const [automaticTitles, setAutomaticTitles] = useState<Title[]>([]);
  const [automaticMovieTitles, setAutomaticMovieTitles] = useState<Title[]>([]);
  const [catalogPage, setCatalogPage] = useState(299);
  const [moviePage, setMoviePage] = useState(0);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(24);

  const catalogWithOverrides = useMemo(() => {
    const combined = [...automaticMovieTitles, ...automaticTitles, ...titles];
    const unique = combined.filter((item, index, list) => list.findIndex((candidate) => candidate.title === item.title) === index);
    return unique.map((item) => ({ ...item, image: adminConfig.movies[item.title]?.thumbnail || item.image }));
  }, [adminConfig, automaticMovieTitles, automaticTitles]);

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);
    fetch("/api/catalog?page=300")
      .then((response) => { if (!response.ok) throw new Error("catalog unavailable"); return response.json(); })
      .then((payload: { titles?: Title[] }) => { if (!cancelled) setAutomaticTitles(payload.titles || []); })
      .catch(() => { if (!cancelled) setCatalogError(true); })
      .finally(() => { if (!cancelled) setCatalogLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!playback || playback.stage !== "ad" || !playback.adOpened || playback.seconds <= 0) return;
    const timer = window.setTimeout(() => setPlayback((current) => current ? { ...current, seconds: current.seconds - 1 } : null), 1000);
    return () => window.clearTimeout(timer);
  }, [playback]);

  useEffect(() => {
    if (!playback || playback.stage !== "ad" || !playback.adOpened || playback.seconds !== 0) return;
    setPlayback((current) => current ? { ...current, stage: "ready" } : null);
  }, [playback]);

  const filteredTitles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalogWithOverrides.filter((item) => {
      const typeMatch = mode === "All" || (mode === "Movies" ? item.type === "Movie" : item.type === "TV Show");
      const genreMatch = genre === "All genres" || item.genre === genre;
      const languageMatch = language === "All languages" || item.language === language;
      const regionMatch = region === "All regions" || item.region === region;
      const providerMatch = provider === "All providers" || (provider === "Free to watch" ? item.providers.includes("CV") : item.providers.some((entry) => provider.toLowerCase().includes(entry.toLowerCase()) || (provider === "CineVault" && entry === "CV") || (provider === "Netflix" && entry === "NF") || (provider === "Prime Video" && entry === "PM") || (provider === "Apple TV+" && entry === "AP")));
      const textMatch = !needle || `${item.title} ${item.genre} ${item.type}`.toLowerCase().includes(needle);
      return typeMatch && genreMatch && languageMatch && regionMatch && providerMatch && textMatch;
    }).sort((a, b) => sort === "Rating" ? Number(b.rating) - Number(a.rating) : sort === "Newest" ? Number(b.year) - Number(a.year) : (a.tag === "Auto update" ? -1 : 0) - (b.tag === "Auto update" ? -1 : 0));
  }, [catalogWithOverrides, genre, language, mode, provider, query, region, sort]);

  useEffect(() => {
    const onAdminUpdate = () => setAdminConfig(getAdminConfig());
    window.addEventListener("cinevault-admin-updated", onAdminUpdate);
    return () => window.removeEventListener("cinevault-admin-updated", onAdminUpdate);
  }, []);

  const toggleSaved = (title: string) => {
    setSaved((current) => {
      const exists = current.includes(title);
      toast.success(exists ? `${title} removed from watchlist` : `${title} added to watchlist`);
      return exists ? current.filter((entry) => entry !== title) : [...current, title];
    });
  };

  const clearFilters = () => { setMode("All"); setProvider("All providers"); setGenre("All genres"); setLanguage("All languages"); setRegion("All regions"); setSort("Popular"); setQuery(""); };

  const loadMoreTitles = async () => {
    if (catalogLoading) return;
    if (mode === "Movies") {
      setCatalogLoading(true);
      setCatalogError(false);
      try {
        const response = await fetch(`/api/movies?page=${moviePage}`);
        if (!response.ok) throw new Error("movie catalog unavailable");
        const payload = await response.json() as { titles?: Title[] };
        setAutomaticMovieTitles((current) => [...current, ...(payload.titles || [])].filter((item, index, list) => list.findIndex((candidate) => candidate.title === item.title) === index));
        setMoviePage((page) => page + 1);
        setVisibleLimit((current) => current + 24);
      } catch {
        setCatalogError(true);
      } finally {
        setCatalogLoading(false);
      }
      return;
    }
    setCatalogLoading(true);
    setCatalogError(false);
    try {
      const response = await fetch(`/api/catalog?page=${catalogPage}`);
      if (!response.ok) throw new Error("catalog unavailable");
      const payload = await response.json() as { titles?: Title[] };
      setAutomaticTitles((current) => [...current, ...(payload.titles || [])].filter((item, index, list) => list.findIndex((candidate) => candidate.title === item.title) === index));
      setCatalogPage((page) => Math.max(0, page - 1));
    } catch {
      setCatalogError(true);
    } finally {
      setCatalogLoading(false);
    }
  };

  return (
    <div className="guide-app">
      <header className="guide-header">
        <div className="guide-header-inner">
          <a className="guide-logo" href="#top" aria-label="CineVault Guide home"><span className="guide-logo-mark">CV</span><span>CineVault <b>GUIDE</b></span></a>
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileNav((value) => !value)}>{mobileNav ? <X size={21} /> : <Menu size={21} />}</button>
          <nav className={`guide-nav ${mobileNav ? "open" : ""}`}>
            <a className="active" href="#browse" onClick={() => setMobileNav(false)}>Browse</a>
            <a href="#movies" onClick={() => { setMode("Movies"); setMobileNav(false); }}>Movies</a>
            <a href="#tv" onClick={() => { setMode("TV Shows"); setMobileNav(false); }}>TV Shows</a>
            <a href="#watchlist" onClick={() => { toast(saved.length ? `${saved.length} title${saved.length > 1 ? "s" : ""} in your watchlist` : "Your watchlist is empty"); setMobileNav(false); }}>Watchlist {saved.length ? <small>{saved.length}</small> : null}</a>
          </nav>
          <div className="guide-account"><button aria-label="Notifications" onClick={() => toast("You are all caught up")}><Bell size={17} /></button><button className="account-button" onClick={() => toast("Sign in is coming soon")}><UserRound size={16} /> Sign in</button></div>
        </div>
      </header>

      <main id="top">
        <section className="guide-intro">
          <div className="intro-inner">
            <div className="intro-copy"><p className="guide-overline">YOUR STREAMING GUIDE</p><h1>What do you want<br />to watch <em>tonight?</em></h1><p className="intro-subtitle">Find where to stream movies, TV shows, and more — all in one place.</p></div>
            <div className="intro-orbit"><Film size={29} /><span>One search.<br /><b>Every story.</b></span></div>
          </div>
        </section>

        <section className="search-panel" id="browse">
          <div className="search-panel-inner">
            <div className="main-search"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for movies, TV shows, people..." aria-label="Search for movies, TV shows, or people" />{query ? <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button> : null}</div>
            <button className="search-button" onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}>Search</button>
          </div>
          <div className="quick-links"><span>Popular searches</span><button onClick={() => setQuery("Dune")}>Dune</button><button onClick={() => setQuery("The Last Frame")}>The Last Frame</button><button onClick={() => setQuery("Drama")}>Drama</button></div>
        </section>

        <section className="provider-strip"><div className="content-width provider-strip-inner"><div><p className="strip-label">STREAMING SERVICES</p><h2>Everything you watch,<br /><em>in one place.</em></h2></div><div className="service-logos"><span className="service-logo cv">CV</span><span className="service-logo nf">N</span><span className="service-logo pm">▶</span><span className="service-logo ap">tv+</span><span className="service-logo di">D</span><span className="service-logo more">+12</span></div><button className="manage-services" onClick={() => toast("Service preferences are coming soon")}>Manage services <ChevronRight size={15} /></button></div></section>

        <section className="region-strip"><div className="content-width"><div className="region-strip-heading"><div><p className="strip-label">WORLD CINEMA</p><h2>Browse by <em>region.</em></h2></div><p>From Bollywood to Hollywood,<br />discover stories from everywhere.</p></div><div className="region-pills">{regions.map((entry) => <button key={entry} className={region === entry ? "active" : ""} onClick={() => { setRegion(entry); document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{entry === "All regions" ? "All movies" : entry}<span>{entry === "All regions" ? catalogWithOverrides.length : catalogWithOverrides.filter((item) => item.region === entry).length}</span></button>)}</div></div></section>

        <section className="results-section content-width" id="results">
          <div className="results-heading"><div><p className="strip-label">DISCOVER SOMETHING NEW</p><h2>Popular right now</h2></div><div className="view-toggle"><button className={mode === "All" ? "active" : ""} onClick={() => setMode("All")}>All</button><button className={mode === "Movies" ? "active" : ""} onClick={() => setMode("Movies")}>Movies</button><button className={mode === "TV Shows" ? "active" : ""} onClick={() => setMode("TV Shows")}>TV shows</button></div></div>
          {mode === "Movies" ? <div className="language-switch"><span>Movie language</span>{languages.map((entry) => <button key={entry} className={language === entry ? "active" : ""} onClick={() => setLanguage(entry)}>{entry === "All languages" ? "All" : entry}</button>)}</div> : null}
          <div className="filter-bar"><button className="filter-button" onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal size={15} /> Filters <span>{[provider !== "All providers", genre !== "All genres", language !== "All languages", region !== "All regions"].filter(Boolean).length || ""}</span></button><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Popular</option><option>Rating</option><option>Newest</option></select><ChevronDown size={14} /></label></div>
          {showFilters ? <div className="filter-drawer"><label>Service<select value={provider} onChange={(event) => setProvider(event.target.value)}>{providers.map((entry) => <option key={entry}>{entry}</option>)}</select></label><label>Genre<select value={genre} onChange={(event) => setGenre(event.target.value)}>{genres.map((entry) => <option key={entry}>{entry}</option>)}</select></label><label>Language<select value={language} onChange={(event) => setLanguage(event.target.value as (typeof languages)[number])}>{languages.map((entry) => <option key={entry}>{entry}</option>)}</select></label><label>Region<select value={region} onChange={(event) => setRegion(event.target.value as (typeof regions)[number])}>{regions.map((entry) => <option key={entry}>{entry}</option>)}</select></label><button onClick={clearFilters}>Clear all</button></div> : null}
          <div className="active-filters"><button className={mode === "All" ? "active" : ""} onClick={() => setMode("All")}>All titles</button>{mode !== "All" ? <button className="active" onClick={() => setMode("All")}>{mode} <X size={12} /></button> : null}{language !== "All languages" ? <button className="active" onClick={() => setLanguage("All languages")}>{language} <X size={12} /></button> : null}{region !== "All regions" ? <button className="active" onClick={() => setRegion("All regions")}>{region} <X size={12} /></button> : null}{provider !== "All providers" ? <button className="active" onClick={() => setProvider("All providers")}>{provider} <X size={12} /></button> : null}{genre !== "All genres" ? <button className="active" onClick={() => setGenre("All genres")}>{genre} <X size={12} /></button> : null}</div>
          <div className="guide-grid" id="movies">{filteredTitles.length ? filteredTitles.slice(0, visibleLimit).map((item) => <TitleCard key={item.title} item={item} saved={saved.includes(item.title)} onSave={() => toggleSaved(item.title)} onPlay={() => setPlayback({ title: item, stage: "ad", seconds: 5, adOpened: false })} />) : <div className="no-results"><Search size={27} /><h3>Nothing matched your search</h3><p>Try a different title, service, or genre.</p><button onClick={clearFilters}>Clear filters</button></div>}</div>
          <div className="load-more"><button onClick={loadMoreTitles} disabled={catalogLoading}>{catalogLoading ? "Updating catalog..." : mode === "Movies" ? "Show more movies" : "Show more titles"} <ChevronDown size={16} /></button>{catalogError ? <p className="catalog-sync-error">Live update is temporarily unavailable. Try again.</p> : <p className="catalog-sync-note">{mode === "Movies" ? "More movies will keep loading in batches." : "New titles sync automatically and appear first."}</p>}</div>
        </section>

        <section className="guide-callout content-width" id="tv"><div className="callout-copy"><p className="strip-label">THE CINEVAULT EDIT</p><h2>Never miss a<br /><em>good story.</em></h2><p>Personalized picks from across your services, with no more tab-hopping. Make one list, then press play.</p><button onClick={() => document.getElementById("watchlist")?.scrollIntoView({ behavior: "smooth" })}>Build your watchlist <ChevronRight size={15} /></button></div><div className="callout-art"><Tv size={72} strokeWidth={1} /><span>Stories<br /><b>worth finding.</b></span></div></section>

        <section className="watchlist-band" id="watchlist"><div className="content-width watchlist-inner"><div><p className="strip-label">YOUR WATCHLIST</p><h2>All the good stuff,<br /><em>kept close.</em></h2></div><div className="watchlist-count"><strong>{String(saved.length).padStart(2, "0")}</strong><span>titles<br />saved</span></div><button onClick={() => toast(saved.length ? `${saved.length} saved titles ready` : "Add a title to get started")}>Open watchlist <Bookmark size={15} /></button></div></section>
      </main>
      <footer className="guide-footer content-width"><a className="guide-logo" href="#top"><span className="guide-logo-mark">CV</span><span>CineVault <b>GUIDE</b></span></a><p>Where every story finds its audience.</p><div><a href="#browse">Browse</a><a href="#movies">Movies</a><a href="#watchlist">Watchlist</a></div></footer>
      {playback ? <div className="playback-backdrop" role="dialog" aria-modal="true" aria-label={`Watch ${playback.title.title}`}><div className={`playback-modal ${playback.stage === "ready" ? "player-modal" : ""}`}><button className="playback-close" aria-label="Close player" onClick={() => setPlayback(null)}><X size={18} /></button>{playback.stage === "ad" ? <><div className="playback-icon"><Play size={23} fill="currentColor" /></div><p className="strip-label">BEFORE YOU WATCH</p><h2>Support the story<br /><em>with a quick visit.</em></h2><p className="playback-copy">You’ll visit the sponsor page first. After the short countdown, your movie will play here on the website.</p><button className="playback-primary" onClick={() => { window.open(adminConfig.adLink || AD_LINK, "_blank", "noopener,noreferrer"); setPlayback((current) => current ? { ...current, adOpened: true } : null); toast("Sponsor page opened in a new tab"); }}>{playback.adOpened ? "Sponsor opened" : "View sponsor & continue"} <ChevronRight size={15} /></button><p className="playback-countdown">{!playback.adOpened ? "Open the sponsor page to unlock the movie" : playback.seconds > 0 ? `Movie starts here in ${playback.seconds}s` : "Starting movie..."}</p></> : <><p className="strip-label">NOW PLAYING</p><h2 className="player-title">{playback.title.title}</h2>{getYoutubeEmbedUrl(playback.title.title, adminConfig) ? <iframe className="youtube-player" src={getYoutubeEmbedUrl(playback.title.title, adminConfig) || undefined} title={`Watch ${playback.title.title}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <><p className="playback-copy">This title does not have a direct YouTube video ID yet. Add its full YouTube watch URL from Admin Panel to play it inside CineVault.</p><button className="playback-primary" onClick={() => { window.open(getYoutubeLink(playback.title.title, adminConfig), "_blank", "noopener,noreferrer"); setPlayback(null); }}>Find on YouTube <ChevronRight size={15} /></button></>}</>}</div></div> : null}
    </div>
  );
}
