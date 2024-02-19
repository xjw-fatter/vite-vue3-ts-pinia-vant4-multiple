import mitt from 'mitt';
export type mittEvents = {
  authReady?: DragEvent;
};
const emitter = mitt<mittEvents>();
export default emitter;
