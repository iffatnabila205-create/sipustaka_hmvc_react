import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import FlashMessage from '@/components/flash-message';
import PaginationLinks, { type PageLink } from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BukuData } from '../components/buku-form';

type Paginated<T> = {
    data: T[];
    links: PageLink[];
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    bukus: Paginated<BukuData>;
    filters: { q: string };
    canManage: boolean;
};

export default function Index({ bukus, filters, canManage }: Props) {
    const [q, setQ] = useState(filters.q ?? '');

    function cari(e: FormEvent) {
        e.preventDefault();
        router.get('/buku', { q }, { preserveState: true, replace: true });
    }

    function reset() {
        setQ('');
        router.get('/buku', {}, { preserveState: true, replace: true });
    }

    function hapus(id: number) {
        if (confirm('Hapus buku ini?')) {
            router.delete(`/buku/${id}`, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Daftar Buku" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Daftar Buku</h1>
                    {canManage && (
                        <Button asChild>
                            <Link href="/buku/create">+ Tambah Buku</Link>
                        </Button>
                    )}
                </div>

                <FlashMessage />

                <form onSubmit={cari} className="mb-4 flex max-w-xl gap-2">
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari judul, penulis, atau penerbit..."
                    />
                    <Button type="submit" variant="secondary">
                        Cari
                    </Button>
                    {filters.q && (
                        <Button type="button" variant="outline" onClick={reset}>
                            Reset
                        </Button>
                    )}
                </form>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="w-12 px-3 py-2">#</th>
                                <th className="px-3 py-2">Judul</th>
                                <th className="px-3 py-2">Penulis</th>
                                <th className="px-3 py-2">Penerbit</th>
                                <th className="px-3 py-2">Tahun</th>
                                <th className="px-3 py-2">Stok</th>
                                {canManage && <th className="px-3 py-2 text-right">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bukus.data.length === 0 && (
                                <tr>
                                    <td colSpan={canManage ? 7 : 6} className="px-3 py-6 text-center text-muted-foreground">
                                        Tidak ada data buku.
                                    </td>
                                </tr>
                            )}
                            {bukus.data.map((b, i) => (
                                <tr key={b.id} className="border-t">
                                    <td className="px-3 py-2">{(bukus.from ?? 1) + i}</td>
                                    <td className="px-3 py-2">{b.judul}</td>
                                    <td className="px-3 py-2">{b.penulis}</td>
                                    <td className="px-3 py-2">{b.penerbit}</td>
                                    <td className="px-3 py-2">{b.tahun_terbit}</td>
                                    <td className="px-3 py-2">{b.stok}</td>
                                    {canManage && (
                                        <td className="px-3 py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/buku/${b.id}/edit`}>Ubah</Link>
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => hapus(b.id)}>
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan {bukus.from ?? 0}–{bukus.to ?? 0} dari {bukus.total} buku
                    </p>
                    <PaginationLinks links={bukus.links} />
                </div>
            </div>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Buku', href: '/buku' }] };
