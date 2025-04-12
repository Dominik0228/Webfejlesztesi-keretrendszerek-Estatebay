import { Property } from "./property";

export interface User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    propertiesForSell: Property[];
    selledProperties: Property[];
  }