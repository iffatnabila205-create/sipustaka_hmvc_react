<?php

namespace Modules\Buku\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Buku\Http\Requests\BukuRequest;
use Modules\Buku\Models\Buku;

class BukuController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $bukus = Buku::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($w) use ($q) {
                    $w->where('judul', 'like', "%{$q}%")
                      ->orWhere('penulis', 'like', "%{$q}%")
                      ->orWhere('penerbit', 'like', "%{$q}%");
                });
            })
            ->orderBy('judul')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Buku::index', [
            'bukus' => $bukus,
            'filters' => ['q' => $q],
            'canManage' => $request->user()->role === 'admin',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Buku::create');
    }

    public function store(BukuRequest $request): RedirectResponse
    {
        Buku::create($request->validated());

        return redirect('/buku')->with('success', 'Buku berhasil ditambahkan.');
    }

    public function edit(Buku $buku): Response
    {
        return Inertia::render('Buku::edit', ['buku' => $buku]);
    }

    public function update(BukuRequest $request, Buku $buku): RedirectResponse
    {
        $buku->update($request->validated());

        return redirect('/buku')->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Buku $buku): RedirectResponse
    {
        $buku->delete();

        return redirect('/buku')->with('success', 'Buku berhasil dihapus.');
    }
}
