import { Head, Link, router } from '@inertiajs/react';
import FlashMessage from '@/components/flash-message';
import PaginationLinks, { type PageLink } from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import type { UserData } from '../components/user-form';

type Props = {
    users: {
        data: UserData[];
        links: PageLink[];
        from: number | null;
    };
    currentUserId: number;
};

export default function Index({ users, currentUserId }: Props) {
    function hapus(id: number) {
        if (confirm('Hapus user ini?')) {
            router.delete(`/users/${id}`, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Kelola User" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Kelola User</h1>
                    <Button asChild>
                        <Link href="/users/create">+ Tambah User</Link>
                    </Button>
                </div>

                <FlashMessage />

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="w-12 px-3 py-2">#</th>
                                <th className="px-3 py-2">Nama</th>
                                <th className="px-3 py-2">Email</th>
                                <th className="px-3 py-2">Role</th>
                                <th className="px-3 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u, i) => (
                                <tr key={u.id} className="border-t">
                                    <td className="px-3 py-2">{(users.from ?? 1) + i}</td>
                                    <td className="px-3 py-2">
                                        {u.name}
                                        {u.id === currentUserId && (
                                            <span className="ml-2 rounded bg-blue-600/10 px-1.5 py-0.5 text-xs text-blue-700 dark:text-blue-400">
                                                Anda
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">{u.email}</td>
                                    <td className="px-3 py-2">
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs ${
                                                u.role === 'admin'
                                                    ? 'bg-red-600/10 text-red-700 dark:text-red-400'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/users/${u.id}/edit`}>Ubah</Link>
                                            </Button>
                                            {u.id !== currentUserId && (
                                                <Button size="sm" variant="destructive" onClick={() => hapus(u.id)}>
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <PaginationLinks links={users.links} />
                </div>
            </div>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Kelola User', href: '/users' }] };
