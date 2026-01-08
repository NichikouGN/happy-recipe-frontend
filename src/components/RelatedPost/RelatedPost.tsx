import { formatConsoleError } from "../../consoleError";
import type { FullPostStructure } from "../../types/PostType";
import { useEffect, useState, useRef } from "react";
import styles from "./RelatedPost.module.css";
import { useNavigate } from "react-router-dom";

export const RelatedPost = ({ detailedPost }: { detailedPost: FullPostStructure }) => {
    const [relatedPosts, setRelatedPosts] = useState<FullPostStructure[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const fetchRelatedPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/posts/related/${detailedPost.postId}?page=1&limit=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch related posts");
            }

            const data = await res.json();
            // The API may return { posts: [...] } or a bare array
            const posts = Array.isArray(data) ? data : (data?.posts ?? []);
            setRelatedPosts(posts);
        } catch (err) {
            setError("Failed to load related posts");
            formatConsoleError("RelatedPost.tsx", "fetchRelatedPosts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRelatedPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailedPost.postId]);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        const updateNavState = () => {
            const atStart = el.scrollLeft <= 0;
            const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
            setCanPrev(!atStart);
            setCanNext(!atEnd);
        };

        updateNavState();
        el.addEventListener("scroll", updateNavState, { passive: true });
        const ro = new ResizeObserver(updateNavState);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", updateNavState as any);
            ro.disconnect();
        };
    }, [relatedPosts.length]);

    const handlePrev = () => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
    };

    const handleNext = () => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    };

    const handleOpenPost = (postId: string) => {
        // Adjust route as needed to match your router.
        navigate(`/post/${postId}`);
    };

    if (loading) {
        return (
            <section className={styles.wrapper} aria-label="Related posts">
                <div className={styles.headerRow}>
                    <h3 className={styles.title}>Related Posts</h3>
                </div>
                <div className={styles.scroller}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`${styles.card} ${styles.skeleton}`}></div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.wrapper} aria-label="Related posts">
                <div className={styles.headerRow}>
                    <h3 className={styles.title}>Related Posts</h3>
                </div>
                <p className={styles.message}>Unable to load related posts.</p>
            </section>
        );
    }

    if (!relatedPosts || relatedPosts.length === 0) {
        return null;
    }

    return (
        <section className={styles.wrapper} aria-label="Related posts">
            <div className={styles.headerRow}>
                <h3 className={styles.title}>Related Posts</h3>
                <div className={styles.controls}>
                    <button
                        type="button"
                        className={styles.navBtn}
                        onClick={handlePrev}
                        aria-label="Previous"
                        disabled={!canPrev}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button
                        type="button"
                        className={styles.navBtn}
                        onClick={handleNext}
                        aria-label="Next"
                        disabled={!canNext}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className={styles.scroller} ref={scrollerRef}>
                {relatedPosts.map((post) => (
                    <article key={post.postId} className={styles.card}>
                        <button
                            className={styles.cardBody}
                            type="button"
                            onClick={() => handleOpenPost(post.postId)}
                        >
                            <div className={styles.cardHeader}>
                                <h4 className={styles.cardTitle}>{post.title}</h4>
                            </div>
                            <p className={styles.cardDesc}>{post.description ?? ""}</p>
                            <div className={styles.metaRow}>
                                {typeof post.cookTime === "number" && (
                                    <span className={styles.meta} title="Cook time">
                                        <svg className={styles.metaIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                                        </svg>
                                        {post.cookTime} min
                                    </span>
                                )}
                                <span className={`${styles.badge} ${styles[post.difficulty]}`}>{post.difficulty}</span>
                                {typeof post.servings === "number" && (
                                    <span className={styles.meta} title="Servings">
                                        <svg className={styles.metaIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                            <path d="M7 7a3 3 0 116 0v2a3 3 0 11-6 0V7zM4 19a4 4 0 014-4h4a4 4 0 014 4v1H4v-1z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        {post.servings} servings
                                    </span>
                                )}
                            </div>
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
};
