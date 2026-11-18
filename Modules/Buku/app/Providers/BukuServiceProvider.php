<?php

namespace Modules\Buku\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class BukuServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/../../database/migrations');

        // Dibungkus middleware 'web' agar session, CSRF, dan Inertia aktif.
        Route::middleware('web')->group(__DIR__.'/../../routes/web.php');
    }
}
