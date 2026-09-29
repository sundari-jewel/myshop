import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// Next.js hot-reload safe singleton
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

let cached = global._mongooseConn;
let cachedPromise = global._mongoosePromise;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "sundari",
    });
    global._mongoosePromise = cachedPromise;
  }

  // Keep concurrent requests on the same attempt, but don't leave a rejected
  // promise cached. That would make every later request fail immediately even
  // after a temporary DNS or network issue has cleared.
  const connectionPromise = cachedPromise;
  try {
    cached = await connectionPromise;
    global._mongooseConn = cached;
    global._mongoosePromise = connectionPromise;
    return cached;
  } catch (error) {
    if (cachedPromise === connectionPromise) cachedPromise = null;
    if (global._mongoosePromise === connectionPromise) {
      global._mongoosePromise = null;
    }
    throw error;
  }
}
