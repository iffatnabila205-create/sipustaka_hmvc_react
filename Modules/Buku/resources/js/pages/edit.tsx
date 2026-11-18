import { Head } from '@inertiajs/react';
import BukuForm, { type BukuData } from '../components/buku-form';

export default function Edit({ buku }: { buku: BukuData }) {
    return (
        <>
            <Head title="Ubah Buku" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">Ubah Buku</h1>
                <BukuForm buku={buku} action={`/buku/${buku.id}`} method="put" />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Buku', href: '/buku' },
        { title: 'Ubah', href: '#' },
    ],
};
