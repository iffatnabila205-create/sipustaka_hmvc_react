import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Halaman bawaan starter kit: resources/js/pages/**
const corePages = import.meta.glob('./pages/**/*.tsx');

// Halaman modul: Modules/{Nama}/resources/js/pages/**
const modulePages = import.meta.glob(
    '../../Modules/*/resources/js/pages/**/*.tsx',
);

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        // Format modul: 'Buku::index' -> Modules/Buku/resources/js/pages/index.tsx
        if (name.includes('::')) {
            const [module, page] = name.split('::');
            const path = `../../Modules/${module}/resources/js/pages/${page}.tsx`;
            const loader = modulePages[path];

            if (!loader) {
                throw new Error(`Halaman modul tidak ditemukan: ${path}`);
            }

            return loader() as Promise<never>;
        }

        const path = `./pages/${name}.tsx`;
        const loader = corePages[path];

        if (!loader) {
            throw new Error(`Halaman tidak ditemukan: ${path}`);
        }

        return loader() as Promise<never>;
    },
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
            case name.startsWith('teams/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();