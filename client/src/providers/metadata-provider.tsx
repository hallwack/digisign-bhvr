import createDOMPurify from "dompurify";
import React from "react";
import { useLocation } from "react-router";

const DOMPurify = createDOMPurify(window);

export interface CustomMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  viewport?: string;
  canonicalUrl?: string;
  themeColor?: string;
  favicon?: string;

  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;

  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCreator?: string;
  twitterSite?: string;
}

type MetadataContextType = {
  setMetadata: (metadata: Partial<CustomMetadataProps>) => void;
  currentMetadata: CustomMetadataProps;
};

const MetadataContext = React.createContext<MetadataContextType | null>(null);

export function useMetadata() {
  const context = React.useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
}

const DEFAULT_METADATA: CustomMetadataProps = {
  title: "My App",
  description: "A modern web application",
  keywords: ["web", "app", "react"],
  author: "Your Name",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  canonicalUrl: "",
  themeColor: "#000000",
  favicon: "/src/assets/beaver.svg",
  ogTitle: "My App",
  ogDescription: "A modern web application",
  ogImage: "/og-image.png",
  ogType: "website",
  ogUrl: "",
  twitterCard: "summary_large_image",
  twitterTitle: "My App",
  twitterDescription: "A modern web application",
  twitterImage: "/twitter-image.png",
  twitterCreator: "@username",
  twitterSite: "@username",
};

export function MetadataProvider({
  children,
  defaultMetadata = {},
}: {
  children: React.ReactNode;
  defaultMetadata?: Partial<CustomMetadataProps>;
}) {
  const [dynamicMetadata, setDynamicMetadata] = React.useState<
    Partial<CustomMetadataProps>
  >({});

  const setMetadata = React.useCallback(
    (metadata: Partial<CustomMetadataProps>) => {
      setDynamicMetadata((prev) => {
        const hasChanges = Object.entries(metadata).some(
          ([key, value]) => prev[key as keyof CustomMetadataProps] !== value,
        );
        return hasChanges ? { ...prev, ...metadata } : prev;
      });
    },
    [],
  );

  const currentMetadata = React.useMemo(
    () => ({
      ...DEFAULT_METADATA,
      ...defaultMetadata,
      ...dynamicMetadata,
    }),
    [defaultMetadata, dynamicMetadata],
  );

  const value = React.useMemo(
    () => ({
      setMetadata,
      currentMetadata,
    }),
    [setMetadata, currentMetadata],
  );

  return (
    <MetadataContext.Provider value={value}>
      <MetadataManager metadata={currentMetadata} />
      {children}
    </MetadataContext.Provider>
  );
}

// Utility functions
const sanitizeContent = (content: string | undefined): string => {
  if (!content) return "";
  return DOMPurify.sanitize(String(content), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    if (url.startsWith("/")) return true;
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      !url.startsWith("//") &&
      !url.match(/^(data|javascript|vbscript|file):/i)
    );
  } catch {
    return false;
  }
};

const sanitizeUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (!isValidUrl(url)) return "";
  return DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// Main metadata manager component
function MetadataManager({ metadata }: { metadata: CustomMetadataProps }) {
  const location = useLocation();
  const previousPathRef = React.useRef(location.pathname);
  const metadataRef = React.useRef<(HTMLMetaElement | HTMLLinkElement)[]>([]);
  const faviconRef = React.useRef<HTMLLinkElement[]>([]);
  const prevMetadataRef = React.useRef<CustomMetadataProps | null>(null);

  const shouldUpdate = React.useMemo(() => {
    if (!prevMetadataRef.current) {
      prevMetadataRef.current = metadata;
      return true;
    }
    const hasChanges = Object.entries(metadata).some(
      ([key, value]) =>
        prevMetadataRef.current?.[key as keyof CustomMetadataProps] !== value,
    );
    if (hasChanges) {
      prevMetadataRef.current = metadata;
    }
    return hasChanges;
  }, [metadata]);

  const cleanup = React.useCallback(() => {
    metadataRef.current.forEach((tag) => tag.remove());
    metadataRef.current = [];

    faviconRef.current.forEach((tag) => tag.remove());
    faviconRef.current = [];
  }, []);

  const setMetaTag = React.useCallback(
    (name: string, content: string | undefined, property?: string) => {
      if (!content) return null;

      const contentToUse = property?.includes("image")
        ? sanitizeUrl(content)
        : sanitizeContent(content);
      if (!contentToUse) return null;

      const nameToUse = sanitizeContent(name);
      const propertyToUse = property ? sanitizeContent(property) : "";

      const selector = property
        ? `meta[property="${propertyToUse}"]`
        : `meta[name="${nameToUse}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement("meta");
        if (property) {
          meta.setAttribute("property", propertyToUse);
        } else {
          meta.setAttribute("name", nameToUse);
        }
        document.head.appendChild(meta);
        metadataRef.current.push(meta);
      }

      const currentContent = meta.getAttribute("content");
      if (currentContent !== contentToUse) {
        meta.setAttribute("content", contentToUse);
      }

      return meta;
    },
    [],
  );

  const updateFavicon = React.useCallback((faviconUrl: string) => {
    try {
      faviconRef.current.forEach((tag) => tag.remove());
      faviconRef.current = [];

      document.querySelectorAll('link[rel*="icon"]').forEach((el) => {
        if (!faviconRef.current.includes(el as HTMLLinkElement)) {
          el.remove();
        }
      });

      if (isValidUrl(faviconUrl)) {
        const sanitizedUrl = sanitizeUrl(faviconUrl);
        if (!sanitizedUrl) return;

        const link = document.createElement("link");
        link.rel = "icon";
        link.href = sanitizedUrl;
        document.head.appendChild(link);
        faviconRef.current.push(link);

        const appleLink = document.createElement("link");
        appleLink.rel = "apple-touch-icon";
        appleLink.href = sanitizedUrl;
        document.head.appendChild(appleLink);
        faviconRef.current.push(appleLink);
      }
    } catch (error) {
      console.error("Error updating favicon:", error);
    }
  }, []);

  React.useEffect(() => {
    const currentPath = location.pathname;

    if (previousPathRef.current !== currentPath) {
      cleanup();
      previousPathRef.current = currentPath;
    }

    if (!shouldUpdate) return;

    // Update title
    const title = sanitizeContent(metadata.title);
    if (document.title !== title) {
      document.title = title;
    }

    // Update basic meta tags
    setMetaTag("description", metadata.description);
    setMetaTag("keywords", metadata.keywords?.map(sanitizeContent).join(", "));
    setMetaTag("author", metadata.author);
    setMetaTag("robots", metadata.robots);
    setMetaTag("viewport", metadata.viewport);
    setMetaTag("theme-color", metadata.themeColor);

    // Update canonical URL
    if (isValidUrl(metadata.canonicalUrl)) {
      let link = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        document.head.appendChild(link);
        metadataRef.current.push(link);
      }
      link.rel = "canonical";
      link.href = sanitizeUrl(metadata.canonicalUrl) || "";
    }

    // Update Open Graph tags
    setMetaTag("og:title", metadata.ogTitle, "og:title");
    setMetaTag("og:description", metadata.ogDescription, "og:description");
    if (isValidUrl(metadata.ogImage)) {
      setMetaTag("og:image", metadata.ogImage, "og:image");
      setMetaTag(
        "og:image:secure_url",
        metadata.ogImage,
        "og:image:secure_url",
      );
    }
    setMetaTag("og:type", metadata.ogType, "og:type");
    if (isValidUrl(metadata.ogUrl)) {
      setMetaTag("og:url", metadata.ogUrl, "og:url");
    }

    // Update Twitter tags
    setMetaTag("twitter:card", metadata.twitterCard);
    setMetaTag("twitter:title", metadata.twitterTitle);
    setMetaTag("twitter:description", metadata.twitterDescription);
    if (isValidUrl(metadata.twitterImage)) {
      setMetaTag("twitter:image", metadata.twitterImage);
    }
    setMetaTag("twitter:creator", metadata.twitterCreator);
    setMetaTag("twitter:site", metadata.twitterSite);

    // Update favicon
    if (metadata.favicon) {
      updateFavicon(metadata.favicon);
    }

    return cleanup;
  }, [
    shouldUpdate,
    location.pathname,
    cleanup,
    setMetaTag,
    updateFavicon,
    metadata,
  ]);

  // Add manifest link
  React.useEffect(() => {
    let manifestLink = document.querySelector(
      'link[rel="manifest"]',
    ) as HTMLLinkElement | null;
    if (!manifestLink) {
      manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      manifestLink.href = "/manifest.json";
      document.head.appendChild(manifestLink);
      metadataRef.current.push(manifestLink);
    }
  }, []);

  return null;
}

// Hook for setting metadata on specific pages
export function usePageMetadata(metadata: Partial<CustomMetadataProps>) {
  const { setMetadata } = useMetadata();

  React.useEffect(() => {
    setMetadata(metadata);

    // Cleanup on unmount
    return () => {
      setMetadata({});
    };
  }, [setMetadata, metadata]);
}

// HOC for setting metadata on routes
export function withMetadata<P extends object>(
  Component: React.ComponentType<P>,
  metadata: Partial<CustomMetadataProps>,
) {
  return function WrappedComponent(props: P) {
    usePageMetadata(metadata);
    return <Component {...props} />;
  };
}
