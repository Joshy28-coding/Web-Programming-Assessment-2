// - A bit of A.I has been used for this.
// - Shared background ambience controller.
// - Faint volume (0.15) so it sits behind content
// - Off by default to avoid autoplay issues and respect user choice
// - Remembers the user's choice + playback position across pages via sessionStorage
(function () {
    const audio  = document.getElementById('ambience');
    const button = document.getElementById('ambienceToggle');
    if (!audio || !button) return;

    audio.volume = 0.25; // faint

    const KEY_ON  = 'ambience:on';
    const KEY_POS = 'ambience:pos';

    // Resume from where the previous page left off
    const savedPos = parseFloat(sessionStorage.getItem(KEY_POS) || '0');
    if (!Number.isNaN(savedPos)) audio.currentTime = savedPos;

    function setUI(playing) {
        button.setAttribute('aria-pressed', String(playing));
        button.setAttribute('aria-label', playing ? 'Mute background music' : 'Play background music');
        button.firstElementChild.textContent = playing ? '🔊' : '🔇';
    }

    function play() {
        audio.play().then(() => {
            sessionStorage.setItem(KEY_ON, '1');
            setUI(true);
        }).catch(() => setUI(false)); // autoplay blocked — wait for click
    }

    function pause() {
        audio.pause();
        sessionStorage.setItem(KEY_ON, '0');
        setUI(false);
    }

    button.addEventListener('click', () => {
        if (audio.paused) play(); else pause();
    });

    // Persist position so the next page continues seamlessly
    setInterval(() => {
        if (!audio.paused) sessionStorage.setItem(KEY_POS, String(audio.currentTime));
    }, 500);
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem(KEY_POS, String(audio.currentTime));
    });

    // If the user already enabled it on a previous page, try to resume
    if (sessionStorage.getItem(KEY_ON) === '1') play();
    else setUI(false);
})();

/* Thank you for viewing my code! I had fun seeing it come to life! Not so much when things do not work and under pressure lol */
/* Josh C. Was here */