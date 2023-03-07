declare module 'seedrandom' {
    function seedrandom(seed: number | string, options?: seedrandom.SeedRandomOptions): () => number;
    namespace seedrandom {
      interface SeedRandomOptions {
        entropy?: boolean;
        global?: boolean;
      }
    }
    export = seedrandom;
  }