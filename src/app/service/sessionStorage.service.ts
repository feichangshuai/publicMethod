export class UserService {

    KEY = 'authorization';
  
  
    set msg(result) {
      localStorage.setItem(this.KEY, JSON.stringify(result));
    }
  
    get msg() {
      return JSON.parse(localStorage.getItem(this.KEY) || '{}') || {};
    }
  
    set drill(result) {
      localStorage.setItem('currentDrill', JSON.stringify(result));
    }
  
    get drill() {
      return JSON.parse(localStorage.getItem('currentDrill') || '{}') || {};
    }
  
    deleLocal() {
      localStorage.removeItem(this.KEY);

    }
  }