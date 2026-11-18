<?php

namespace Modules\Peminjaman\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Peminjaman\Http\Requests\PeminjamanRequest;
use Modules\Peminjaman\Models\Peminjaman;

class PeminjamanController extends Controller
{
    // Halaman React (hanya kerangka; data dimuat lewat fetch()).
    public function index(): Response
    {
        return Inertia::render('Peminjaman::index');
    }

    public function data(): JsonResponse
    {
        return response()->json([
            'data' => Peminjaman::orderByDesc('id')->get(),
        ]);
    }

    public function show(Peminjaman $peminjaman): JsonResponse
    {
        return response()->json(['data' => $peminjaman]);
    }

    public function store(PeminjamanRequest $request): JsonResponse
    {
        $data = $request->validated();
        unset($data['bukti']);

        if ($request->hasFile('bukti')) {
            $data['bukti'] = $request->file('bukti')->store('bukti', 'public');
        }

        $peminjaman = Peminjaman::create($data);

        return response()->json([
            'message' => 'Data peminjaman berhasil ditambahkan.',
            'data' => $peminjaman,
        ], 201);
    }

    public function update(PeminjamanRequest $request, Peminjaman $peminjaman): JsonResponse
    {
        $data = $request->validated();
        unset($data['bukti']);

        // Berkas baru menggantikan berkas lama (berkas lama dihapus dari storage).
        if ($request->hasFile('bukti')) {
            if ($peminjaman->bukti) {
                Storage::disk('public')->delete($peminjaman->bukti);
            }
            $data['bukti'] = $request->file('bukti')->store('bukti', 'public');
        }

        $peminjaman->update($data);

        return response()->json([
            'message' => 'Data peminjaman berhasil diperbarui.',
            'data' => $peminjaman->fresh(),
        ]);
    }

    public function destroy(Peminjaman $peminjaman): JsonResponse
    {
        // Hapus berkas dari storage sebelum baris database dihapus.
        if ($peminjaman->bukti) {
            Storage::disk('public')->delete($peminjaman->bukti);
        }

        $peminjaman->delete();

        return response()->json(['message' => 'Data peminjaman berhasil dihapus.']);
    }
}
