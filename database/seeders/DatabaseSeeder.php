<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Buku\Models\Buku;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Akun admin & user (password: "password").
        // forceFill dipakai agar kolom 'role' terisi tanpa bergantung pada $fillable.
        $this->akun('admin@sipustaka.test', 'Petugas Perpustakaan', 'admin');
        $this->akun('user@sipustaka.test', 'Anggota Perpustakaan', 'user');

        // Data contoh buku (12 baris supaya pagination 10/halaman terlihat)
        if (Buku::count() === 0) {
            $data = [
                ['Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 5],
                ['Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, 3],
                ['Negeri 5 Menara', 'Ahmad Fuadi', 'Gramedia Pustaka Utama', 2009, 4],
                ['Pemrograman Web dengan Laravel', 'Budi Raharjo', 'Informatika', 2022, 6],
                ['Basis Data Relasional', 'Abdul Kadir', 'Andi Offset', 2018, 2],
                ['Algoritma dan Struktur Data', 'Rinaldi Munir', 'Informatika', 2016, 7],
                ['Dasar-Dasar Jaringan Komputer', 'Onno W. Purbo', 'Elex Media', 2015, 3],
                ['Kalkulus Jilid 1', 'Purcell', 'Erlangga', 2010, 4],
                ['Statistika untuk Analisis Data', 'Sudjana', 'Tarsito', 2012, 5],
                ['Rekayasa Perangkat Lunak', 'Roger S. Pressman', 'Andi Offset', 2015, 3],
                ['Sistem Operasi Modern', 'Andrew Tanenbaum', 'Pearson', 2014, 2],
                ['Cantik Itu Luka', 'Eka Kurniawan', 'Gramedia Pustaka Utama', 2002, 1],
            ];

            foreach ($data as [$judul, $penulis, $penerbit, $tahun, $stok]) {
                Buku::create([
                    'judul' => $judul,
                    'penulis' => $penulis,
                    'penerbit' => $penerbit,
                    'tahun_terbit' => $tahun,
                    'stok' => $stok,
                ]);
            }
        }
    }

    private function akun(string $email, string $nama, string $role): void
    {
        $user = User::firstOrNew(['email' => $email]);
        $user->forceFill([
            'name' => $nama,
            'password' => Hash::make('password'),
            'role' => $role,
            'email_verified_at' => now(),
        ])->save();
    }
}
