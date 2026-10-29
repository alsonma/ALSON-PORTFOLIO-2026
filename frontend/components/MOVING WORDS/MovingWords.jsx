
export default function MovingWords() {
  return (
    <div className="moving-words-bg">
      {["row-1", "row-2", "row-3", "row-4","row-5", "row-6", "row-7", "row-8"].map(
        (row) => (
          <div className={row} key={row}>
            <div className="moving-words-track">
              <span>CREATIVE MIND ✳</span>
              <span>CODE & CREATE ✳</span>
              <span>FULL STACK DEVELOPER ✳</span>
              <span>BUILDER OF IDEAS ✳</span>
              <span>FULL STACK DEVELOPER ✳</span>
              <span>BUILDER OF IDEAS ✳</span>
              <span>CREATIVE MIND ✳</span>
              <span>CODE & CREATE ✳</span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
