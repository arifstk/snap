import { Connection } from "mongoose";

// global.d.ts
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};
