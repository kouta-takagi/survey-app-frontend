import {
  getAuthDataFromStorage,
  setAuthDataFromResponse,
  removeAuthDataFromStorage,
} from "@/utils/auth-data";
import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";

export const login = (email: string, password: string) => {
  return axios
    .post("http://localhost:3000/auth/sign_in", { email, password })
    .then((res: AxiosResponse) => {
      setAuthDataFromResponse(res.headers);
      return res;
    })
    .catch((error: AxiosError) => {
      return error.response;
    });
};

export const logout = () => {
  return axios
    .delete("http://localhost:3000/auth/sign_out", {
      headers: getAuthDataFromStorage(),
    })
    .then((res: AxiosResponse) => {
      removeAuthDataFromStorage();
      return res;
    });
};

export const signUp = async (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  try {
    const res = await axios.post("http://localhost:3000/auth", {
      name,
      email,
      password,
      password_confirmation,
    });

    setAuthDataFromResponse(res.headers);

    return res;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
};
