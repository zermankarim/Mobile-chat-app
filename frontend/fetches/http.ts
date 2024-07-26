import uuid from "react-native-uuid";
import axios from "axios";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";
import {
  IGetDocData,
  IAuthData,
  IGetDocsData,
  IUploadImageData,
} from "../shared/types";

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
      `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/getData/getDoc`,
      { params: { collectionName, condition } }
    );
    return data;
  } catch (e: any) {
    throw new Error(`Error at getDoc: ${e.message}`);
  }
};

export const getDocs = async (
  collectionName: "users" | "chats",
  condition: {
    field: string;
    conditionType: "==";
    value: string | Array<string>;
  },
  populateArr?: string[]
): Promise<IGetDocsData> => {
  try {
    const { data } = await axios.get(
      `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/getData/getDocs`,
      { params: { collectionName, condition, populateArr } }
    );
    return data;
  } catch (e: any) {
    throw new Error(`Error at getDocs: ${e.message}`);
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

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const uploadNewAvatar = async (
  blob: Blob,
  userId: string
): Promise<IUploadImageData> => {
  try {
    const base64Image = await blobToBase64(blob);

    const formData = new FormData();
    formData.append("image", base64Image);
    formData.append("userId", userId);

    const { data } = await axios.post(
      `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/upload/newAvatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (e: any) {
    console.error(`Error during sending image: ${e.message}`);
    throw new Error(`Error during sending image: ${e.message}`);
  }
};
