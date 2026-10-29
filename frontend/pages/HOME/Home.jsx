import { UserRound } from "lucide-react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Download,
  ArrowDownRight,
  ArrowUpRight,
  GitBranch,
  BriefcaseBusiness,
  Mail,
  Sparkles,
  Code2,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

import { getPortfolioContent } from "../api/portfolio.js";
import PaintIntro from "../../components/PAINTING/PaintIntro";
import CustomCursor from "../../components/CURSOR/CustomCursor";
import ScrollToTop from "../../components/SCROLLTOTOP/ScrollToTop";
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

const defaultProjects = [
  {
    id: 1,
    title: "CINEVERSE",
    category: "REACT · API · UI",
    description: "A cinematic movie discovery experience built to explore and search movies.",
    color: "project-pink",
    shape: "◉",
    technologies: ["React", "Axios", "REST API"],
    features: [
      "Search and discover movies",
      "Fetch movie data from an external API",
      "Responsive interface and interactive UI",
    ],
    liveUrl: "",
    githubUrl: "",
    status: "Frontend project",
  },
  {
    id: 2,
    title: "AUTHFLOW",
    category: "NODE.JS · MONGODB · JWT",
    description: "A full-stack authentication system with secure login and protected API routes.",
    color: "project-lime",
    shape: "↗",
    technologies: ["Node.js", "Express", "MongoDB", "JWT"],
    features: [
      "User registration and login",
      "Password hashing and JWT authentication",
      "Protected routes and authenticated requests",
    ],
    liveUrl: "",
    githubUrl: "",
    status: "Full-stack project",
  },
  {
    id: 3,
    title: "NEXTGEN",
    category: "REACT · GSAP · MOTION",
    description: "An experimental frontend concept focused on expressive layouts and motion.",
    color: "project-blue",
    shape: "✳",
    technologies: ["React", "GSAP", "JavaScript", "CSS"],
    features: [
      "Animated page transitions and reveals",
      "Interactive hover effects",
      "Responsive creative web design",
    ],
    liveUrl: "",
    githubUrl: "",
    status: "Creative experiment",
  },
];

const defaultSkills = [
  "JavaScript",
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "GSAP",
  "HTML & CSS",
  "Git & GitHub",
];

const defaultEducation = [
  {
    id: 1,
    title: "Master of Computer Applications",
    institution: "",
    date: "MCA",
    description:
      "An academic foundation in computer science and software development.",
  },
];

const projectColors = ["project-pink", "project-lime", "project-blue"];
const projectShapes = ["◉", "↗", "✳"];

function normalizeProjects(items) {
  if (!Array.isArray(items)) return defaultProjects;

  return items.map((project, index) => {
    const fallback = defaultProjects[index % defaultProjects.length];

    return {
      ...fallback,
      ...project,
      id: project.id ?? index + 1,
      number: String(index + 1).padStart(2, "0"),
      title: project.title || "Untitled project",
      description: project.description || "",
      category:
        project.category ||
        (Array.isArray(project.technologies)
          ? project.technologies.join(" · ").toUpperCase()
          : "DEVELOPMENT PROJECT"),
      color: projectColors[index % projectColors.length],
      shape: projectShapes[index % projectShapes.length],
      technologies: Array.isArray(project.technologies)
        ? project.technologies
        : [],
      features: Array.isArray(project.features) ? project.features : [],
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      status: project.status || "Development project",
    };
  });
}

export default function Home() {
  const pageRef = useRef(null);
  const [portfolioContent, setPortfolioContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentError, setContentError] = useState("");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("portfolio-theme") === "dark"
  );

  // Load portfolio content and support retrying after a failure.
  const loadPortfolio = async () => {
    setLoading(true);
    setContentError("");

    try {
      const content = await getPortfolioContent();

      setPortfolioContent(content || {});
    } catch (error) {
      console.error(
        "Failed to load portfolio:",
        error.response?.data || error.message
      );

      setContentError(
        "Unable to load the latest portfolio content. Showing available default content."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        const content = await getPortfolioContent();

        if (!cancelled) {
          setPortfolioContent(content || {});
          setContentError("");
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load portfolio:",
            error.response?.data || error.message
          );

          setContentError(
            "Unable to load the latest portfolio content. Showing default content."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((current) => !current);

  const hero = {
    name: "Alson M.A.",
    title: "Creative Developer",
    description:
      "I build interactive digital experiences using React, JavaScript and creative animations.",
    profileImage: "",
    ...(portfolioContent?.hero || {}),
  };

  // New editable About fields, with support for older saved content.
  const savedAbout = portfolioContent?.about || {};

  const about = {
    image: savedAbout.image || "",
    bigText:
      savedAbout.bigText ??
      "I care about how things work, how they feel, and what people remember after using them.",
    smallText:
      savedAbout.smallText ??
      savedAbout.description ??
      "With an MCA background and a focus on full-stack development, I'm growing my skills in the MERN stack, creative frontend development, and interactive web experiences. I enjoy turning ideas into useful, polished products.",
  };

  const profileImage = hero.profileImage || "/alson.jpeg";
  const aboutImage = about.image || profileImage;

  const projects = normalizeProjects(
    portfolioContent?.projects ?? defaultProjects
  );

  const skills = Array.isArray(portfolioContent?.skills)
    ? portfolioContent.skills
    : defaultSkills;

  const education = Array.isArray(portfolioContent?.education)
    ? portfolioContent.education
    : defaultEducation;

  const contact = {
    email: "alsonma4022@gmail.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    ...(portfolioContent?.contact || {}),
  };

  const email = contact.email || "alsonma4022@gmail.com";
  const github = contact.github || "https://github.com/";
  const linkedin = contact.linkedin || "https://linkedin.com/";

  // Set up animations once the page is mounted.
  useLayoutEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const cleanups = [];

    const ctx = gsap.context(() => {
      const portrait = root.querySelector(".hero-portrait");
      const portraitImage = root.querySelector(".hero-portrait img");
      const orbits = root.querySelectorAll(".portrait-orbit");

      if (portrait) {
        const onEnter = () => {
          gsap.to(portrait, {
            rotation: -4,
            scale: 1.035,
            y: -8,
            duration: 0.35,
            ease: "back.out(2)",
            overwrite: "auto",
          });

          if (portraitImage) {
            gsap.to(portraitImage, {
              scale: 1.1,
              rotation: 2,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(orbits, {
            scale: 1.3,
            rotation: 25,
            duration: 0.3,
            stagger: 0.08,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        };

        const onLeave = () => {
          gsap.to(portrait, {
            rotation: 0,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto",
          });

          if (portraitImage) {
            gsap.to(portraitImage, {
              scale: 1,
              rotation: 0,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(orbits, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
            overwrite: "auto",
          });
        };

        portrait.addEventListener("mouseenter", onEnter);
        portrait.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          portrait.removeEventListener("mouseenter", onEnter);
          portrait.removeEventListener("mouseleave", onLeave);
        });
      }

      // Reveal elements as they enter the viewport.
      gsap.utils.toArray(".reveal", root).forEach((element) => {
        gsap.fromTo(
          element,
          { y: 35, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      const projectCards = root.querySelectorAll(".project-card");
      const projectsGrid = root.querySelector(".projects-grid");

      if (projectsGrid && projectCards.length) {
        gsap.from(projectCards, {
          y: 45,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: projectsGrid,
            start: "top 82%",
            once: true,
          },
        });
      }

      const sticker = root.querySelector(".hero-sticker");

      if (sticker) {
        gsap.to(sticker, {
          x: 30,
          rotation: 360,
          duration: 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      const marquee = root.querySelector(".marquee-track");

      if (marquee) {
        gsap.to(marquee, {
          xPercent: -50,
          duration: 24,
          ease: "none",
          repeat: -1,
        });
      }

      gsap.utils.toArray(".skill-pill", root).forEach((pill) => {
        const onEnter = () =>
          gsap.to(pill, {
            y: -4,
            rotation: -2,
            duration: 0.2,
            overwrite: true,
          });

        const onLeave = () =>
          gsap.to(pill, {
            y: 0,
            rotation: 0,
            duration: 0.25,
            overwrite: true,
          });

        pill.addEventListener("mouseenter", onEnter);
        pill.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          pill.removeEventListener("mouseenter", onEnter);
          pill.removeEventListener("mouseleave", onLeave);
        });
      });

      // Refresh after the layout has been measured.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  // Refresh trigger positions when database content changes page height.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(frame);
  }, [portfolioContent]);

  const handleCardMove = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 7,
      rotateX: y * -7,
      scale: 1.015,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 900,
      overwrite: true,
    });
  };

  const handleCardLeave = (event) => {
    gsap.to(event.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  };

  return (
    <main className="portfolio" ref={pageRef}>
      <PaintIntro />
      <CustomCursor />
      <ScrollToTop />

      {loading && (
        <div className="portfolio-loading" role="status">
          Loading portfolio...
        </div>
      )}

      <nav className="nav">
        <div className="nav-inner">
          <a className="brand" href="#home" aria-label="Alson home">
            ALSON M<span>.</span>A
          </a>

          <div className="nav-status">
            <span className="status-dot" />
            OPEN TO OPPORTUNITIES
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label={darkMode ? "Switch to light mode" : "Switch to night mode"}
            aria-pressed={darkMode}
          >
            <span className="theme-icon">{darkMode ? "☀️" : "🌙"}</span>
            <span>{darkMode ? "Day mode" : "Night mode"}</span>
          </button>
          <button
            className="profile-selection-btn"
            type="button"
            onClick={() => (window.location.href = "/")}
            aria-label="Go to profile selection"
            title="Profile selection"
          >
            <UserRound size={19} />
          </button>

          <div className="nav-links">
            <a href="#home">HOME</a>
            <a href="#about">ABOUT</a>
            <a href="#work">PROJECTS</a>
            <a href="#project-details">PROJECT DETAILS</a>
            <a href="#experience">EXPERIENCE & EDUCATION</a>
            <a className="nav-contact" href="#contact">
              CONTACT <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </nav>

      {/* HOME */}
      <section className="hero section-pad" id="home">
        <div className="hero-topline">
          <p className="hero-eyebrow">
            {hero.title || "CREATIVE DEVELOPER"} <span>✳</span> BASED IN INDIA
          </p>
          <p className="hero-index">PORTFOLIO — 2026</p>
        </div>

        <div className="hero-main">
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="hero-line"><span>BUILDING</span></span>
              <span className="hero-line hero-line-second">
                <span>THE <em>WEB.</em></span>
              </span>
              <span className="hero-line hero-line-third"><span>DIFFERENTLY.</span></span>
            </h1>

            <div className="hero-bottom">
              <p className="hero-description">
                {hero.description ||
                  `I'm ${hero.name || "Alson"}, a developer who turns ideas into memorable digital experiences.`}
              </p>

              <div className="hero-actions">
                <a className="button-primary" href="#work">
                  EXPLORE MY WORK <ArrowDownRight size={18} />
                </a>
                <a className="button-text" href="#contact">HAVE A PROJECT?</a>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-portrait">
              <img
                src={profileImage}
                alt={`Portrait of ${hero.name || "Alson"}`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <div className="portrait-placeholder">
                <span>YOUR IMAGE</span>
                <strong>AM.</strong>
                <small>DEVELOPER / CREATOR</small>
              </div>
              <span className="portrait-orbit orbit-one" />
              <span className="portrait-orbit orbit-two" />
            </div>

            <div className="hero-sticker" aria-hidden="true">
              <Sparkles size={24} />
              <span>MADE WITH</span>
              <strong>PASSION</strong>
              <span>AND PIXELS</span>
              <span className="sticker-star">✳</span>
            </div>

            <div className="hero-visual-label">
              <span>DESIGN MINDED.</span>
              <span>CODE OBSESSED.</span>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <span>REACT / NODE / CREATIVE CODE</span>
          <a href="#about">SCROLL TO EXPLORE <ArrowDownRight size={16} /></a>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="marquee" aria-label="Developer specialties">
        <div className="marquee-track">
          {[0, 1, 2, 3].map((item) => (
            <div className="marquee-group" key={item}>
              <span>DESIGN MINDED</span>
              <span className="marquee-symbol">✳</span>
              <span>CODE OBSESSED</span>
              <span className="marquee-symbol">✳</span>
              <span>ALWAYS BUILDING</span>
              <span className="marquee-symbol">✳</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT - ALL CONTENT EDITABLE IN ADMIN */}
      <section className="about-section" id="about">
        <div className="about-main">
          <div className="about-photo reveal">
            <div className="about-photo-frame">
              <img
                src={aboutImage}
                alt={`Portrait of ${hero.name || "Alson"}`}
                className="about-profile-img"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
            <p className="about-photo-caption">DEVELOPER · CREATIVE THINKER</p>
          </div>

          <div className="about-content reveal">
            <div className="about-intro">
              <p className="section-label">01 / A LITTLE ABOUT ME</p>
            </div>

            <h2 className="about-large-heading">
              I BUILD DIGITAL
              <br />
              EXPERIENCES THAT
              <br />
              <span>STAND OUT.</span>
            </h2>

            <p className="about-big">{about.bigText}</p>
            <p className="about-small">{about.smallText}</p>

            <a className="about-link" href="#contact">
              LET'S BUILD SOMETHING GOOD <ArrowUpRight size={18} />
            </a>

            <div className="resume-actions">
              <a
                className="resume-btn resume-view"
                href="/ALSON_RESUME.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW RESUME <ArrowUpRight size={18} />
              </a>

              <a
                className="resume-btn resume-download"
                href="/ALSON_RESUME.pdf"
                download="Alson-Resume.pdf"
              >
                <span>DOWNLOAD RESUME</span>
                <span className="download-icon"><Download size={18} /></span>
              </a>
            </div>
          </div>
        </div>

        <div className="skills-block reveal">
          <p className="section-label">THINGS I WORK WITH</p>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <span className="skill-pill" key={`${skill}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="work-section section-pad" id="work">
        <div className="section-heading reveal">
          <div>
            <p className="section-label">02 / SELECTED WORK</p>
            <h2>SMALL LIST.<br /><em>BIG ENERGY.</em></h2>
          </div>
          <p className="section-note">
            A few things I've built, ideas I've explored, and problems I've enjoyed solving.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <a
              className={`project-card ${project.color}`}
              href={`#detail-${project.number}`}
              key={project.id ?? index}
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
            >
              <div className="project-meta">
                <span>PROJECT / {project.number}</span>
                <ArrowUpRight size={22} />
              </div>

              <div className="project-art" aria-hidden="true">
                <span className="project-shape">{project.shape}</span>
                <span className="project-art-word">{project.title}</span>
              </div>

              <div className="project-info">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <span className="project-category">{project.category}</span>
              </div>
            </a>
          ))}
        </div>

        <p className="work-footnote reveal">
          MORE EXPERIMENTS ARE ALWAYS IN THE WORKS. ↗
        </p>
      </section>

      {/* PROJECT DETAILS */}
      <section className="project-details-section section-pad" id="project-details">
        <div className="section-heading reveal">
          <div>
            <p className="section-label">03 / PROJECT DETAILS</p>
            <h2>BEHIND THE<br /><em>BUILD.</em></h2>
          </div>
          <p className="section-note">
            A closer look at the technology, features, and thinking behind each project.
          </p>
        </div>

        <div className="project-details-list">
          {projects.map((project, index) => (
            <article
              className="project-detail reveal"
              id={`detail-${project.number}`}
              key={project.id ?? index}
            >
              <span className="detail-number">{project.number}</span>

              <div className="detail-main">
                <p className="detail-status">{project.status}</p>
                <h3>{project.title}</h3>
                <p className="detail-description">{project.description}</p>

                {project.features.length > 0 && (
                  <>
                    <h4>FEATURES</h4>
                    <ul className="detail-features">
                      {project.features.map((feature, featureIndex) => (
                        <li key={`${feature}-${featureIndex}`}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="detail-tags">
                  {project.technologies.map((technology, techIndex) => (
                    <span key={`${technology}-${techIndex}`}>{technology}</span>
                  ))}
                </div>

                {(project.liveUrl || project.githubUrl) && (
                  <div className="detail-tags">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer">
                        Live project ↗
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer">
                        Source code ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* <a
                className="detail-arrow"
                href="#contact"
                aria-label={`Ask about ${project.title}`}
              >
                <ExternalLink size={22} />
              </a> */}
            </article>
          ))}
        </div>
      </section>

      {/* EDUCATION - LOADED FROM ADMIN */}
      <section className="experience-section section-pad" id="experience">
        <div className="section-heading reveal">
          <div>
            <p className="section-label">04 / MY JOURNEY</p>
            <h2>LEARNING.<br /><em>BUILDING.</em></h2>
          </div>
          <p className="section-note">
            My education and development journey.
          </p>
        </div>

        <div className="experience-list">
          {education.map((item, index) => (
            <article
              className="experience-item reveal"
              key={item.id ?? index}
            >
              <span className="experience-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="experience-main">
                <span className="experience-label">
                  {item.institution || "EDUCATION"}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div className="experience-side">
                <GraduationCap size={25} />
                <span>{item.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section section-pad" id="contact">
        <div className="contact-top reveal">
          <p className="section-label">05 / YOUR TURN</p>
          <span>GOT SOMETHING IN MIND? ↘</span>
        </div>

        <div className="contact-content reveal">
          <h2 className="contact-title">LET'S MAKE<br /><em>IT HAPPEN.</em></h2>

          <a className="contact-email" href={`mailto:${email}`}>
            {email} <ArrowUpRight size={22} />
          </a>

          <p className="contact-message">
            Have an opportunity, an interesting idea, or a project in mind?
            Let's talk about it.
          </p>

          <a className="button-primary contact-button" href={`mailto:${email}`}>
            START A CONVERSATION <ArrowUpRight size={19} />
          </a>
        </div>

        <div className="contact-bottom">
          <p>GOOD IDEAS DESERVE GREAT EXECUTION.</p>
          <div className="social-links">
            <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitBranch size={19} />
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <BriefcaseBusiness size={19} />
            </a>
            <a href={`mailto:${email}`} aria-label="Email">
              <Mail size={19} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <span>ALSON M.A. © {new Date().getFullYear()}</span>
        <span>DESIGNED WITH INTENTION. BUILT WITH CODE.</span>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>

      {contentError && (
        <div role="status" className="portfolio-load-error">
          <span>{contentError}</span>
          <button type="button" onClick={loadPortfolio}>
            Try again
          </button>
        </div>
      )}
    </main>
  );
}
