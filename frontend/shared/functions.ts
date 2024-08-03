import { format, isThisWeek, isToday, parseISO } from "date-fns";
import { Socket, io as socketIO } from "socket.io-client";
import { SERVER_PORT_SOCKET, SERVER_URL_SOCKET } from "../config";
import { ISocketEmitEvent, ISocketOnEvent } from "./types";
import { Ref, RefObject } from "react";
import { ScrollView } from "react-native";

export const connectToSocket = (userId: string) => {
  const URL = `${SERVER_URL_SOCKET}:${SERVER_PORT_SOCKET}/?userId=${userId}`;
  const socket: Socket<ISocketEmitEvent, ISocketOnEvent> = socketIO(URL, {
    query: { userId },
  });
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

export const scrollToBottom = (scrollViewRef: RefObject<ScrollView>) => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};