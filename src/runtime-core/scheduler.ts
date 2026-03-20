const queue: any[] = [];

let isFlushPending = false;
export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  queueFlush();
}

export function nextTick(fn) {
  return fn ? Promise.resolve().then(fn) : Promise.resolve();
}

function queueFlush() {
  //   把回调放入微任务队列,因为Promise.resolve返回一个promise
  if (isFlushPending) return;
  isFlushPending = true;

  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;
  let job;
  while ((job = queue.shift())) {
    job && job();
  }
}
