import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // cun
  //   存到当前component里面
  const currentInstance: any = getCurrentInstance();

  if (currentInstance) {
    const { provides } = currentInstance;
    provides[key] = value;
  }
}

export function inject(key) {
  // qu
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    const { parent } = currentInstance;

    const parentProvides = currentInstance.parent.provides;
    return parentProvides[key];
  }
}
