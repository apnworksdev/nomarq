type VideoEmbed = {
  type: 'youtube' | 'vimeo';
  src: string;
};

function getYouTubeId(url: URL): string | null {
  if (url.hostname.includes('youtu.be')) {
    return url.pathname.slice(1) || null;
  }

  if (url.hostname.includes('youtube.com')) {
    return url.searchParams.get('v') ?? url.pathname.split('/').pop() ?? null;
  }

  return null;
}

function getVimeoId(url: URL): string | null {
  if (!url.hostname.includes('vimeo.com')) {
    return null;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  const id = segments.at(-1);

  return id && /^\d+$/.test(id) ? id : null;
}

export function getVideoEmbed(url: string): VideoEmbed | null {
  try {
    const parsed = new URL(url);
    const youtubeId = getYouTubeId(parsed);

    if (youtubeId) {
      const params = new URLSearchParams({
        autoplay: '1',
        mute: '1',
        loop: '1',
        playlist: youtubeId,
        controls: '0',
        playsinline: '1',
        rel: '0',
        modestbranding: '1',
      });

      return {
        type: 'youtube',
        src: `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`,
      };
    }

    const vimeoId = getVimeoId(parsed);

    if (vimeoId) {
      const params = new URLSearchParams({
        autoplay: '1',
        muted: '1',
        loop: '1',
        background: '1',
        autopause: '0',
      });

      return {
        type: 'vimeo',
        src: `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`,
      };
    }
  } catch {
    return null;
  }

  return null;
}
