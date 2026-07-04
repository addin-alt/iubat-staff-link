import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { departments, iubatStaffData } from "./data/iubatStaffData";
import { staffPhotoMap } from "./data/staffPhotoMap";

const actionText = {
  email: "Email copied",
  phone: "Phone copied",
  details: "Details opened",
};

function normalize(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function searchableText(person) {
  return normalize([
    person.name,
    person.qualification,
    person.designation,
    person.department,
    person.departmentText,
    person.additionalResponsibility,
    person.room,
    person.extension,
    person.cell,
    person.email,
    person.presentAddress,
    person.permanentAddress,
    person.rawDetails,
  ].join(" "));
}

function App() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState("");
  const [notices, setNotices] = useState([]);
  const [noticeLoading, setNoticeLoading] = useState(true);

  const stats = useMemo(() => {
    const emailCount = iubatStaffData.filter((item) => item.email).length;
    const phoneCount = iubatStaffData.filter((item) => item.cell).length;
    return {
      total: iubatStaffData.length,
      departments: departments.length,
      emails: emailCount,
      phones: phoneCount,
    };
  }, []);

  const filteredStaff = useMemo(() => {
    const q = normalize(query);

    return iubatStaffData
      .filter((person) => {
        const departmentMatch =
          department === "All Departments" || person.department === department;
        if (!departmentMatch) return false;
        if (!q) return true;
        return searchableText(person).includes(q);
      })
      .sort((a, b) => {
        const q = normalize(query);
        if (!q) return a.name.localeCompare(b.name);

        const aName = normalize(a.name);
        const bName = normalize(b.name);
        const aStarts = aName.startsWith(q) ? 0 : 1;
        const bStarts = bName.startsWith(q) ? 0 : 1;

        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.name.localeCompare(b.name);
      });
  }, [query, department]);

  async function copyValue(value, type) {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setToast(actionText[type] || "Copied");
      setTimeout(() => setToast(""), 1800);
    } catch {
      setToast("Copy failed. Please copy manually.");
      setTimeout(() => setToast(""), 2200);
    }
  }

  function resetFilters() {
    setQuery("");
    setDepartment("All Departments");
  }

  useEffect(() => {
    let mounted = true;

    async function loadNotices() {
      try {
        const response = await fetch("/api/iubat-notices");
        const result = await response.json();

        if (mounted) {
          setNotices(Array.isArray(result.notices) ? result.notices : []);
        }
      } catch {
        if (mounted) {
          setNotices([]);
        }
      } finally {
        if (mounted) {
          setNoticeLoading(false);
        }
      }
    }

    loadNotices();

    const interval = setInterval(loadNotices, 10 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="page-shell">
      {toast && <div className="toast">{toast}</div>}

      <section className="hero-section">
        <div className="brand-row">
          <div className="brand-logo-box"><img className="brand-logo" src="/iubat-logo.jpg?v=5" alt="IUBAT logo" /></div>
          <div>
            <p>International University of Business Agriculture and Technology</p>
            <h1>IUBAT Staff Link</h1>
          </div>
        </div>

        <p className="hero-text">
          Search faculty members, officers, departments, rooms, extensions, emails,
          phone numbers, responsibilities, and complete roster details in one fast directory.
        </p>

        <div className="stat-grid">
          <StatCard label="Total Records" value={stats.total} />
          <StatCard label="Departments / Sections" value={stats.departments} />
          <StatCard label="Available Emails" value={stats.emails} />
          <StatCard label="Available Phones" value={stats.phones} />
        </div>
      </section>

      <NoticeTicker notices={notices} loading={noticeLoading} />

      <section className="search-panel">
        <div className="search-group">
          <label>Search employee</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, department, email, phone, room, designation..."
          />
        </div>

        <div className="filter-group">
          <label>Department / Section</label>
          <select value={department} onChange={(event) => setDepartment(event.target.value)}>
            <option>All Departments</option>
            {departments.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <button className="reset-btn" onClick={resetFilters}>Reset</button>
      </section>

      <section className="result-header">
        <div>
          <h2>Employee Directory</h2>
          <p>
            Showing <strong>{filteredStaff.length}</strong> of <strong>{iubatStaffData.length}</strong> records
          </p>
        </div>
        <span className="source-badge">Data from IUBAT Personnel Roster PDF</span>
      </section>

      <section className="staff-grid">
        {filteredStaff.length === 0 ? (
          <div className="empty-card">
            <h3>No matching employee found</h3>
            <p>Try a different name, department, phone number, email, or room number.</p>
          </div>
        ) : (
          filteredStaff.map((person) => (
            <StaffCard
              key={person.id}
              person={person}
              isExpanded={expandedId === person.id}
              onToggle={() => setExpandedId(expandedId === person.id ? null : person.id)}
              onCopy={copyValue}
            />
          ))
        )}
      </section>
    </main>
  );
}

function NoticeTicker({ notices, loading }) {
  const fallbackNotices = [
    {
      id: "fallback-1",
      title: "Minimum attendance for the Midterm and Final exam",
      date: "Latest Notice",
      link: "https://iubat.edu/category/notice/",
      excerpt: "Open the official IUBAT notice page for the latest published notices.",
    },
    {
      id: "fallback-2",
      title: "Scholarships for Summer 2026",
      date: "Official Notice",
      link: "https://iubat.edu/category/notice/",
      excerpt: "IUBAT notices will load automatically after Vercel deployment.",
    },
    {
      id: "fallback-3",
      title: "Improvement Exam seat plan",
      date: "Official Notice",
      link: "https://iubat.edu/category/notice/",
      excerpt: "The notice feed is connected through a Vercel serverless function.",
    },
  ];

  const list = notices.length ? notices : fallbackNotices;
  const tickerItems = [...list, ...list];
  const duration = `${Math.max(45, list.length * 4)}s`;

  return (
    <section className="notice-board">
      <div className="notice-head">
        <div>
          <span className="notice-kicker">Official Notice Feed</span>
          <h2>IUBAT Notices</h2>
        </div>

        <a
          className="notice-source-link"
          href="https://iubat.edu/category/notice/"
          target="_blank"
          rel="noreferrer"
        >
          View Official Notice Page
        </a>
      </div>

      <div className="ticker-window">
        <div className="ticker-track" style={{ "--ticker-duration": duration }}>
          {tickerItems.map((notice, index) => (
            <a
              href={notice.link}
              target="_blank"
              rel="noreferrer"
              className="ticker-item"
              key={`${notice.id}-${index}`}
            >
              <span>{notice.date || "Notice"}</span>
              {notice.title}
            </a>
          ))}
        </div>
      </div>

      <div className="notice-pop-grid">
        {loading ? (
          <div className="notice-pop-card">
            <strong>Loading official notices...</strong>
            <p>Please wait while IUBAT Staff Link connects to the official notice feed.</p>
          </div>
        ) : (
          list.slice(0, 3).map((notice, index) => (
            <a
              href={notice.link}
              target="_blank"
              rel="noreferrer"
              className="notice-pop-card"
              key={notice.id || index}
            >
              <small>{notice.date || "Official Notice"}</small>
              <strong>{notice.title}</strong>
              <p>{notice.excerpt || "Read the full notice on the official IUBAT website."}</p>
            </a>
          ))
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function StaffCard({ person, isExpanded, onToggle, onCopy }) {
  const email = person.email?.split(/[ ,]+/).find((item) => item.includes("@")) || person.email;
  const phone = person.cell?.split(/[,/]+/).map((item) => item.trim()).filter(Boolean)[0] || person.cell;
  const photo = staffPhotoMap[person.id];
  const initials = person.name?.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "I";

  return (
    <article className="staff-card">
      <div className="staff-profile-row">
        <div className="staff-photo-wrap">
          {photo ? (
            <img className="staff-photo" src={photo} alt={person.name} loading="lazy" />
          ) : (
            <div className="staff-photo-fallback">{initials}</div>
          )}
        </div>

        <div className="staff-title-block">
          <h3>{person.name}</h3>
          <p className="designation">{person.designation || "Designation not listed"}</p>
        </div>
      </div>

      <div className="card-topline">
        <span className="dept-pill">{person.department}</span>
        <span className="page-pill">Page {person.sourcePage}</span>
      </div>

      {person.qualification && <p className="qualification">{person.qualification}</p>}

      <div className="info-list">
        <Info label="Room" value={person.room || "Not listed"} />
        <Info label="Extension" value={person.extension || "Not listed"} />
        <Info label="Cell" value={person.cell || "Not listed"} />
        <Info label="Email" value={person.email || "Not listed"} />
      </div>

      <div className="button-row">
        <button className="copy-btn" disabled={!person.email} onClick={() => onCopy(person.email, "email")}>Copy Email</button>
        <a className={`mail-btn ${!email ? "disabled-link" : ""}`} href={email ? `mailto:${email}` : undefined}>Send Mail</a>
        <button className="copy-btn" disabled={!person.cell} onClick={() => onCopy(person.cell, "phone")}>Copy Phone</button>
        <a className={`call-btn ${!phone ? "disabled-link" : ""}`} href={phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined}>Call</a>
      </div>

      <button className="details-btn" onClick={onToggle}>
        {isExpanded ? "Hide Full Details" : "View Full Details"}
      </button>

      {isExpanded && (
        <div className="details-box">
          <Detail label="Department Text" value={person.departmentText} />
          <Detail label="Additional Responsibility" value={person.additionalResponsibility} />
          <Detail label="Present Address" value={person.presentAddress} />
          <Detail label="Permanent Address" value={person.permanentAddress} />
          <Detail label="Full Extracted Roster Text" value={person.rawDetails} preserve />
        </div>
      )}
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Detail({ label, value, preserve = false }) {
  if (!value) return null;
  return (
    <div className="detail-item">
      <span>{label}</span>
      <p className={preserve ? "preserve" : ""}>{value}</p>
    </div>
  );
}

export default App;
