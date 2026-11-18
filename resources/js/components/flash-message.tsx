import { usePage } from '@inertiajs/react';

type Flash = { success?: string | null; error?: string | null };

// Menampilkan pesan berhasil/gagal dari session flash (dibagikan lewat HandleInertiaRequests).
export default function FlashMessage() {
    const { flash } = usePage<{ flash?: Flash }>().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div className="mb-4 space-y-2">
            {flash?.success && (
                <div role="status" className="rounded-md border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div role="alert" className="rounded-md border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
