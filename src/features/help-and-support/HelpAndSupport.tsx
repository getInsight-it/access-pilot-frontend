import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import remarkAutolinkHeadings from "remark-autolink-headings";
import { List, X } from "lucide-react";
import { useToast } from "../../common/external/ui/use-toast.ts";
import { formatErrorMessages } from "../../common/utils/error-utils.ts";
import { HELP_GUIDE_PATH } from "./constants/help-constants.ts";

interface Heading {
  level: number;
  title: string;
  id: string;
}

export default function HelpAndSupport() {
  const [content, setContent] = useState<string>("");
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch(HELP_GUIDE_PATH)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((error: unknown) => {
        const errorMessage: string = formatErrorMessages(error);
        toast({
          title: "Erro ao carregar o guia",
          description: errorMessage,
          variant: "destructive"
        });
      });
  }, [toast]);

  useEffect(() => {
    const container = mainRef.current;
    if(!container) {
      setHeadings([]);
      return;
    }

    const headingEls = Array.from(container.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    const result: Heading[] = headingEls.map((el) => {
      let id = el.id;
      const title = (el.textContent || "").trim();
      if(!id) {
        id = generateSafeId(title);
        el.id = id;
      }
      const level = parseInt(el.tagName.replace("H", ""), 10) || 1;
      return { level, title, id };
    });

    setHeadings(result);
  }, [content]);

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev || "auto";
    };
  }, []);

  function generateSafeId(text: string): string {
    let id = text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if(/^\d/.test(id)) id = `h-${id}`;
    if(!id) id = `h-${Math.random().toString(36).slice(2, 8)}`;
    return id;
  }

  const handleIndexClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string): void => {
    e.preventDefault();
    const container = mainRef.current;
    if(!container) return;

    const el = container.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null;
    if(!el) return;

    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const scrollOffset = elTop - containerTop + container.scrollTop;

    container.scrollTo({ top: scrollOffset, behavior: "smooth" });

    setIsModalOpen(false);

    history.replaceState(null, "", `#${id}`);
  };

  const remarkPlugins: PluggableList = [
    remarkGfm,
    remarkSlug,
    remarkAutolinkHeadings
  ];

  return (
    <div
         style={{ height: "calc(var(--mobile-vh, 1vh) * 100)" }}>
      <main
        ref={mainRef}
        className="markdown"
      >
        <ReactMarkdown remarkPlugins={remarkPlugins}>
          {content}
        </ReactMarkdown>
      </main>

      <aside
        style={{ height: "calc(var(--mobile-vh, 1vh) * 100)" }}
      >
        <h2>Índice</h2>
        <ul>
          {headings.map((h, i) => (
            <li key={i} style={{ marginLeft: (h.level - 1) * 12 }}>
              <a
                href={`#${h.id}`}
                onClick={(e) => handleIndexClick(e, h.id)}
              >
                {h.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <button
        onClick={() => setIsModalOpen(true)}
      >
        <List />
      </button>

      {isModalOpen && (
        <div>
          <div>
            <div>
              <h2>Índice</h2>
              <button
                onClick={() => setIsModalOpen(false)}
              >
                <X />
              </button>
            </div>
            <ul>
              {headings.map((h, i) => (
                <li key={i} style={{ marginLeft: (h.level - 1) * 12 }}>
                  <a
                    href={`#${h.id}`}
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
