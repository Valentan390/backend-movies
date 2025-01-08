// import 'qs';

declare module 'qs' {
  export interface ParsedQs {
    [key: string]:
      | undefined
      | string
      | string[]
      | number
      | ParsedQs
      | ParsedQs[];
  }
}
