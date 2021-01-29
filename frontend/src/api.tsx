import Axios from "axios";
import { makeUseAxios } from "axios-hooks";
import { API_HOST, PREDICT_API_HOST } from "./Constants";

export const axiosInstance = Axios.create({
  baseURL: API_HOST,
});

export const useAxios = makeUseAxios({
  axios: axiosInstance,
});

export const axiosPredictInstance = Axios.create({
  baseURL: PREDICT_API_HOST,
});
