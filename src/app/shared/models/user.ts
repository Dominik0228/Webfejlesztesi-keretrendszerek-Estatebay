import { Property } from "./property";

export interface User { 
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  propertiesForSell: Property[];
  selledProperties: Property[];
}