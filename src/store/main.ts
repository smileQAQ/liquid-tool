import { makeAutoObservable } from "mobx";

class MainStore {
  selectFolder = "";
  selectIndex = -1;

  constructor() {
    makeAutoObservable(this);
  }

  set setSelectFolder(folder: string) {
    this.selectFolder = folder;
  }

  get getSelectFolder() {
    return this.selectFolder;
  }

  set setSelectIndex(index: number) {
    this.selectIndex = index;
  }

  get getSelectIndex() {
    return this.selectIndex;
  }
}

const mainStore = new MainStore();
export { MainStore };
export default mainStore;
