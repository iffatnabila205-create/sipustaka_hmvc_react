import { Head } from '@inertiajs/react';
import BukuForm from '../components/buku-form';

export default function Create() {
    return (
        <>
            <Head title="Tambah Buku" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">Tambah Buku</h1>
                <BukuForm action="/buku" method="post" />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Buku', href: '/buku' },
        { title: 'Tambah', href: '/buku/create' },
    ],
};
