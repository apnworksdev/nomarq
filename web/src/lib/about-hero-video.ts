const EMBED_SELECTOR = '[data-about-hero-embed]';
const PLAYING_CLASS = 'is-playing';
/** Reveal anyway if the player never reports playback (blocked API, old browser…). */
const FALLBACK_REVEAL_MS = 8000;

type PlayerMessage = {
  event?: string;
  data?: { seconds?: number };
  info?: { playerState?: number; currentTime?: number };
};

function parseMessage(data: unknown): PlayerMessage | null {
  if (typeof data === 'object' && data !== null) {
    return data as PlayerMessage;
  }

  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as PlayerMessage;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Keeps the hero iframe hidden (opacity 0) until the provider reports that
 * frames are actually playing, so the Vimeo/YouTube loading spinner is never
 * visible. Then the video fades in over the dark hero background.
 */
export function initAboutHeroVideo() {
  const iframe = document.querySelector<HTMLIFrameElement>(EMBED_SELECTOR);

  if (!iframe) {
    return;
  }

  const provider = iframe.dataset.aboutHeroEmbed;
  const origin = new URL(iframe.src).origin;
  let revealed = false;

  const reveal = () => {
    if (revealed) {
      return;
    }
    revealed = true;
    iframe.classList.add(PLAYING_CLASS);
    window.removeEventListener('message', onMessage);
    window.clearTimeout(fallback);
  };

  const post = (message: object) => {
    iframe.contentWindow?.postMessage(JSON.stringify(message), origin);
  };

  const onMessage = (event: MessageEvent) => {
    if (event.source !== iframe.contentWindow) {
      return;
    }

    const message = parseMessage(event.data);

    if (!message) {
      return;
    }

    if (provider === 'vimeo') {
      if (message.event === 'ready') {
        post({ method: 'addEventListener', value: 'timeupdate' });
        post({ method: 'addEventListener', value: 'playProgress' });
        return;
      }

      if (
        (message.event === 'timeupdate' || message.event === 'playProgress') &&
        (message.data?.seconds ?? 0) > 0
      ) {
        reveal();
      }
      return;
    }

    if (provider === 'youtube') {
      const info = message.info;
      if (info && (info.playerState === 1 || (info.currentTime ?? 0) > 0)) {
        reveal();
      }
    }
  };

  window.addEventListener('message', onMessage);
  const fallback = window.setTimeout(reveal, FALLBACK_REVEAL_MS);

  if (provider === 'youtube') {
    // YouTube only starts posting state once a "listening" handshake is sent.
    const listen = () => post({ event: 'listening', id: 'about-hero' });
    iframe.addEventListener('load', listen);
    listen();
  }
}
