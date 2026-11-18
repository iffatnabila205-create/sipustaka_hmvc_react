import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type BukuData = {
    id: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    stok: number;
};

type Props = {
    buku?: BukuData;
    action: string;
    method: 'post' | 'put';
};

const fields = [
    { name: 'judul', label: 'Judul', type: 'text' },
    { name: 'penulis', label: 'Penulis', type: 'text' },
    { name: 'penerbit', label: 'Penerbit', type: 'text' },
    { name: 'tahun_terbit', label: 'Tahun Terbit', type: 'number' },
    { name: 'stok', label: 'Stok', type: 'number' },
] as const;

export default function BukuForm({ buku, action, method }: Props) {
    // Form memakai useForm(): state, error validasi (422), dan status proses dikelola Inertia.
    const form = useForm({
        judul: buku?.judul ?? '',
        penulis: buku?.penulis ?? '',
        penerbit: buku?.penerbit ?? '',
        tahun_terbit: buku ? String(buku.tahun_terbit) : '',
        stok: buku ? String(buku.stok) : '',
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
            {fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                    <Label htmlFor={f.name}>{f.label}</Label>
                    <Input
                        id={f.name}
                        type={f.type}
                        value={form.data[f.name]}
                        onChange={(e) => form.setData(f.name, e.target.value)}
                        aria-invalid={!!form.errors[f.name]}
                    />
                    {form.errors[f.name] && <p className="text-sm text-destructive">{form.errors[f.name]}</p>}
                </div>
            ))}

            <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/buku">Batal</Link>
                </Button>
            </div>
        </form>
    );
}
