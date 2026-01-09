export const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return "";

  // Standard Regex to extract the Video ID (11 characters)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  const videoId = match && match[2].length === 11 ? match[2] : null;

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};
