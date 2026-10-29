
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  UserRound,
  BriefcaseBusiness,
  Code2,
  Contact,
  GraduationCap,
  Settings,
  Eye,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import {
  getPortfolioContent,
  savePortfolioContent,
} from "../api/portfolio.js";
import "./Admin.css";

const initialContent = {
  hero: {
    name: "Alson M.A.",
    title: "Creative Developer",
    description:
      "I build interactive digital experiences using React, JavaScript and creative animations.",
    profileImage: "",
  },

  about: {
    heading: "A little about me",
    image: "",
    bigText:
      "I care about how things work, how they feel, and what people remember after using them.",
    smallText:
      "I'm an MCA graduate passionate about building creative, interactive web experiences. I'm growing my skills in the MERN stack, creative frontend development, and interactive web experiences.",
    description:
      "I'm an MCA graduate passionate about building creative, interactive web experiences.",
  },

  education: [
    {
      id: 1,
      title: "Master of Computer Applications",
      institution: "",
      date: "",
      description:
        "A foundation in computer science and software development.",
    },
  ],

  projects: [
    {
      id: 1,
      title: "Movie Explorer",
      description: "A movie search application built with React.",
      image: "",
      liveUrl: "",
      githubUrl: "",
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "A creative portfolio with GSAP animations.",
      image: "",
      liveUrl: "",
      githubUrl: "",
    },
  ],

  skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],

  contact: {
    email: "",
    github: "",
    linkedin: "",
  },
};

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "hero", label: "Home section", icon: UserRound },
  { id: "about", label: "About", icon: UserRound },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "contact", label: "Contact", icon: Contact },
];

export default function Admin() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [content, setContent] = useState(initialContent);
  const [newSkill, setNewSkill] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/login", { replace: true });
  }

  // Load portfolio content from MongoDB.
  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        setLoading(true);

        const savedContent = await getPortfolioContent();

        if (cancelled) return;

        const savedAbout = savedContent?.about || {};

        setContent({
          ...initialContent,
          ...savedContent,

          hero: {
            ...initialContent.hero,
            ...(savedContent?.hero || {}),
          },

          about: {
            ...initialContent.about,
            ...savedAbout,

            image: savedAbout.image ?? "",

            bigText:
              savedAbout.bigText ??
              savedAbout.description ??
              initialContent.about.bigText,

            smallText:
              savedAbout.smallText ??
              initialContent.about.smallText,
          },

          education: Array.isArray(savedContent?.education)
            ? savedContent.education
            : initialContent.education,

          projects: Array.isArray(savedContent?.projects)
            ? savedContent.projects
            : initialContent.projects,

          skills: Array.isArray(savedContent?.skills)
            ? savedContent.skills
            : initialContent.skills,

          contact: {
            ...initialContent.contact,
            ...(savedContent?.contact || {}),
          },
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load portfolio:", error);

          setNotice(
            error.response?.data?.message ||
            "Could not load portfolio content. Check that your backend is running."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save the complete portfolio content.
  const persistContent = async (nextContent, successMessage) => {
    try {
      setSaving(true);
      setNotice("");

      const savedContent = await savePortfolioContent(nextContent);

      setContent((previous) => ({
        ...previous,
        ...savedContent,

        hero: {
          ...previous.hero,
          ...(savedContent?.hero || nextContent.hero),
        },

        about: {
          ...previous.about,
          ...(savedContent?.about || nextContent.about),
        },

        education:
          savedContent?.education ?? nextContent.education,

        projects:
          savedContent?.projects ?? nextContent.projects,

        skills: savedContent?.skills ?? nextContent.skills,

        contact: {
          ...previous.contact,
          ...(savedContent?.contact || nextContent.contact),
        },
      }));

      setNotice(successMessage || "Changes saved successfully!");

      return true;
    } catch (error) {
      console.error("Failed to save portfolio:", error);

      setNotice(
        error.response?.data?.message ||
        error.message ||
        "Failed to save changes. Please try again."
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field, value) => {
    setContent((previous) => ({
      ...previous,
      hero: {
        ...previous.hero,
        [field]: value,
      },
    }));
  };

  const updateAbout = (field, value) => {
    setContent((previous) => ({
      ...previous,
      about: {
        ...previous.about,
        [field]: value,
      },
    }));
  };

  const updateContact = (field, value) => {
    setContent((previous) => ({
      ...previous,
      contact: {
        ...previous.contact,
        [field]: value,
      },
    }));
  };

  // Save Home, About, Education or Contact.
  const saveCurrentSection = async (event) => {
    event.preventDefault();

    const messages = {
      hero: "Homepage details saved successfully!",
      about: "About section saved successfully!",
      education: "Education details saved successfully!",
      contact: "Contact details saved successfully!",
    };

    await persistContent(
      content,
      messages[activeTab] || "Changes saved successfully!"
    );
  };

  // Add a project.
  const addProject = () => {
    setEditingProject({
      id: Date.now(),
      title: "",
      description: "",
      image: "",
      liveUrl: "",
      githubUrl: "",
    });

    setNotice("");
  };

  // Add or update a project.
  const saveProject = async (event) => {
    event.preventDefault();

    if (!editingProject?.title.trim()) {
      setNotice("Please enter a project title.");
      return;
    }

    const projectExists = content.projects.some(
      (project) =>
        String(project.id) === String(editingProject.id)
    );

    const nextContent = {
      ...content,

      projects: projectExists
        ? content.projects.map((project) =>
          String(project.id) === String(editingProject.id)
            ? { ...editingProject }
            : project
        )
        : [...content.projects, { ...editingProject }],
    };

    const success = await persistContent(
      nextContent,
      projectExists
        ? "Project updated successfully!"
        : "Project added successfully!"
    );

    if (success) {
      setEditingProject(null);
    }
  };

  // Delete a project.
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    const nextContent = {
      ...content,
      projects: content.projects.filter(
        (project) => String(project.id) !== String(id)
      ),
    };

    await persistContent(nextContent, "Project deleted successfully!");
  };

  // Add a skill.
  const addSkill = async (event) => {
    event.preventDefault();

    const skill = newSkill.trim();

    if (!skill) {
      setNotice("Please enter a skill.");
      return;
    }

    const alreadyExists = content.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setNotice("This skill already exists.");
      return;
    }

    const nextContent = {
      ...content,
      skills: [...content.skills, skill],
    };

    const success = await persistContent(
      nextContent,
      "Skill added successfully!"
    );

    if (success) setNewSkill("");
  };

  // Delete a skill.
  const deleteSkill = async (skillToDelete) => {
    const nextContent = {
      ...content,
      skills: content.skills.filter(
        (skill) => skill !== skillToDelete
      ),
    };

    await persistContent(nextContent, "Skill deleted successfully!");
  };

  // Update an education field.
  const updateEducation = (id, field, value) => {
    setContent((previous) => ({
      ...previous,

      education: previous.education.map((item) =>
        String(item.id) === String(id)
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  // Add an education entry.
  const addEducation = () => {
    setContent((previous) => ({
      ...previous,

      education: [

        {
          id: Date.now(),
          title: "",
          institution: "",
          date: "",
          description: "",
        },
        ...previous.education,
      ],
    }));

    setNotice("");
  };

  // Remove an education entry.
  const removeEducation = (id) => {
    setContent((previous) => ({
      ...previous,

      education: previous.education.filter(
        (item) => String(item.id) !== String(id)
      ),
    }));
  };

  const activeLabel =
    navigation.find((item) => item.id === activeTab)?.label ||
    "Overview";

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}
      >
        <div className="admin-brand">
          <div className="admin-brand-mark">M.A</div>

          <div>
            <strong>M.A</strong>
            <span>CONTENT STUDIO</span>
          </div>

          <button
            className="admin-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-nav-label">WORKSPACE</div>

        <nav className="admin-navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`admin-nav-item ${activeTab === id ? "active" : ""
                }`}
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
                setNotice("");
              }}
            >
              <Icon size={19} />
              <span>{label}</span>

              {activeTab === id && (
                <span className="admin-nav-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-status-dot" />

          <div>
            <strong>Content studio</strong>
            <span>
              {saving ? "Saving changes..." : "Connected workspace"}
            </span>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="admin-breadcrumb">
                WORKSPACE / {activeLabel.toUpperCase()}
              </div>

              <h1>{activeLabel}</h1>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <a
              className="admin-view-site"
              href="/"
              target="_blank"
              rel="noreferrer"
            >
              <Eye size={17} />
              <span>View website</span>
              <ExternalLink size={14} />
            </a>

            <button
              type="button"
              className="admin-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>

            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          {notice && (
            <div className="admin-notice" role="status">
              {notice}

              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <section className="admin-panel">
              <p>Loading your portfolio content...</p>
            </section>
          ) : (
            <>
              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <>
                  <section className="admin-welcome">
                    <div>
                      <span className="admin-eyebrow">
                        YOUR DIGITAL SPACE
                      </span>

                      <h2>
                        Make your work
                        <br />
                        <span>stand out.</span>
                      </h2>

                      <p>
                        Manage the content that appears on your public
                        portfolio from one place.
                      </p>

                      <button
                        className="admin-primary-button"
                        onClick={() => setActiveTab("hero")}
                      >
                        Edit homepage <ExternalLink size={16} />
                      </button>
                    </div>

                    <div
                      className="admin-welcome-art"
                      aria-hidden="true"
                    >
                      <div className="admin-art-circle" />
                      <span className="admin-art-star">✳</span>

                      <span className="admin-art-text">
                        CREATE
                        <br />
                        YOUR
                        <br />
                        STORY.
                      </span>

                      <span className="admin-art-small">
                        DESIGN / BUILD / REPEAT
                      </span>
                    </div>
                  </section>

                  <div className="admin-section-heading">
                    <div>
                      <span className="admin-eyebrow">
                        AT A GLANCE
                      </span>
                      <h2>Portfolio overview</h2>
                    </div>
                  </div>

                  <div className="admin-stat-grid">
                    <article className="admin-stat-card">
                      <div className="admin-stat-icon purple">
                        <BriefcaseBusiness size={20} />
                      </div>
                      <span>PROJECTS</span>
                      <strong>{content.projects.length}</strong>
                      <small>Portfolio projects</small>
                    </article>

                    <article className="admin-stat-card">
                      <div className="admin-stat-icon lime">
                        <Code2 size={20} />
                      </div>
                      <span>SKILLS</span>
                      <strong>{content.skills.length}</strong>
                      <small>Listed technologies</small>
                    </article>

                    <article className="admin-stat-card">
                      <div className="admin-stat-icon pink">
                        <UserRound size={20} />
                      </div>
                      <span>EDUCATION</span>
                      <strong>{content.education.length}</strong>
                      <small>Education entries</small>
                    </article>
                  </div>

                  <section className="admin-panel admin-quick-actions">
                    <div className="admin-panel-heading">
                      <div>
                        <span className="admin-eyebrow">
                          SHORTCUTS
                        </span>
                        <h3>What would you like to update?</h3>
                      </div>
                    </div>

                    {navigation
                      .filter((item) => item.id !== "overview")
                      .map(({ id, label, icon: Icon }) => (
                        <button
                          className="admin-quick-action"
                          key={id}
                          onClick={() => setActiveTab(id)}
                        >
                          <Icon size={19} />
                          <span>{label}</span>
                          <span className="admin-action-arrow">↗</span>
                        </button>
                      ))}
                  </section>
                </>
              )}

              {/* HOME SECTION */}
              {activeTab === "hero" && (
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span className="admin-eyebrow">
                        FIRST IMPRESSION
                      </span>
                      <h2>Edit homepage</h2>
                      <p>Update the content visitors see first.</p>
                    </div>
                  </div>

                  <form
                    onSubmit={saveCurrentSection}
                    className="admin-form"
                  >
                    {/* <label>
                      Your name
                      <input
                        value={content.hero.name}
                        onChange={(event) =>
                          updateHero("name", event.target.value)
                        }
                        placeholder="Your name"
                      />
                    </label> */}

                    <label>
                      Main heading
                      <input
                        value={content.hero.title}
                        onChange={(event) =>
                          updateHero("title", event.target.value)
                        }
                        placeholder="Creative Developer"
                      />
                    </label>

                    <label>
                      Short introduction
                      <textarea
                        rows={4}
                        value={content.hero.description}
                        onChange={(event) =>
                          updateHero("description", event.target.value)
                        }
                        placeholder="Write a short introduction..."
                      />
                    </label>

                    <label>
                      Upload Profile Image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files[0];

                          if (!file) return;

                          const reader = new FileReader();

                          reader.onloadend = () => {
                            updateHero("profileImage", reader.result);
                          };

                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>

                    {content.hero.profileImage && (
                      <img
                        src={content.hero.profileImage}
                        alt="Profile preview"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          marginTop: "10px",
                        }}
                      />
                    )}

                    {content.hero.profileImage && (
                      <img
                        className="admin-image-preview"
                        src={content.hero.profileImage}
                        alt="Profile preview"
                      />
                    )}

                    <div className="admin-form-footer">
                      <span>Save to publish your changes.</span>

                      <button
                        className="admin-primary-button"
                        type="submit"
                        disabled={saving}
                      >
                        <Save size={17} />
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* ABOUT SECTION */}
              {activeTab === "about" && (
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span className="admin-eyebrow">YOUR STORY</span>
                      <h2>Edit About section</h2>
                      <p>
                        Update your image and the text displayed in
                        your About section.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={saveCurrentSection}
                    className="admin-form"
                  >
                    {/* <label>
                      About heading
                      <input
                        value={content.about.heading || ""}
                        onChange={(event) =>
                          updateAbout("heading", event.target.value)
                        }
                        placeholder="A little about me"
                      />
                    </label> */}

                    <label>
                      Upload About Image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files[0];

                          if (!file) return;

                          const reader = new FileReader();

                          reader.onloadend = () => {
                            updateAbout("image", reader.result);
                          };

                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>

                    {content.about.image && (
                      <img
                        src={content.about.image}
                        alt="About preview"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          marginTop: "10px",
                        }}
                      />
                    )}

                    {content.about.image && (
                      <div>
                        <p>Image preview</p>
                        <img
                          className="admin-image-preview"
                          src={content.about.image}
                          alt="About section preview"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                          onLoad={(event) => {
                            event.currentTarget.style.display = "block";
                          }}
                        />
                      </div>
                    )}

                    <label>
                      Main About text
                      <textarea
                        rows={5}
                        value={
                          content.about.bigText ??
                          content.about.description ??
                          ""
                        }
                        onChange={(event) =>
                          updateAbout("bigText", event.target.value)
                        }
                        placeholder="Write the main statement for your About section..."
                      />
                    </label>

                    <label>
                      Supporting About text
                      <textarea
                        rows={6}
                        value={content.about.smallText || ""}
                        onChange={(event) =>
                          updateAbout("smallText", event.target.value)
                        }
                        placeholder="Write more about your background, skills, and interests..."
                      />
                    </label>

                    <div className="admin-form-footer">
                      <span>Save to publish your changes.</span>

                      <button
                        className="admin-primary-button"
                        type="submit"
                        disabled={saving}
                      >
                        <Save size={17} />
                        {saving ? "Saving..." : "Save About"}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* EDUCATION SECTION */}
              {activeTab === "education" && (
                <section className="admin-panel">
                  <div className="admin-panel-heading admin-project-heading">
                    <div>
                      <span className="admin-eyebrow">
                        YOUR JOURNEY
                      </span>
                      <h2>Edit Education</h2>
                      <p>
                        Manage your qualifications and academic background.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="admin-primary-button"
                      onClick={addEducation}
                      disabled={saving}
                    >
                      <Plus size={18} /> Add education
                    </button>
                  </div>

                  <form
                    onSubmit={saveCurrentSection}
                    className="admin-form"
                  >
                    {content.education.map((item) => (
                      <div
                        className="admin-project-editor"
                        key={item.id}
                      >
                        <h3>
                          {item.title || "Education entry"}
                        </h3>

                        <label>
                          Qualification
                          <input
                            required
                            value={item.title}
                            onChange={(event) =>
                              updateEducation(
                                item.id,
                                "title",
                                event.target.value
                              )
                            }
                            placeholder="Qualification"
                          />
                        </label>

                        <label>
                          Institution
                          <input
                            value={item.institution}
                            onChange={(event) =>
                              updateEducation(
                                item.id,
                                "institution",
                                event.target.value
                              )
                            }
                            placeholder="College or university"
                          />
                        </label>

                        <label>
                          Year or duration
                          <input
                            value={item.date}
                            onChange={(event) =>
                              updateEducation(
                                item.id,
                                "date",
                                event.target.value
                              )
                            }
                            placeholder="Year or duration"
                          />
                        </label>

                        <label>
                          Description
                          <textarea
                            rows={3}
                            value={item.description}
                            onChange={(event) =>
                              updateEducation(
                                item.id,
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="Describe your studies..."
                          />
                        </label>

                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => removeEducation(item.id)}
                          disabled={saving}
                        >
                          <Trash2 size={16} />
                          Remove education
                        </button>
                      </div>
                    ))}

                    {content.education.length === 0 && (
                      <p>
                        No education entries yet. Select Add education
                        to create one.
                      </p>
                    )}

                    <div className="admin-form-footer">
                      <span>Save to publish your changes.</span>

                      <button
                        className="admin-primary-button"
                        type="submit"
                        disabled={saving}
                      >
                        <Save size={17} />
                        {saving ? "Saving..." : "Save Education"}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* PROJECTS */}
              {activeTab === "projects" && (
                <section className="admin-panel">
                  <div className="admin-panel-heading admin-project-heading">
                    <div>
                      <span className="admin-eyebrow">YOUR WORK</span>
                      <h2>Projects</h2>
                      <p>
                        Add and manage the projects displayed on your
                        portfolio.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="admin-primary-button"
                      onClick={addProject}
                      disabled={saving}
                    >
                      <Plus size={18} /> Add project
                    </button>
                  </div>

                  {editingProject && (
                    <form
                      className="admin-project-editor"
                      onSubmit={saveProject}
                    >
                      <h3>
                        {content.projects.some(
                          (project) =>
                            String(project.id) ===
                            String(editingProject.id)
                        )
                          ? "Edit project"
                          : "New project"}
                      </h3>

                      <label>
                        Project title
                        <input
                          required
                          value={editingProject.title}
                          onChange={(event) =>
                            setEditingProject({
                              ...editingProject,
                              title: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        Description
                        <textarea
                          rows={3}
                          value={editingProject.description}
                          onChange={(event) =>
                            setEditingProject({
                              ...editingProject,
                              description: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        Image URL
                        <input
                          type="url"
                          value={editingProject.image}
                          onChange={(event) =>
                            setEditingProject({
                              ...editingProject,
                              image: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        Live demo URL
                        <input
                          type="url"
                          value={editingProject.liveUrl}
                          onChange={(event) =>
                            setEditingProject({
                              ...editingProject,
                              liveUrl: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        GitHub URL
                        <input
                          type="url"
                          value={editingProject.githubUrl}
                          onChange={(event) =>
                            setEditingProject({
                              ...editingProject,
                              githubUrl: event.target.value,
                            })
                          }
                        />
                      </label>

                      <div className="admin-form-footer">
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => setEditingProject(null)}
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="admin-primary-button"
                          disabled={saving}
                        >
                          <Save size={17} />
                          {saving ? "Saving..." : "Save project"}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="admin-project-list">
                    {content.projects.map((project, index) => (
                      <article
                        className="admin-project-row"
                        key={project.id}
                      >
                        <div className="admin-project-number">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="admin-project-thumb">
                          {project.image ? (
                            <img src={project.image} alt="" />
                          ) : (
                            <Code2 size={25} />
                          )}
                        </div>

                        <div className="admin-project-info">
                          <strong>{project.title}</strong>
                          <p>
                            {project.description || "No description yet."}
                          </p>
                        </div>

                        <div className="admin-project-actions">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProject({ ...project })
                            }
                            aria-label={`Edit ${project.title}`}
                            title="Edit project"
                            disabled={saving}
                          >
                            <Settings size={17} />
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() => deleteProject(project.id)}
                            aria-label={`Delete ${project.title}`}
                            title="Delete project"
                            disabled={saving}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </article>
                    ))}

                    {content.projects.length === 0 && (
                      <p>
                        No projects yet. Select “Add project” to begin.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* SKILLS */}
              {activeTab === "skills" && (
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span className="admin-eyebrow">TECH STACK</span>
                      <h2>Skills</h2>
                      <p>
                        Manage the technologies shown on your homepage.
                      </p>
                    </div>
                  </div>

                  <form className="admin-add-skill" onSubmit={addSkill}>
                    <input
                      value={newSkill}
                      onChange={(event) =>
                        setNewSkill(event.target.value)
                      }
                      placeholder="Add a skill, e.g. Express.js"
                      aria-label="New skill"
                    />

                    <button
                      className="admin-primary-button"
                      type="submit"
                      disabled={saving}
                    >
                      <Plus size={18} /> Add skill
                    </button>
                  </form>

                  <div className="admin-skill-list">
                    {content.skills.map((skill) => (
                      <div className="admin-skill-chip" key={skill}>
                        <span>{skill}</span>

                        <button
                          type="button"
                          onClick={() => deleteSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          title={`Remove ${skill}`}
                          disabled={saving}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* CONTACT */}
              {activeTab === "contact" && (
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span className="admin-eyebrow">
                        LET'S CONNECT
                      </span>
                      <h2>Contact details</h2>
                      <p>
                        Update the links visitors use to contact you.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={saveCurrentSection}
                    className="admin-form"
                  >
                    <label>
                      Email address
                      <input
                        type="email"
                        value={content.contact.email}
                        onChange={(event) =>
                          updateContact("email", event.target.value)
                        }
                        placeholder="you@example.com"
                      />
                    </label>

                    <label>
                      GitHub profile URL
                      <input
                        type="url"
                        value={content.contact.github}
                        onChange={(event) =>
                          updateContact("github", event.target.value)
                        }
                        placeholder="https://github.com/username"
                      />
                    </label>

                    <label>
                      LinkedIn profile URL
                      <input
                        type="url"
                        value={content.contact.linkedin}
                        onChange={(event) =>
                          updateContact("linkedin", event.target.value)
                        }
                        placeholder="https://linkedin.com/in/username"
                      />
                    </label>

                    <div className="admin-form-footer">
                      <span>Save to publish your changes.</span>

                      <button
                        className="admin-primary-button"
                        type="submit"
                        disabled={saving}
                      >
                        <Save size={17} />
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
