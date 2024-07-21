import axios from "axios";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";

export const getSome = async () => {
  try {
    const data = await axios.get(`${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/some`);
    console.log(data);
    return "";
  } catch (e: any) {
    console.error(e.message);
  }
};
