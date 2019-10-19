"use strict"

class AlterStoreSDK {
  constructor() {
    this.storesListEntry = "alterstoresdk.stores";
    this.storesList = {};
    if(localStorage.getItem(this.storesListEntry)) {
      this.storesList = JSON.parse(localStorage.getItem(this.storesListEntry));
    } else {
      console.warn("Store list does not exist!");
    }
  }
  promiseMaker(callback) {
    if(typeof(callback) == "function") {
      return new Promise(callback(resolve, reject));
    } else {
      throw new TypeError("The supplied callback is not a function.");
    }
  }
  httpRequest(requestType, requestURL, requestData=null) {
    var request = new XMLHttpRequest({mozSystem: true});
    return this.promiseMaker((resolve, reject) => {
      request.onreadystatechange = () => {
        if (request.readyState !== 4) return;
        if (request.status >= 200 && request.status < 300) {
          try {
            resolve(JSON.parse(request.responseText));
          } catch (err) {
            resolve(request.responseText);
          }
        } else {
          reject(new Error(request.status,
                           request.statusText));
        }
      };
      request.open(requestType, requestURL, true);
      if(requestData != null) request.send(requestData);
      else request.send();
    });
  }
  addStore(repoURL) {
    this.httpRequest("GET", repoURL+"/ALTERSTORE.json")
    .then((repoData) => {
      console.log(repoData);
    })
    .catch((error) => {
      console.error(error);
    })
  }
  getAppsInSpecificStore(repoName) {
    for(var repo in this.repoList) {
      if(repoName == repo["name"]) {
        return this.httpRequest("GET", repo["url"]+"/apps/apps.json");
        break;
      }
    }
  }
  getAppsInAllStores() {
    return this.promiseMaker((resolve, reject) => {
      try {
        var fullList = []
        for(var repo in this.repoList) {
          this.getAppsInSpecificRepo(repo["name"]).then((apps) => {
            fullList.push(apps);
          });
        }
        resolve(fullList);
      } catch(err) {
        reject(err);
      }
    });
  }
  getAppUpdates() {

  }
  
}