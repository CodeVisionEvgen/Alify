import { GenreResponseType } from "@/types";
import axios, { AxiosResponse } from "axios";
import { Genres } from "../genre/genres";

export const createGenre = async (formData: {
  name: string;
  musics: string[];
}) => {
  return axios.post("/api/genre", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const getGenresList = async (): Promise<
  AxiosResponse<GenreResponseType[]>
> => {
  return axios.get("/api/genre");
};

export const GetStaticGenre = (
  name: string
): {
  thumb: string;
  name: string;
} => {
  const genre =
    Genres.filter((genre) => {
      return genre.name === name.toLowerCase();
    })[0] || Genres[Genres.length - 1];
  return {
    ...genre,
    name: genre.name === "default" ? name : genre.name,
  };
};
