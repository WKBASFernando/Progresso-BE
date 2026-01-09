import { google } from "googleapis";
import fs from "fs";

const youtube = google.youtube("v3");

export const uploadToYouTube = async (
  auth: any,
  videoPath: string,
  title: string
) => {
  const res = await youtube.videos.insert({
    auth,
    part: ["snippet", "status"],
    requestBody: {
      snippet: { title, description: "Uploaded via Progresso LMS" },
      status: { privacyStatus: "unlisted" }, // Keeps it off your public channel
    },
    media: {
      body: fs.createReadStream(videoPath), // Streams the file to avoid "Payload Too Large"
    },
  });
  return res.data.id; // This is what you save in MongoDB
};
