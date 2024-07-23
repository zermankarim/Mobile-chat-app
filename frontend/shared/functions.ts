import { format, isThisWeek, isToday, parseISO } from "date-fns";
import { Socket, io as socketIO } from "socket.io-client";
import { SERVER_PORT_SOCKET, SERVER_URL_SOCKET } from "../config";
import { ISocketEmitEvent, ISocketOnEvent } from "./types";

export const connectToSocket = (userId: string) => {
  const URL = `${SERVER_URL_SOCKET}:${SERVER_PORT_SOCKET}/?userId=${userId}`;
  const socket: Socket<ISocketEmitEvent, ISocketOnEvent> = socketIO(URL);
  return socket;
};

export const formatMessageDate = (isoString: string): string => {
  const date = parseISO(isoString);

  if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isThisWeek(date)) {
    return format(date, "EEE");
  } else {
    return format(date, "dd MMM");
  }
};

export const where = (
  field: string,
  conditionType: "==",
  value: string | Array<string>
) => {
  return { field, conditionType, value };
};

export const populate = (fields: string[]) => {
  return fields;
};
