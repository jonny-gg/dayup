// 外部模块
declare module "url" {
  export interface Url {
    protocol?: string;
  }
  export function parse(
    url: string,
    slashesDenoteHost: string,
    parseQueryString?: string
  ): Url;
}

declare module "path" {
  export function normailize(p: string): string;
  export function join(...paths: any[]): string;
  export let sep: string;
}

// 外部模块简写
declare module "hot-new-module";

// 模块申明通配符

declare module "*!text" {
  const content: string;
  export default content;
}

declare module "json!*" {
  const value: any;
  export default value;
}
