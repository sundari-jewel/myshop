const https = require("https");
const fs    = require("fs");
const path  = require("path");

const MODELS = [
  {
    url:  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    dest: "models/face_landmarker.task",
  },
  {
    url:  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    dest: "models/hand_landmarker.task",
  },
];

fs.mkdirSync("models", { recursive: true });

for (const { url, dest } of MODELS) {
  if (fs.existsSync(dest)) { console.log(`skip ${dest}`); continue; }
  console.log(`downloading ${dest}...`);
  const file = fs.createWriteStream(dest);
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      https.get(res.headers.location, (r) => r.pipe(file));
    } else {
      res.pipe(file);
    }
    file.on("finish", () => { file.close(); console.log(`done ${dest}`); });
  }).on("error", (err) => { fs.unlinkSync(dest); console.error(err); });
}
