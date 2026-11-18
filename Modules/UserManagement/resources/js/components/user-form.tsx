import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type UserData = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
};

type Props = {
    user?: UserData;
    isSelf?: boolean;
    action: string;
    method: 'post' | 'put';
};

const selectClass =
    'border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-60';

export default function UserForm({ user, isSelf = false, action, method }: Props) {
    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'user',
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        if (method === 'put') {
            form.put(action);
        } else {
            form.post(action);
        }
    }

    return (
        <form onSubmit={submit} className="max-w-xl space-y-4" noValidate>
            <div className="space-y-1.5">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                />
                {form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                {/* Pada akun sendiri select dikunci; nilai 'admin' tetap terkirim dari state useForm. */}
                <select
                    id="role"
                    className={selectClass}
                    value={form.data.role}
                    disabled={isSelf}
                    onChange={(e) => form.setData('role', e.target.value as 'admin' | 'user')}
                >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                {isSelf && (
                    <p className="text-xs text-muted-foreground">Role akun Anda sendiri tidak dapat diturunkan.</p>
                )}
                {form.errors.role && <p className="text-sm text-destructive">{form.errors.role}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="password">
                    Password {user && <span className="text-muted-foreground">(kosongkan jika tidak diganti)</span>}
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                />
                {form.errors.password && <p className="text-sm text-destructive">{form.errors.password}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                <Input
                    id="password_confirmation"
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                />
            </div>

            <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/users">Batal</Link>
                </Button>
            </div>
        </form>
    );
}
