
import { useEffect, useRef } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMove = (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add("cursor-visible");
    };

    const handleLeave = () => {
      cursor.classList.remove("cursor-visible");
    };

    const handleEnter = () => {
      cursor.classList.remove("cursor-visible");
    };

    const handleInteraction = (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const interactive = target.closest(
        "a, button, .project-card, .skill-pill, input, textarea, select, [role='button']"
      );

      cursor.classList.toggle("cursor-hover", Boolean(interactive));
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleInteraction);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleInteraction);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <span className="cursor-eye cursor-eye-left" />
      <span className="cursor-eye cursor-eye-right" />
      <span className="cursor-smile" />
    </div>
  );
}
