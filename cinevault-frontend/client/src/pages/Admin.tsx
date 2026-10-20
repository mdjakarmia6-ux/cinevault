import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Check, ExternalLink, ImagePlus, Link2, LockKeyhole, LogOut, Save, ShieldCheck, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminConfig, getAdminConfig, saveAdminConfig } from "../videoLinks";

const movieTitles = [
  "Nocturne Protocol", "The Last Frame", "Velvet Horizon", "Static Bloom", "Afterlight", "Neon Saints",
  "Low Tide", "The Sound Between", "Monsoon Letters", "Golden State", "Northbound", "Midnight Atlas",
];

const fallbackImages: Record<string, string> = {
  "Nocturne Protocol": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=88",
  "The Last Frame": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=88",
  "Velvet Horizon": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=88",
  "Static Bloom": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=88",
  "Afterlight": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88",
  "Neon Saints": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=88",
  "Low Tide": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88&sat=-20",
  "The Sound Between": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=88",
  "Monsoon Letters": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=88",
  "Golden State": "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=88",
  "Northbound": "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=800&q=88",
  "Midnight Atlas": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=88&hue=30",
};

type AuthState = "loading" | "logged-out" | "authenticated";

export default function Admin() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [config, setConfig] = useState<AdminConfig>(() => getAdminConfig());
  const [selectedMovie, setSelectedMovie] = useState(movieTitles[0]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((response) => response.json())
      .then((result: { authenticated?: boolean }) => setAuthState(result.authenticated ? "authenticated" : "logged-out"))
      .catch(() => setAuthState("logged-out"));
  }, []);

  if (authState === "loading") return <AdminShell><div className="admin-loading"><LockKeyhole size={20} /> Checking secure admin session...</div></AdminShell>;
  if (authState === "logged-out") return <AdminLogin onSuccess={() => setAuthState("authenticated")} />;

  const currentMovie = config.movies[selectedMovie] || {};
  const currentThumbnail = currentMovie.thumbnail || fallbackImages[selectedMovie];

  const updateMovie = (field: "youtubeUrl" | "thumbnail", value: string) => {
    setConfig((current) => ({ ...current, movies: { ...current.movies, [selectedMovie]: { ...current.movies[selectedMovie], [field]: value } } }));
    setSaved(false);
  };

  const handleUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    if (file.size > 4 * 1024 * 1024) { toast.error("Please choose an image smaller than 4MB"); return; }
    const reader = new FileReader();
    reader.onload = () => updateMovie("thumbnail", String(reader.result));
    reader.readAsDataURL(file);
  };

  const save = () => {
    saveAdminConfig(config);
    setSaved(true);
    toast.success("Admin settings saved — homepage updated");
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAuthState("logged-out");
  };

  return (
    <AdminShell>
      <header className="admin-header"><a className="guide-logo" href="/"><span className="guide-logo-mark">CV</span><span>CineVault <b>GUIDE</b></span></a><div className="admin-header-right"><span><ShieldCheck size={15} /> Protected workspace</span><button className="admin-logout" onClick={logout}><LogOut size={14} /> Log out</button><a href="/"><ArrowLeft size={15} /> Back to homepage</a></div></header>
      <main className="admin-main">
        <div className="admin-title"><div><p className="strip-label">SECURE CONTENT CONTROL</p><h1>Manage your<br /><em>movie guide.</em></h1><p>Update sponsor routing, YouTube links and movie artwork. Changes are saved in this browser and reflected on the homepage.</p></div><div className="admin-status"><Check size={17} /> Authenticated</div></div>
        <section className="admin-card global-settings"><div className="admin-card-heading"><div className="admin-icon"><Link2 size={18} /></div><div><h2>Playback settings</h2><p>This sponsor link opens before every YouTube movie.</p></div></div><label>Ad / sponsor URL<input value={config.adLink} onChange={(event) => { setConfig((current) => ({ ...current, adLink: event.target.value })); setSaved(false); }} placeholder="https://your-ad-network.com/campaign" /></label><p className="admin-help">The visitor must click the sponsor button before the movie link unlocks.</p></section>
        <section className="admin-card movie-editor"><div className="admin-card-heading"><div className="admin-icon"><FilmIcon /></div><div><h2>Movie links & thumbnails</h2><p>Select a title, paste its direct YouTube URL and add a poster thumbnail.</p></div></div><div className="movie-admin-layout"><div className="movie-selector"><label>Choose movie<select value={selectedMovie} onChange={(event) => setSelectedMovie(event.target.value)}>{movieTitles.map((title) => <option key={title}>{title}</option>)}</select></label><div className="admin-movie-list">{movieTitles.map((title) => <button key={title} className={title === selectedMovie ? "active" : ""} onClick={() => setSelectedMovie(title)}>{title}<span>{config.movies[title]?.youtubeUrl ? <Check size={13} /> : <span className="empty-dot" />}</span></button>)}</div></div><div className="movie-fields"><div className="thumbnail-preview"><img src={currentThumbnail} alt={`${selectedMovie} thumbnail preview`} /><div><span>Current thumbnail</span><strong>{config.movies[selectedMovie]?.thumbnail ? "Custom image" : "Catalog image"}</strong></div></div><label>Direct YouTube movie URL<input value={currentMovie.youtubeUrl || ""} onChange={(event) => updateMovie("youtubeUrl", event.target.value)} placeholder="https://www.youtube.com/watch?v=..." /><small><ExternalLink size={12} /> Paste the full watch URL, not a search page.</small></label><label>Thumbnail image URL<input value={currentMovie.thumbnail || ""} onChange={(event) => updateMovie("thumbnail", event.target.value)} placeholder="https://cdn.example.com/poster.jpg" /></label><div className="upload-row"><label className="upload-button"><Upload size={15} /> Upload local image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleUpload(event.target.files?.[0])} /></label><button className="remove-image" onClick={() => updateMovie("thumbnail", "")}><X size={14} /> Use catalog image</button></div></div></div></section>
        <div className="admin-actions"><a href="/"><ArrowLeft size={15} /> Cancel</a><button className="admin-save" onClick={save}><Save size={16} /> {saved ? "Saved" : "Save changes"}</button></div>
      </main>
    </AdminShell>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Login failed");
      onSuccess();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return <AdminShell><main className="admin-login-page"><div className="admin-login-card"><div className="admin-login-icon"><LockKeyhole size={22} /></div><p className="strip-label">PRIVATE WORKSPACE</p><h1>Admin <em>sign in.</em></h1><p>Enter your CineVault admin credentials to manage movie links and thumbnails.</p><form onSubmit={login}><label>Username<input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error ? <div className="admin-login-error">{error}</div> : null}<button className="admin-save admin-login-button" disabled={busy}>{busy ? "Checking..." : "Unlock admin panel"} <LockKeyhole size={15} /></button></form><a className="admin-back-home" href="/"><ArrowLeft size={14} /> Back to homepage</a></div></main></AdminShell>;
}

function AdminShell({ children }: { children: ReactNode }) { return <div className="admin-app">{children}</div>; }
function FilmIcon() { return <ImagePlus size={18} />; }
