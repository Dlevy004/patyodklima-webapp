let globalDeferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    if (window.location.pathname.startsWith('/admin')) {
        e.preventDefault();
        globalDeferredPrompt = e;
    }
});

export function usePWAInstall() {
    const isInstallable = true;

    const installPWA = async () => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        if (isStandalone) {
            alert("Az alkalmazás már telepítve van, és jelenleg is abból használod!");
            return;
        }

        if (globalDeferredPrompt) {
            try {
                globalDeferredPrompt.prompt();

                const { outcome } = await globalDeferredPrompt.userChoice;
                if (outcome === 'accepted') {

                    globalDeferredPrompt = null;
                }
            } catch (error) {
                console.error("Hiba a telepítés során:", error);
            }
        } else {
            alert(
                "Úgy tűnik, az alkalmazás már telepítve van, vagy a böngésződ nem támogatja az automatikus telepítést.\n\n" +
                "Asztali gépen: Keresd a 'Telepítés' ikont a böngésző címsorának jobb szélén!\n\n" +
                "Telefonon: Nyisd meg a böngésző beállítások menüjét, és válaszd a 'Hozzáadás a kezdőképernyőhöz' opciót!"
            );
        }
    };

    return { isInstallable, installPWA };
}