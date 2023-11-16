export interface User {
  id?: number;
  email?: string;
  password: string;
}

export type GetGPTResponseRequest = {
  systemData ?: string,
  inputData ?: string
}
