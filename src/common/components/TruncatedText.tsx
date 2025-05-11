import { useRef, useState, useEffect, FC } from "react";
import { cn } from "../../config/lib/utils";

interface TruncatedTextProps {
  text?: string;
  maxChars?: number;
  className?: string;
  fontSize?: string;
  autoManage?: boolean;
  maxLines?: number;
}

const TruncatedText: FC<TruncatedTextProps> = ({
  text = '',
  maxChars = 100,
  className = '',
  fontSize = 'text-base',
  autoManage = false,
  maxLines = 3
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const wasTruncated = useRef(false);

  const checkTruncation = () => {
    if (!textRef.current) return;

    let truncated = false;
    if (autoManage) {
      const contentHeight = textRef.current.scrollHeight;
      const containerHeight = textRef.current.clientHeight;
      truncated = contentHeight > containerHeight;
    } else {
      truncated = text.length > maxChars;
    }

    if (truncated) {
      wasTruncated.current = true;
    } else if (!showFullText) {
      wasTruncated.current = false;
    }

    setIsTruncated(truncated);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkTruncation();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [showFullText]);

  useEffect(() => {
    checkTruncation();

    if (autoManage && textRef.current) {
      let resizeTimer: number;

      const handleResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!showFullText) {
            checkTruncation();
          }
        }, 100);
      };

      resizeObserverRef.current = new ResizeObserver(handleResize);

      const parentElement = textRef.current.parentElement;
      if (parentElement) {
        resizeObserverRef.current.observe(parentElement);
      }

      window.addEventListener('resize', handleResize);

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        window.removeEventListener('resize', handleResize);
        window.clearTimeout(resizeTimer);
      };
    }
  }, [text, maxChars, autoManage, maxLines, showFullText]);

  const toggleFullText = () => {
    setShowFullText(prev => !prev);
  };

  if (!text) return null;

  const shouldShowButton = wasTruncated.current;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        ref={textRef}
        style={!showFullText && autoManage ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        } : undefined}
        className={cn(
          fontSize,
          "break-words transition-all duration-200"
        )}>
        {autoManage ? text : (showFullText ? text : (isTruncated ? `${text.substring(0, maxChars)}...` : text))}
      </div>

      {shouldShowButton && (
        <span className="text-xs text-primary cursor-pointer mt-1 block" onClick={toggleFullText}>
          {showFullText ? 'Ver menos' : 'Ver mais'}
        </span>
      )}
    </div>
  );
};

export default TruncatedText;
