import { format, isThisWeek, isToday, parseISO } from "date-fns";
import { IChatClient, IUserState } from "./types";
import { setChats } from "../core/reducers/chats";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";

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

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


