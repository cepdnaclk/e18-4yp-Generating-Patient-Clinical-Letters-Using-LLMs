declare module 'html-to-text' {
    interface Options {
      wordwrap?: number;
      ignoreImage?: boolean;
      // Add other options as needed
    }
  
    function htmlToText(html: string, options?: Options): string;
  
    export { htmlToText };
  }
  