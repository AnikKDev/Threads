export type IUser = {
  id: string;
  userName: string;
  name: string;
  threads?: {}[];
  bio?: string;
  image?: string;
  onBoarded?: boolean;
  communities: {}[];
};
