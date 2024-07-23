import axios from "axios";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";
import { IGetDocData, IAuthData } from "../shared/types";

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
): Promise<IGetDocData> => {
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

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<IAuthData> => {
  try {
    const { data } = await axios.post(
      `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/auth/signInWithEmailAndPassword`,
      { email, password }
    );
    return data;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const createUserWithEmailPassAndNames = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<IAuthData> => {
  try {
    const userData = { firstName, lastName, email, password };
    const { data } = await axios.post(
      `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/auth/createUserWithEmailPassAndNames`,
      userData
    );
    return data;
  } catch (e: any) {
    throw new Error(e.message);
  }
};
