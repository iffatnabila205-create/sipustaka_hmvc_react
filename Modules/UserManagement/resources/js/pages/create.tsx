import { Head } from '@inertiajs/react';
import UserForm from '../components/user-form';

export default function Create() {
    return (
        <>
            <Head title="Tambah User" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">Tambah User</h1>
                <UserForm action="/users" method="post" />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Kelola User', href: '/users' },
        { title: 'Tambah', href: '/users/create' },
    ],
};
