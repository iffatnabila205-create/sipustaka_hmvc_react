<?php

namespace Modules\UserManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Modules\UserManagement\Http\Requests\UserRequest;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::orderBy('name')
            ->paginate(10)
            ->through(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
            ]);

        return Inertia::render('UserManagement::index', [
            'users' => $users,
            'currentUserId' => auth()->id(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('UserManagement::create');
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['email_verified_at'] = now();

        User::forceCreate($data);

        return redirect('/users')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('UserManagement::edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'isSelf' => $user->id === auth()->id(),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        // Password kosong = tidak diganti.
        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->forceFill($data)->save();

        return redirect('/users')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        // Admin tidak boleh menghapus akunnya sendiri.
        if ($user->id === auth()->id()) {
            return redirect('/users')->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect('/users')->with('success', 'User berhasil dihapus.');
    }
}
