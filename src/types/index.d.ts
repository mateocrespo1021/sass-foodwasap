export {};

declare global {
  interface Window {
    Echo: any;
    google: any; // o más específico, si conoces la estructura
  }
}