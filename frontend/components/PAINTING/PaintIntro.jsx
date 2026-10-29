
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "./PaintIntro.css";
import MovingWords from "../MOVING WORDS/MovingWords";

export default function PaintIntro() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cover = root.querySelector(".paint-cover");
    const title = root.querySelector(".paint-title");
    const words = root.querySelector(".moving-words-bg");
    const tracks = root.querySelectorAll(".moving-words-track");

    const ctx = gsap.context(() => {
      gsap.set(root, { display: "block", autoAlpha: 1 });
      gsap.set(cover, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(title, { autoAlpha: 0, y: 25 });
      tracks.forEach((track, index) => {
  gsap.fromTo(
    track,
    { x: index % 2 === 0 ? 0 : -180 },
    {
      x: index % 2 === 0 ? -180 : 0,
      duration: 2.5 + index * 0.5,
      ease: "none",
      repeat: -1,
      yoyo: false,
    }
  );
});

      if (words) gsap.set(words, { autoAlpha: 1 });

      const timeline = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          gsap.set(root, { display: "none" });
        },
      });

      timeline
        .to(title, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        })
        .to({}, { duration: 1 })
        .to(
          title,
          {
            autoAlpha: 0,
            y: -20,
            duration: 0.35,
            ease: "power2.in",
          },
          "out"
        )
        .to(
          cover,
          {
            clipPath: "inset(0% 0% 0% 100%)",
            duration: 1.15,
            ease: "power3.inOut",
          },
          "out"
        );

      if (words) {
        timeline.to(
          words,
          {
            autoAlpha: 0,
            duration: 0.45,
            ease: "power2.inOut",
          },
          "out"
        );
      }
    }, root);

    // Fallback: never leave the intro covering the page.
    const fallback = window.setTimeout(() => {
      if (rootRef.current) {
        gsap.set(rootRef.current, { display: "none" });
      }
    }, 6000);

    return () => {
      window.clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  return (
    <div className="paint-intro" ref={rootRef}>
      <div className="paint-cover" />
      <MovingWords />
      <h1 className="paint-title">ALSON M.A</h1>
    </div>
  );
}
