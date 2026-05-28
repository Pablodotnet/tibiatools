import { runMonteCarloForge } from '@/helpers/exaltationForge';

self.onmessage = (e: MessageEvent) => {
  const params = e.data;
  const result = runMonteCarloForge(params);
  self.postMessage(result);
};
