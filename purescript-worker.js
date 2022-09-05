import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';

export function XmlWorker(ctx, createData) {
  console.log("FUKKKKKKKKKKK")
  this._ctx = ctx;
}
XmlWorker.prototype.doComplete = function () {
  console.log("FUKrigk")
  return Promise.resolve('hello world');
};

self.onmessage = () => {
  // ignore the first message
  console.log("lkjlkj")
  worker.initialize((ctx, createData) => {
    console.log("blue house")
    return new XmlWorker(ctx, createData);
  });
};

export function create(ctx, createData) {
  console.log("Creating ps")
  return new XmlWorker(ctx, createData);
}
