declare module 'vite-plugin-prerender' {
  export interface PrerenderOption {
    routes: string[];
    staticDir?: string;
    postProcess?: (renderedRoute: any) => any;
    minify?: boolean;
    renderer?: any;
    puppeteerOptions?: any;
    server?: any;
    entryPath?: string;
  }
  
  const prerender: (options?: PrerenderOption) => any;
  export default prerender;
}

declare module 'vite-plugin-html' {
  export interface HtmlPluginOption {
    minify?: boolean;
    inject?: {
      data?: Record<string, any>;
      tags?: Array<any>;
    };
    template?: string;
    entry?: string;
    viteNext?: boolean;
  }
  
  export function createHtmlPlugin(options?: HtmlPluginOption): any;
}

declare module 'vite-imagetools' {
  export interface ImagetoolsOptions {
    defaultDirectives?: URLSearchParams;
    resolveFrom?: 'root' | 'source';
    removeMetadata?: boolean;
    extendOutputFormats?: Record<string, any>;
    extendTransforms?: Record<string, any>;
    logLevel?: 'info' | 'warn' | 'error' | 'silent';
  }
  
  export function imagetools(options?: ImagetoolsOptions): any;
}