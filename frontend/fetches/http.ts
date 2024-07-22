import axios from "axios";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";
import { dataFromGetDoc, IChatDB, IUserState } from "../shared/types";

export const getSome = async () => {
  try {
    const data = await axios.get(`${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/some`);
    console.log(data);
    return "";
  } catch (e: any) {
    console.error(e.message);
  }
};

// export const getDoc = async (
//   collectionName: "users" | "chats",
//   conditions: ({...params}) => {params}
// ): Promise<IUserState | IChatDB> => {
//   const data: IUserState | IChatDB = await axios.get(
//     `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/getDoc`,
//     { params: { collectionName, field, condition, value } }
//   );
//   return data;
// };

export const getDoc = async (
  collectionName: "users" | "chats",
  condition: {
    field: string;
    conditionType: "==";
    value: string | Array<string>;
  }
): Promise<dataFromGetDoc> => {
  try {
    const { data } = await axios.get(
      `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/getDoc`,
      { params: { collectionName, condition } }
    );
    return data;
  } catch (e: any) {
    throw new Error("Error at getDoc: ", e.message);
  }
};
