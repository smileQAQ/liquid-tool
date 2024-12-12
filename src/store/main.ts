import { makeAutoObservable } from "mobx";

class MainStore {
  selectFolder = "";

  constructor() {
    makeAutoObservable(this); 
  }

  set setSelectFolder(folder: string) {
    this.selectFolder = folder;
  }

    get getSelectFolder() {
        return this.selectFolder;
    }

}

const mainStore = new MainStore();
export { MainStore };
export default mainStore;