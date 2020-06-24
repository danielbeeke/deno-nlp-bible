import { acceptWebSocket,  isWebSocketCloseEvent,  WebSocket, acceptable } from 'https://deno.land/std@0.51.0/ws/mod.ts'
import { existsSync, ensureDirSync } from 'https://deno.land/std/fs/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
const filePath = './uploads/';
const videoFileExtension = '.webm';

ensureDirSync(filePath);

function writeOrAppendData(data:any, fileName: string) {
  if (!existsSync(filePath + fileName + videoFileExtension)) {
    Deno.writeFileSync(filePath + fileName + videoFileExtension, data);
  } else {
    Deno.writeFileSync(filePath + fileName + videoFileExtension, data, {append: true});
  }
}

export const socketEventHandlers = async (ws: WebSocket): Promise<void> => {
  const filename = v4.generate();
  let isLastChunk = false;

  try {
    for await (const ev of ws) {
      console.log(ev)

      if (ev instanceof Uint8Array) {
        writeOrAppendData(ev, filename);
        if (isLastChunk) {
          await ws.send('http://localhost:3001/uploads/' + filename + videoFileExtension);
          isLastChunk = false
        }
      } else if (typeof ev === 'string') {
        if (ev === 'DONE') {
          isLastChunk = true;
        };
      } else if (isWebSocketCloseEvent(ev)) {
        const { code, reason } = ev;
        console.log('ws:Close', code, reason);
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);

    if (!ws.isClosed) {
      await ws.close(1000).catch(console.error);
    }
  }
}

export const Record = async (ctx: any) => {
  if (acceptable(ctx.request.serverRequest)) {
    const { conn, r: bufReader, w: bufWriter, headers } = ctx.request.serverRequest;
    const socket = await acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    });

    await socketEventHandlers(socket);
  } else {
    throw new Error('Error when connecting websocket');
  }
}