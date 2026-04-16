import { useNavigate } from "react-router-dom";

interface Props {
  current: "list" | "matrix";
}

export function ViewToggle({ current }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-full p-1 flex gap-1 border border-white/80">
      <button
        className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
          current === "list"
            ? "bg-ink text-white"
            : "text-ink hover:bg-white/40"
        }`}
        onClick={() => current !== "list" && navigate("/taskcycle")}
        aria-current={current === "list" ? "page" : undefined}
      >
        List
      </button>
      <button
        className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
          current === "matrix"
            ? "bg-ink text-white"
            : "text-ink hover:bg-white/40"
        }`}
        onClick={() => current !== "matrix" && navigate("/taskcycle/matrix")}
        aria-current={current === "matrix" ? "page" : undefined}
      >
        Matrix
      </button>
    </div>
  );
}
