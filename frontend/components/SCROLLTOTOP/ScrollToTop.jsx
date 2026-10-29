
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import "./ScrollToTop.css";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-to-top ${visible ? "show" : ""}`}
      onClick={scrollToTop}
      aria-label="Move to top"
      title="Move to top"
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
}
