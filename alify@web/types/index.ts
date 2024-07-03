import { ReactNode, SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IMusic {
  _id: string;
  name: string;
  author: string;
  genre: string;
  url: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IModal {
  modalHeader?: ReactNode;
  modalBody?: ReactNode;
  modalFooter?: ReactNode;
}

export type GenreResponseType = {
  _id: string;
  name: string;
  __v: number;
};
