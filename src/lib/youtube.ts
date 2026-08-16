const CHANNEL_HANDLE = "tallwoodmaker";

export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
};

async function resolveChannelId(): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/@${CHANNEL_HANDLE}`, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        // Skips YouTube's EU/UK cookie-consent interstitial, which would
        // otherwise redirect this server-side fetch to consent.youtube.com
        // instead of the channel page when the request originates in the EEA.
        Cookie: "SOCS=CAI",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    return html.match(/"externalId":"(UC[\w-]{22})"/)?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * Latest uploads via the channel's public RSS feed (no API key). Resolves the
 * handle to a channel ID first since YouTube only serves RSS by channel ID.
 * Returns null on any failure so callers can fall back to a static card.
 */
export async function getLatestYouTubeVideos(
  limit = 3,
): Promise<YouTubeVideo[] | null> {
  const channelId = await resolveChannelId();
  if (!channelId) return null;

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const xml = await res.text();

    const videos = [...xml.matchAll(/<entry>[\s\S]*?<\/entry>/g)]
      .slice(0, limit)
      .map((entryMatch) => {
        const entry = entryMatch[0];
        const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
        const title = entry.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
        return {
          id,
          title,
          url: `https://www.youtube.com/watch?v=${id}`,
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };
      })
      .filter((video) => video.id && video.title);

    return videos.length > 0 ? videos : null;
  } catch {
    return null;
  }
}
