import { Head } from '@inertiajs/react';
import UserForm, { type UserData } from '../components/user-form';

export default function Edit({ user, isSelf }: { user: UserData; isSelf: boolean }) {
    return (
        <>
            <Head title="Ubah User" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">Ubah User</h1>
                <UserForm user={user} isSelf={isSelf} action={`/users/${user.id}`} method="put" />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Kelola User', href: '/users' },
        { title: 'Ubah', href: '#' },
    ],
};
