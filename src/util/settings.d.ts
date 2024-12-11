export interface Setting {
    type: string;
    id: string;
    label: string;
    value: string;
    default: string;
  }
  
export interface Config {
    name: string;
    settings: Setting[];
    presets: { name: string }[];
}