import { useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  Search,
  Upload,
  Download,
  FileText,
  Clock,
  GraduationCap,
  Bell,
  Menu,
  X,
  ChevronRight,
  BookMarked,
  Settings,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import "./App.css";
import "./Pages.css";

/* ---------- Static data ---------- */

const subjects = [
  { name: "Data Structures", code: "CS301", color: "blue" },
  { name: "Database Management", code: "CS302", color: "purple" },
  { name: "Artificial Intelligence", code: "CS303", color: "orange" },
  { name: "Operating Systems", code: "CS304", color: "green" },
];

const materialTypes = ["PDF Document", "Question Bank", "Lecture Notes", "Presentation"];

const initialMaterials = [
  { id: 1, title: "Data Structures — Unit 3 Notes", subject: "Data Structures", type: "PDF Document", size: "2.4 MB", date: "Recently added", saved: false, downloaded: true, uploaded: false },
  { id: 2, title: "DBMS Important Questions", subject: "Database Management", type: "Question Bank", size: "1.8 MB", date: "Recently added", saved: true, downloaded: true, uploaded: false },
  { id: 3, title: "Artificial Intelligence — Unit 2", subject: "Artificial Intelligence", type: "PDF Document", size: "3.1 MB", date: "Recently added", saved: false, downloaded: false, uploaded: false },
  { id: 4, title: "Operating Systems — Process Scheduling", subject: "Operating Systems", type: "Lecture Notes", size: "1.2 MB", date: "Last week", saved: false, downloaded: false, uploaded: false },
  { id: 5, title: "Data Structures — Trees and Graphs", subject: "Data Structures", type: "Presentation", size: "4.6 MB", date: "Last week", saved: true, downloaded: false, uploaded: false },
  { id: 6, title: "DBMS — Normalization Cheat Sheet", subject: "Database Management", type: "PDF Document", size: "0.9 MB", date: "2 weeks ago", saved: false, downloaded: true, uploaded: false },
  { id: 7, title: "AI — Search Algorithms Question Bank", subject: "Artificial Intelligence", type: "Question Bank", size: "1.5 MB", date: "2 weeks ago", saved: false, downloaded: false, uploaded: false },
  { id: 8, title: "Operating Systems — Deadlocks", subject: "Operating Systems", type: "Lecture Notes", size: "2.0 MB", date: "3 weeks ago", saved: false, downloaded: false, uploaded: false },
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Study Materials", icon: BookOpen },
  { label: "Upload Materials", icon: Upload },
  { label: "My Downloads", icon: Download },
];

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ---------- Small reusable pieces ---------- */

function MaterialRow({ material, index, onDownload, onToggleSave }) {
  return (
    <div className="material-row">
      <div className={`file-icon file-${(index % 3) + 1}`}>
        <FileText size={23} />
      </div>

      <div className="material-details">
        <h3>{material.title}</h3>
        <p>
          {material.subject} <span>•</span> {material.type}
        </p>
      </div>

      <div className="material-meta">
        <span>{material.size}</span>
        <span>{material.date}</span>
      </div>

      <div className="row-actions">
        <button
          className={`download-button ${material.saved ? "is-saved" : ""}`}
          aria-label={material.saved ? `Remove ${material.title} from saved` : `Save ${material.title}`}
          title={material.saved ? "Remove from saved" : "Save for later"}
          onClick={() => onToggleSave(material.id)}
        >
          <BookMarked size={19} fill={material.saved ? "currentColor" : "none"} />
        </button>
        <button
          className="download-button"
          aria-label={`Download ${material.title}`}
          title="Download"
          onClick={() => onDownload(material.id)}
        >
          <Download size={19} />
        </button>
      </div>
    </div>
  );
}

function PageHeader({ title, description, action }) {
  return (
    <div className="section-heading page-heading">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function MaterialList({ items, emptyText, onDownload, onToggleSave }) {
  if (items.length === 0) {
    return <div className="empty-state">{emptyText}</div>;
  }
  return (
    <div className="materials-list">
      {items.map((material, index) => (
        <MaterialRow
          key={material.id}
          material={material}
          index={index}
          onDownload={onDownload}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}

/* ---------- App ---------- */

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [materials, setMaterials] = useState(initialMaterials);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [userName, setUserName] = useState("Student");

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    subject: subjects[0].name,
    type: materialTypes[0],
    file: null,
  });
  const [uploadMessage, setUploadMessage] = useState("");

  // Settings form state
  const [nameDraft, setNameDraft] = useState("Student");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [settingsMessage, setSettingsMessage] = useState("");

  const goTo = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const query = search.trim().toLowerCase();

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(query)
  );

  const searchedMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(query) ||
      m.subject.toLowerCase().includes(query)
  );

  const libraryMaterials = searchedMaterials.filter(
    (m) => subjectFilter === "All" || m.subject === subjectFilter
  );

  const downloadedMaterials = materials.filter((m) => m.downloaded);
  const savedMaterials = materials.filter((m) => m.saved);
  const uploadedCount = materials.filter((m) => m.uploaded).length;

  const handleDownload = (id) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloaded: true } : m))
    );
    window.alert(
      "Added to My Downloads. Real file downloads will work once file storage is connected to the backend."
    );
  };

  const handleToggleSave = (id) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, saved: !m.saved } : m))
    );
  };

  const handleUpload = (event) => {
    event.preventDefault();
    if (!uploadForm.title.trim()) {
      setUploadMessage("error:Add a title for your material.");
      return;
    }
    if (!uploadForm.file) {
      setUploadMessage("error:Choose a file to upload.");
      return;
    }
    const newMaterial = {
      id: Date.now(),
      title: uploadForm.title.trim(),
      subject: uploadForm.subject,
      type: uploadForm.type,
      size: formatSize(uploadForm.file.size),
      date: "Just now",
      saved: false,
      downloaded: false,
      uploaded: true,
    };
    setMaterials((prev) => [newMaterial, ...prev]);
    setUploadForm({ title: "", subject: subjects[0].name, type: materialTypes[0], file: null });
    event.target.reset();
    setUploadMessage("success:Uploaded. Your material now appears in Study Materials.");
  };

  const handleSaveSettings = (event) => {
    event.preventDefault();
    setUserName(nameDraft.trim() || "Student");
    setSettingsMessage("Settings saved.");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    goTo("Dashboard");
  };

  const openSubject = (name) => {
    setSubjectFilter(name);
    goTo("Study Materials");
  };

  /* ----- Login page (no sidebar) ----- */
  if (activePage === "Login") {
    return (
      <div className="login-wrap">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>
          <h2>Welcome to StudySpace</h2>
          <p>Log in to open your study materials.</p>
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="you@college.edu" />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Your password" />
          </label>
          <button type="submit" className="primary-button login-submit">
            Log in
          </button>
        </form>
      </div>
    );
  }

  /* ----- Page content switcher ----- */
  let pageContent;

  if (activePage === "Dashboard") {
    pageContent = (
      <>
        <section className="welcome-section">
          <div>
            <div className="eyebrow">
              <span className="status-dot" />
              YOUR LEARNING SPACE
            </div>
            <h1>
              Welcome back, <span>{userName}!</span> 👋
            </h1>
            <p>
              Your next breakthrough is one study session away.
              What would you like to explore today?
            </p>
          </div>

          <button className="primary-button" onClick={() => goTo("Upload Materials")}>
            <Upload size={18} />
            Upload material
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue-bg"><BookOpen size={22} /></div>
            <span className="stat-label">Available materials</span>
            <strong>{materials.length}</strong>
            <span className="stat-caption">Across all subjects</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple-bg"><Download size={22} /></div>
            <span className="stat-label">My downloads</span>
            <strong>{downloadedMaterials.length}</strong>
            <span className="stat-caption">Your study collection</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange-bg"><Upload size={22} /></div>
            <span className="stat-label">My uploads</span>
            <strong>{uploadedCount}</strong>
            <span className="stat-caption">Materials you've shared</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green-bg"><Clock size={22} /></div>
            <span className="stat-label">Saved for later</span>
            <strong>{savedMaterials.length}</strong>
            <span className="stat-caption">In your library</span>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <h2>Explore your subjects</h2>
              <p>Find notes and resources organized for your learning.</p>
            </div>
            <button className="text-button" onClick={() => openSubject("All")}>
              View all <ChevronRight size={17} />
            </button>
          </div>

          <div className="subjects-grid">
            {filteredSubjects.map((subject) => (
              <button
                className="subject-card"
                key={subject.code}
                onClick={() => openSubject(subject.name)}
              >
                <div className={`subject-icon ${subject.color}`}>
                  <BookOpen size={22} />
                </div>
                <span className="subject-code">{subject.code}</span>
                <h3>{subject.name}</h3>
                <div className="subject-footer">
                  <span>
                    {materials.filter((m) => m.subject === subject.name).length} resources
                  </span>
                  <ChevronRight size={17} />
                </div>
              </button>
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="empty-state">
              No subjects match "{search}". Try another search.
            </div>
          )}
        </section>

        <section className="section-block materials-section">
          <div className="section-heading">
            <div>
              <h2>Recently added materials</h2>
              <p>Pick up where you left off or discover something new.</p>
            </div>
            <button className="text-button" onClick={() => openSubject("All")}>
              Browse library <ChevronRight size={17} />
            </button>
          </div>

          <MaterialList
            items={materials.slice(0, 3)}
            emptyText="No materials yet."
            onDownload={handleDownload}
            onToggleSave={handleToggleSave}
          />
        </section>
      </>
    );
  } else if (activePage === "Study Materials") {
    pageContent = (
      <section className="section-block">
        <PageHeader
          title="Study Materials"
          description="Browse notes, question banks and slides from every subject."
          action={
            <button className="primary-button" onClick={() => goTo("Upload Materials")}>
              <Upload size={18} />
              Upload material
            </button>
          }
        />

        <div className="filter-chips">
          {["All", ...subjects.map((s) => s.name)].map((name) => (
            <button
              key={name}
              className={`chip ${subjectFilter === name ? "chip-active" : ""}`}
              onClick={() => setSubjectFilter(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <MaterialList
          items={libraryMaterials}
          emptyText={
            query
              ? `No materials match "${search}". Try another search.`
              : "No materials in this subject yet. Upload the first one."
          }
          onDownload={handleDownload}
          onToggleSave={handleToggleSave}
        />
      </section>
    );
  } else if (activePage === "Upload Materials") {
    const [kind, text] = uploadMessage.split(/:(.*)/s);
    pageContent = (
      <section className="section-block">
        <PageHeader
          title="Upload Materials"
          description="Share notes or question banks with other students."
        />

        <form className="form-card" onSubmit={handleUpload}>
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              placeholder="e.g. Operating Systems — Unit 4 Notes"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Subject</span>
              <select
                value={uploadForm.subject}
                onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
              >
                {subjects.map((s) => (
                  <option key={s.code} value={s.name}>{s.name}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Type</span>
              <select
                value={uploadForm.type}
                onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
              >
                {materialTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>File</span>
            <input
              type="file"
              onChange={(e) =>
                setUploadForm({ ...uploadForm, file: e.target.files[0] || null })
              }
            />
          </label>

          {uploadMessage && (
            <div className={`form-message ${kind === "error" ? "form-error" : "form-success"}`}>
              {kind === "success" && <CheckCircle2 size={17} />}
              {text}
            </div>
          )}

          <button type="submit" className="primary-button">
            <Upload size={18} />
            Upload material
          </button>
          <p className="form-note">
            Uploads are kept in this session only until the backend is connected.
          </p>
        </form>
      </section>
    );
  } else if (activePage === "My Downloads") {
    pageContent = (
      <section className="section-block">
        <PageHeader
          title="My Downloads"
          description="Everything you've downloaded, in one place."
        />
        <MaterialList
          items={downloadedMaterials.filter((m) => m.title.toLowerCase().includes(query))}
          emptyText="Nothing downloaded yet. Open Study Materials and download a file."
          onDownload={handleDownload}
          onToggleSave={handleToggleSave}
        />
      </section>
    );
  } else if (activePage === "Saved Materials") {
    pageContent = (
      <section className="section-block">
        <PageHeader
          title="Saved Materials"
          description="Materials you've bookmarked to come back to."
        />
        <MaterialList
          items={savedMaterials.filter((m) => m.title.toLowerCase().includes(query))}
          emptyText="No saved materials yet. Tap the bookmark on any material to save it."
          onDownload={handleDownload}
          onToggleSave={handleToggleSave}
        />
      </section>
    );
  } else if (activePage === "Settings") {
    pageContent = (
      <section className="section-block">
        <PageHeader title="Settings" description="Manage your profile and notifications." />

        <form className="form-card" onSubmit={handleSaveSettings}>
          <label className="field">
            <span>Display name</span>
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => {
                setNameDraft(e.target.value);
                setSettingsMessage("");
              }}
            />
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
            <span>Email me when new materials are added to my subjects</span>
          </label>

          {settingsMessage && (
            <div className="form-message form-success">
              <CheckCircle2 size={17} />
              {settingsMessage}
            </div>
          )}

          <button type="submit" className="primary-button">Save changes</button>
        </form>
      </section>
    );
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>
          <div>
            <h2>StudySpace</h2>
            <p>LEARN WITHOUT LIMITS</p>
          </div>
          <button
            className="close-sidebar"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => {
                if (label === "Study Materials") setSubjectFilter("All");
                goTo(label);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {activePage === label && <span className="active-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-label library-label">YOUR LIBRARY</div>

        <button
          className={`nav-item ${activePage === "Saved Materials" ? "active" : ""}`}
          onClick={() => goTo("Saved Materials")}
        >
          <BookMarked size={19} />
          <span>Saved Materials</span>
          {activePage === "Saved Materials" && <span className="active-indicator" />}
        </button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <BookOpen size={20} />
            </div>
            <h3>Keep learning!</h3>
            <p>Your next big idea starts with one page.</p>
          </div>

          <button
            className={`nav-item ${activePage === "Settings" ? "active" : ""}`}
            onClick={() => goTo("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button className="nav-item" onClick={() => goTo("Login")}>
            <LogOut size={19} />
            <span>Log out</span>
          </button>

          <div className="profile">
            <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <strong>{userName}</strong>
              <span>CSE Student</span>
            </div>
            <ChevronRight size={17} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-button"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={23} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={15} />
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search subjects..."
                aria-label="Search subjects"
              />
              <kbd>⌘ K</kbd>
            </div>

            <button
              className="notification-button"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={20} />
              <span />
            </button>

            <div className="top-avatar">{userName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="page-content">
          {pageContent}

          <footer className="footer">
            <span>StudySpace © 2026</span>
            <span>Built for curious minds. ✨</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
