import { useEffect, useRef, useState, type RefObject } from "react";

export type Post = {
  id: number;
  title: string;
  body: string;
  userId?: number;
};

type UseInfinitePostsResult = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  reload: () => void;
};

export function useInfinitePosts(apiBaseUrl: string, pageSize = 10): UseInfinitePostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const url = apiBaseUrl.includes("?")
          ? `${apiBaseUrl}&_page=${page}&_limit=${pageSize}`
          : `${apiBaseUrl}?_page=${page}&_limit=${pageSize}`;

        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Post[] = await res.json();

        setPosts((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const merged = prev.concat(data.filter((p) => !ids.has(p.id)));
          return merged;
        });

        setHasMore(data.length >= pageSize);
        setLoading(false);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Error al cargar publicaciones");
        setLoading(false);
      }
    };

    fetchPage();

    return () => {
      abortRef.current?.abort();
    };
  }, [page, apiBaseUrl, pageSize]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.current.observe(sentinelRef.current);

    return () => observer.current?.disconnect();
  }, [hasMore, loading]);

  const reload = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  };

  return { posts, loading, error, hasMore, sentinelRef, reload };
}
