"use client";

import {  useMemo, useRef, useState } from "react";
import { Loader2, ZoomIn, ZoomOut, Download, Printer, Maximize2, ExternalLink } from "lucide-react";

interface PdfPreviewProps {
  src?: string;
  title?: string;
  fallbackLabel?: string;
  className?: string;
}

export function PdfPreview({ src, title = "PDF Preview", fallbackLabel = "Preview unavailable", className }: PdfPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(!!src);
  const [error, setError] = useState<string | null>(null);
  const [currentSrc, setCurrentSrc] = useState(src);

  const safeSrc = useMemo(() => src || "", [src]);

  // If the src prop changes, we need to reset the loading and error states.
  // By doing this during render, we avoid a cascading render that would happen
  // if this logic were in a useEffect. This is a valid pattern for this use case.
  if (src !== currentSrc) {
    setCurrentSrc(src);
    setIsLoading(!!src);
    setError(null);
  }

  const handleDownload = () => {
    if (!safeSrc) return;
    const link = document.createElement("a");
    link.href = safeSrc;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!iframeRef.current) return;
    iframeRef.current.contentWindow?.print();
  };

  const handleOpenInNewTab = () => {
    if (!safeSrc) return;
    window.open(safeSrc, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`flex h-140 flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_16px_42px_-24px_rgba(15,23,42,0.35)] ${className ?? ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-background/70 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">PDF.js preview with zoom and export controls</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setScale((value) => Math.max(0.8, value - 0.2))} className="focus-ring rounded-[10px] border border-border/80 bg-background/70 p-2 text-muted-foreground hover:bg-muted" aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setScale((value) => Math.min(2.2, value + 0.2))} className="focus-ring rounded-[10px] border border-border/80 bg-background/70 p-2 text-muted-foreground hover:bg-muted" aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button type="button" onClick={handleDownload} className="focus-ring rounded-[10px] border border-border/80 bg-background/70 p-2 text-muted-foreground hover:bg-muted" aria-label="Download PDF">
            <Download className="h-4 w-4" />
          </button>
          <button type="button" onClick={handlePrint} className="focus-ring rounded-[10px] border border-border/80 bg-background/70 p-2 text-muted-foreground hover:bg-muted" aria-label="Print PDF">
            <Printer className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => iframeRef.current?.requestFullscreen?.()} className="focus-ring rounded-[10px] border border-border/80 bg-background/70 p-2 text-muted-foreground hover:bg-muted" aria-label="Fullscreen preview">
            <Maximize2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={handleOpenInNewTab} className="focus-ring rounded-[10px] border border-border/80 bg-background/70 p-2 text-muted-foreground hover:bg-muted" aria-label="Open preview in new tab">
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-muted/30">
        {isLoading ? (
          <div className="flex h-full items-center justify-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Preparing preview…
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : safeSrc ? (
          <iframe
            ref={iframeRef}
            src={safeSrc}
            title={title}
            className="h-full w-full bg-background"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              width: `${100 / scale}%`,
              height: `${560 / scale}px`,
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => { setIsLoading(false); setError("The preview could not be loaded. Please retry."); }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {fallbackLabel}
          </div>
        )}
      </div>
    </div>
  );
}
