// lib/emitEventHandler.ts

import axios from "axios";

async function emitEventHandler( event: string, data: any, socketId?: string) {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`, {
      socketId,
      event,
      data,
    });
  } catch (error) {
    console.log(error);
  }
}

export default emitEventHandler;

// create this page for common api (socketServer/index.js)
