declare module "@pagefind/default-ui" {
  export interface PagefindUIOptions {
    element: string;
    bundlePath?: string;
    showImages?: boolean;
    excerptLength?: number;
    resetStyles?: boolean;
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
  }
}
