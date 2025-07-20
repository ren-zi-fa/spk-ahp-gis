/* eslint-disable @typescript-eslint/no-explicit-any*/
declare module "dom-to-image-more" {
  const domToImage: {
    toSvg: (node: HTMLElement, options?: any) => Promise<string>;
    toPng: (node: HTMLElement, options?: any) => Promise<string>;
    toJpeg: (node: HTMLElement, options?: any) => Promise<string>;
    toBlob: (node: HTMLElement, options?: any) => Promise<Blob>;
    toPixelData: (node: HTMLElement, options?: any) => Promise<Uint8ClampedArray>;
  };

  export default domToImage;
}
