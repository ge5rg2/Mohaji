export interface ResultData {
  token: {
    quiz: number;
    emoji: number;
    word: number;
  };
  setTokenTime: string;
}

export interface userType {
  name: string;
  email: string;
  image: string;
}

export interface Token {
  token: number | undefined;
}

export interface NumSeq {
  num: number;
  seq: string;
}
