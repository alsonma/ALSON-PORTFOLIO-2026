
import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./ProfileSelect.css";

export default function ProfileSelect() {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(".profile-nav-inner", {
          y: -12,
          autoAlpha: 0,
          duration: 0.6,
        })
        .from(
          ".profile-eyebrow, .profile-index",
          {
            y: 10,
            autoAlpha: 0,
            duration: 0.45,
            stagger: 0.08,
          },
          "-=0.3"
        )
        .from(
          ".profile-heading",
          {
            y: 24,
            autoAlpha: 0,
            duration: 0.7,
          },
          "-=0.2"
        )
        .from(
          ".profile-subtitle",
          {
            y: 10,
            autoAlpha: 0,
            duration: 0.45,
          },
          "-=0.35"
        )
        .from(
          ".profile-card",
          {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.13,
          },
          "-=0.2"
        )
        .from(
          ".profile-caption, .profile-bottomline",
          {
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.1,
          },
          "-=0.2"
        );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="profile-page" ref={pageRef}>
      <nav className="profile-nav">
        <div className="profile-nav-inner">
          <a className="profile-logo" href="/">
            MA SPACE<span>®</span>
          </a>

          <span className="profile-nav-label">
            PORTFOLIO / 2026
          </span>

          <span className="profile-nav-status">
            <span className="profile-status-dot" />
            AVAILABLE FOR WORK
          </span>
        </div>
      </nav>

      <section className="profile-content">
        <div className="profile-topline">
          <p className="profile-eyebrow">
            HEY THERE! WELCOME IN
          </p>

          <p className="profile-index">01 / 02</p>
        </div>

        <h1 className="profile-heading">
          WHO'S
          <br />
          <span>VISITING?</span>
          <span className="profile-heading-star">✳</span>
        </h1>

        <p className="profile-subtitle">
          Pick your profile. I've got something for you.
        </p>

        <div className="profile-grid">
          <button
            type="button"
            className="profile-card profile-card-recruiter"
            onClick={() => navigate("/recruiter")}
          >
            <span className="profile-card-top">
              <span className="profile-card-number">01</span>
              <span className="profile-card-tag">THE PROFESSIONAL</span>
            </span>

            <span className="profile-character recruiter-character">
              <span className="character-hair" />
              <span className="character-face">
                <span className="character-eye character-eye-left" />
                <span className="character-eye character-eye-right" />
                <span className="character-smile" />
              </span>
              <span className="character-body" />
              <span className="character-arm" />
            </span>

            <span className="profile-art-sticker recruiter-sticker">
              LET'S
              <br />
              CONNECT!
            </span>

            <span className="profile-card-bottom">
              <span>
                <span className="profile-card-title">Recruiter</span>
                <span className="profile-card-description">
                  Explore my work, skills & experience.
                </span>
              </span>

              <span className="profile-card-arrow">↗</span>
            </span>
          </button>

          <button
            type="button"
            className="profile-card profile-card-user"
            onClick={() => navigate("/login")}
          >
            <span className="profile-card-top">
              <span className="profile-card-number">02</span>
              <span className="profile-card-tag">THE INSIDER</span>
            </span>

            <span className="profile-character user-character">
              <span className="character-hair user-hair" />
              <span className="character-face user-face">
                <span className="character-eye character-eye-left" />
                <span className="character-eye character-eye-right" />
                <span className="character-smile" />
              </span>
              <span className="character-body user-body" />
              <span className="character-arm user-arm" />
            </span>

            <span className="profile-art-sticker user-sticker">
              YOUR
              <br />
              SPACE!
            </span>

            <span className="profile-card-bottom">
              <span>
                <span className="profile-card-title">Just Browsing</span>
                <span className="profile-card-description">
                  Sign in to enter your personal space.
                </span>
              </span>

              <span className="profile-card-arrow">↗</span>
            </span>
          </button>
        </div>

        <p className="profile-caption">
          TWO DIFFERENT PATHS. ONE CREATIVE MIND.
        </p>
      </section>

      <footer className="profile-bottomline">
        <span>DESIGNED & BUILT WITH CURIOSITY</span>
        <span>© ALSON M.A. — 2026</span>
      </footer>
    </main>
  );
}
