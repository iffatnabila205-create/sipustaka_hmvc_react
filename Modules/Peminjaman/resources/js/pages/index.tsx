import { Head } from '@inertiajs/react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Status = 'Dipinjam' | 'Dikembalikan';

type Peminjaman = {
    id: number;
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    status: Status;
    bukti: string | null;
    bukti_url: string | null;
};

type Values = {
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    status: Status;
};

type Errors = Partial<Record<keyof Values | 'bukti', string[]>>;
type Message = { type: 'success' | 'error'; text: string } | null;

const BASE = '/peminjaman';

const kosong: Values = {
    nama_peminjam: '',
    judul_buku: '',
    tanggal_pinjam: '',
    tanggal_kembali: '',
    status: 'Dipinjam',
};

const selectClass = 'border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs';

// Laravel menyimpan token CSRF di cookie XSRF-TOKEN; fetch() mengirimnya lewat header X-XSRF-TOKEN.
function xsrfToken(): string {
    const m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    return m ? decodeURIComponent(m[1]) : '';
}

// Pembungkus fetch(). Header Accept: application/json membuat Laravel membalas error validasi dengan 422 JSON.
async function api(url: string, options: RequestInit = {}) {
    const res = await fetch(url, {
        credentials: 'same-origin',
        ...options,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
}

export default function Index() {
    const [rows, setRows] = useState<Peminjaman[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<Message>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [values, setValues] = useState<Values>(kosong);
    const [buktiLama, setBuktiLama] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);

    const muat = useCallback(async () => {
        const { ok, json } = await api(`${BASE}/data`);
        if (ok) {
            setRows(json.data as Peminjaman[]);
        } else {
            setMessage({ type: 'error', text: 'Gagal memuat data peminjaman.' });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        void muat();
    }, [muat]);

    function bukaTambah() {
        setEditingId(null);
        setValues(kosong);
        setBuktiLama(null);
        setFile(null);
        setErrors({});
        setModalOpen(true);
    }

    async function bukaUbah(id: number) {
        const { ok, json } = await api(`${BASE}/${id}`);
        if (!ok) {
            setMessage({ type: 'error', text: 'Data tidak ditemukan.' });
            return;
        }
        const d = json.data as Peminjaman;
        setEditingId(d.id);
        setValues({
            nama_peminjam: d.nama_peminjam,
            judul_buku: d.judul_buku,
            tanggal_pinjam: d.tanggal_pinjam,
            tanggal_kembali: d.tanggal_kembali,
            status: d.status,
        });
        setBuktiLama(d.bukti_url);
        setFile(null);
        setErrors({});
        setModalOpen(true);
    }

    async function simpan(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const fd = new FormData();
        (Object.keys(values) as (keyof Values)[]).forEach((k) => fd.append(k, values[k]));
        if (file) {
            fd.append('bukti', file);
        }

        let url = BASE;
        if (editingId !== null) {
            url = `${BASE}/${editingId}`;
            fd.append('_method', 'PUT'); // FormData + berkas harus lewat POST; Laravel membaca _method
        }

        const { ok, status, json } = await api(url, { method: 'POST', body: fd });
        setSaving(false);

        if (status === 422) {
            setErrors((json.errors ?? {}) as Errors);
            return;
        }
        if (!ok) {
            setMessage({ type: 'error', text: json.message ?? 'Terjadi kesalahan pada server.' });
            return;
        }

        setModalOpen(false);
        setMessage({ type: 'success', text: json.message as string });
        await muat();
    }

    async function hapus(id: number) {
        if (!confirm('Hapus data peminjaman ini?')) {
            return;
        }
        const { ok, json } = await api(`${BASE}/${id}`, { method: 'DELETE' });
        if (!ok) {
            setMessage({ type: 'error', text: json.message ?? 'Gagal menghapus data.' });
            return;
        }
        setMessage({ type: 'success', text: json.message as string });
        await muat();
    }

    function ubahNilai<K extends keyof Values>(key: K, value: Values[K]) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    const galat = (key: keyof Errors) =>
        errors[key]?.[0] ? <p className="text-sm text-destructive">{errors[key]?.[0]}</p> : null;

    return (
        <>
            <Head title="Peminjaman" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Data Peminjaman</h1>
                    <Button onClick={bukaTambah}>+ Tambah Peminjaman</Button>
                </div>

                {message && (
                    <div
                        role={message.type === 'error' ? 'alert' : 'status'}
                        className={`mb-4 flex items-start justify-between rounded-md border px-4 py-3 text-sm ${
                            message.type === 'success'
                                ? 'border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-400'
                                : 'border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-400'
                        }`}
                    >
                        <span>{message.text}</span>
                        <button type="button" onClick={() => setMessage(null)} aria-label="Tutup" className="ml-4">
                            ×
                        </button>
                    </div>
                )}

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="w-12 px-3 py-2">#</th>
                                <th className="px-3 py-2">Nama Peminjam</th>
                                <th className="px-3 py-2">Judul Buku</th>
                                <th className="px-3 py-2">Tgl Pinjam</th>
                                <th className="px-3 py-2">Tgl Kembali</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Bukti</th>
                                <th className="px-3 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                                        Memuat data...
                                    </td>
                                </tr>
                            )}
                            {!loading && rows.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                                        Belum ada data peminjaman.
                                    </td>
                                </tr>
                            )}
                            {rows.map((r, i) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-3 py-2">{i + 1}</td>
                                    <td className="px-3 py-2">{r.nama_peminjam}</td>
                                    <td className="px-3 py-2">{r.judul_buku}</td>
                                    <td className="px-3 py-2">{r.tanggal_pinjam}</td>
                                    <td className="px-3 py-2">{r.tanggal_kembali}</td>
                                    <td className="px-3 py-2">
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs ${
                                                r.status === 'Dikembalikan'
                                                    ? 'bg-green-600/10 text-green-700 dark:text-green-400'
                                                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                                            }`}
                                        >
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {r.bukti_url ? (
                                            <a
                                                href={r.bukti_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                            >
                                                Lihat berkas
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => void bukaUbah(r.id)}>
                                                Ubah
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => void hapus(r.id)}>
                                                Hapus
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <form
                        onSubmit={(e) => void simpan(e)}
                        noValidate
                        className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-lg bg-background p-6 shadow-lg"
                    >
                        <h2 className="text-lg font-semibold">
                            {editingId === null ? 'Tambah Peminjaman' : 'Ubah Peminjaman'}
                        </h2>

                        <div className="space-y-1.5">
                            <Label htmlFor="nama_peminjam">Nama Peminjam</Label>
                            <Input
                                id="nama_peminjam"
                                value={values.nama_peminjam}
                                onChange={(e) => ubahNilai('nama_peminjam', e.target.value)}
                            />
                            {galat('nama_peminjam')}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="judul_buku">Judul Buku</Label>
                            <Input
                                id="judul_buku"
                                value={values.judul_buku}
                                onChange={(e) => ubahNilai('judul_buku', e.target.value)}
                            />
                            {galat('judul_buku')}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="tanggal_pinjam">Tanggal Pinjam</Label>
                                <Input
                                    id="tanggal_pinjam"
                                    type="date"
                                    value={values.tanggal_pinjam}
                                    onChange={(e) => ubahNilai('tanggal_pinjam', e.target.value)}
                                />
                                {galat('tanggal_pinjam')}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="tanggal_kembali">Tanggal Kembali</Label>
                                <Input
                                    id="tanggal_kembali"
                                    type="date"
                                    value={values.tanggal_kembali}
                                    onChange={(e) => ubahNilai('tanggal_kembali', e.target.value)}
                                />
                                {galat('tanggal_kembali')}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className={selectClass}
                                value={values.status}
                                onChange={(e) => ubahNilai('status', e.target.value as Status)}
                            >
                                <option value="Dipinjam">Dipinjam</option>
                                <option value="Dikembalikan">Dikembalikan</option>
                            </select>
                            {galat('status')}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="bukti">Foto Bukti Peminjaman (jpg/png/pdf, maks 2 MB)</Label>
                            <Input
                                id="bukti"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                            {galat('bukti')}
                            {editingId !== null && (
                                <p className="text-xs text-muted-foreground">
                                    {buktiLama ? (
                                        <>
                                            Berkas saat ini:{' '}
                                            <a
                                                href={buktiLama}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                            >
                                                lihat
                                            </a>
                                            . Pilih berkas baru untuk menggantinya.
                                        </>
                                    ) : (
                                        'Belum ada berkas.'
                                    )}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Peminjaman', href: '/peminjaman' }] };
