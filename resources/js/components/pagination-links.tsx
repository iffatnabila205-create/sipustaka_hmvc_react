import { Link } from '@inertiajs/react';

export type PageLink = { url: string | null; label: string; active: boolean };

// Label bawaan paginator Laravel berisi entitas HTML ("&laquo; Previous"); diganti simbol biasa.
function bersihkan(label: string): string {
    return label
        .replace('&laquo; Previous', '‹')
        .replace('Next &raquo;', '›')
        .replace('&laquo;', '‹')
        .replace('&raquo;', '›');
}

export default function PaginationLinks({ links }: { links: PageLink[] }) {
    // Hanya 3 link berarti Prev, 1, Next -> cukup satu halaman, tidak perlu ditampilkan.
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
            {links.map((link, i) => {
                const base = 'min-w-9 rounded-md border px-3 py-1.5 text-center text-sm';
                const text = bersihkan(link.label);

                if (!link.url) {
                    return (
                        <span key={i} className={`${base} cursor-not-allowed opacity-50`}>
                            {text}
                        </span>
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        className={`${base} ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                    >
                        {text}
                    </Link>
                );
            })}
        </nav>
    );
}
