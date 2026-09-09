import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
    default: vi.fn()
}));


describe('usePWAInstall hook', () => {
    let usePWAInstall;

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(() => ({ matches: false })),
        });

        Object.defineProperty(window, 'navigator', {
            writable: true,
            value: { standalone: false },
        });

        Object.defineProperty(window, 'location', {
            writable: true,
            value: { pathname: '/admin' },
        });

        const module = await import('./usePWAInstall');
        usePWAInstall = module.usePWAInstall;
    });

    it('should return isInstallable as true', () => {
        const { result } = renderHook(() => usePWAInstall());
        expect(result.current.isInstallable).toBe(true);
    });

    it('should show toast and return early if app is already in standalone mode (via matchMedia)', async () => {
        window.matchMedia.mockImplementation((query) => ({
            matches: query === '(display-mode: standalone)'
        }));

        const { result } = renderHook(() => usePWAInstall());

        await act(async () => {
            await result.current.installPWA();
        });

        expect(toast).toHaveBeenCalledWith(
            "Az alkalmazás már telepítve van, és jelenleg is abból használod!",
            { duration: 3000 }
        );
    });

    it('should show toast and return early if app is already in standalone mode (via iOS navigator)', async () => {
        window.navigator.standalone = true;

        const { result } = renderHook(() => usePWAInstall());

        await act(async () => {
            await result.current.installPWA();
        });

        expect(toast).toHaveBeenCalledWith(
            "Az alkalmazás már telepítve van, és jelenleg is abból használod!",
            { duration: 3000 }
        );
    });

    it('should show fallback toast if no install prompt is available', async () => {
        const { result } = renderHook(() => usePWAInstall());

        await act(async () => {
            await result.current.installPWA();
        });

        expect(toast).toHaveBeenCalledWith(
            expect.stringContaining("Úgy tűnik, az alkalmazás már telepítve van"),
            { duration: 8000 }
        );
    });

    it('should NOT save the install prompt if event occurs on a non-admin path', async () => {
        window.location.pathname = '/fooldal';

        const event = new Event('beforeinstallprompt');
        event.preventDefault = vi.fn();
        window.dispatchEvent(event);

        const { result } = renderHook(() => usePWAInstall());

        await act(async () => {
            await result.current.installPWA();
        });

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(toast).toHaveBeenCalledWith(
            expect.stringContaining("Úgy tűnik, az alkalmazás már telepítve van"),
            expect.any(Object)
        );
    });

    it('should save prompt on /admin, trigger it, and clear it if user accepts', async () => {
        window.location.pathname = '/admin';

        const event = new Event('beforeinstallprompt');
        event.preventDefault = vi.fn();
        event.prompt = vi.fn();
        event.userChoice = Promise.resolve({ outcome: 'accepted' });

        window.dispatchEvent(event);
        expect(event.preventDefault).toHaveBeenCalled();

        const { result } = renderHook(() => usePWAInstall());

        await act(async () => {
            await result.current.installPWA();
        });

        expect(event.prompt).toHaveBeenCalledTimes(1);
        expect(toast).not.toHaveBeenCalled();

        await act(async () => {
            await result.current.installPWA();
        });

        expect(event.prompt).toHaveBeenCalledTimes(1);
        expect(toast).toHaveBeenCalledWith(
            expect.stringContaining("Úgy tűnik, az alkalmazás már telepítve van"),
            expect.any(Object)
        );
    });

    it('should catch and log errors if prompt throws an exception', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        window.location.pathname = '/admin';
        const event = new Event('beforeinstallprompt');
        event.preventDefault = vi.fn();
        event.prompt = vi.fn(() => { throw new Error('Prompt failed'); });

        window.dispatchEvent(event);

        const { result } = renderHook(() => usePWAInstall());

        await act(async () => {
            await result.current.installPWA();
        });

        expect(consoleSpy).toHaveBeenCalledWith("Hiba a telepítés során:", expect.any(Error));

        consoleSpy.mockRestore();
    });

    it('should NOT clear the prompt if the user dismisses the installation', async () => {
        window.location.pathname = '/admin';

        const event = new Event('beforeinstallprompt');
        event.preventDefault = vi.fn();
        event.prompt = vi.fn();
        event.userChoice = Promise.resolve({ outcome: 'dismissed' });

        window.dispatchEvent(event);

        const { result } = renderHook(() => usePWAInstall());

        await act(async () => {
            await result.current.installPWA();
        });

        expect(event.prompt).toHaveBeenCalledTimes(1);

        await act(async () => {
            await result.current.installPWA();
        });

        expect(event.prompt).toHaveBeenCalledTimes(2);
        expect(toast).not.toHaveBeenCalled();
    });
});