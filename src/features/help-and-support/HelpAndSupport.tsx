import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import remarkAutolinkHeadings from "remark-autolink-headings";
import { X, List } from "lucide-react";

export default function HelpAndSupport() {
  const [content, setContent] = useState("");
  const [headings, setHeadings] = useState<{ level: number; title: string; id: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/assets/app-guide/Guia-do-Usuário.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => console.error("Erro ao carregar o guia:", err));
  }, []);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) {
      setHeadings([]);
      return;
    }

    const headingEls = Array.from(container.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    const result = headingEls.map((el) => {
      let id = el.id;
      const title = (el.textContent || "").trim();
      if (!id) {
        id = generateSafeId(title);
        el.id = id;
      }
      const level = parseInt(el.tagName.replace("H", ""), 10) || 1;
      return { level, title, id };
    });

    setHeadings(result);
  }, [content]);

  // Mantém scroll suave
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev || "auto";
    };
  }, []);

  function generateSafeId(text: string) {
    let id = text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (/^\d/.test(id)) id = `h-${id}`;
    if (!id) id = `h-${Math.random().toString(36).slice(2, 8)}`;
    return id;
  }

  const handleIndexClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const container = mainRef.current;
    if (!container) return;

    const el = container.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null;
    if (!el) return;

    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const scrollOffset = elTop - containerTop + container.scrollTop;

    container.scrollTo({ top: scrollOffset, behavior: "smooth" });

    setIsModalOpen(false); // ✅ fecha modal ao clicar
    try {
      history.replaceState(null, "", `#${id}`);
    } catch {}
  };

  return (
    <div className="flex h-dvh md:h-screen overflow-hidden relative" style={{ height: 'calc(var(--mobile-vh, 1vh) * 100)' }}>
      {/* Conteúdo Markdown */}
      <main
        ref={mainRef}
        className="markdown flex-1 overflow-y-auto prose prose-a:text-blue-600 px-4 pb-20"
      >
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm as any,
            remarkSlug as any,
            remarkAutolinkHeadings as any,
          ]}
        >
          {content}
        </ReactMarkdown>
      </main>

      {/* Índice lateral (desktop) */}
      <aside className="hidden md:block w-64 border-l border-gray-200 p-4 overflow-y-auto sticky top-0 h-dvh md:h-screen" style={{ height: 'calc(var(--mobile-vh, 1vh) * 100)' }}>
        <h2 className="text-lg font-semibold mb-3">Índice</h2>
        <ul className="space-y-1 text-sm">
          {headings.map((h, i) => (
            <li key={i} style={{ marginLeft: (h.level - 1) * 12 }}>
              <a
                href={`#${h.id}`}
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={(e) => handleIndexClick(e, h.id)}
              >
                {h.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Botão flutuante para abrir índice no mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 mr-1 rounded-full shadow-lg z-50"
      >
        <List className="w-5 h-5" />
      </button>

      {/* Modal do índice (mobile) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-h-[80vh] rounded-t-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Índice</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {headings.map((h, i) => (
                <li key={i} style={{ marginLeft: (h.level - 1) * 12 }}>
                  <a
                    href={`#${h.id}`}
                    className="text-blue-600 hover:underline cursor-pointer block py-1"
                    onClick={(e) => handleIndexClick(e, h.id)}
                  >
                    {h.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
