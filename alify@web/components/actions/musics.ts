import { IMusic } from "@/types";
import axios, { AxiosResponse } from "axios";
export const getMusicList = async () => {
  return axios.get("/api/music");
};

export const uploadMusic = async (formData: FormData) => {
  return axios.post("/api/music", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
export const getMusicWithoutGenres = async (): Promise<
  AxiosResponse<IMusic[]>
> => {
  return axios.get("/api/music/without-genres");
};
