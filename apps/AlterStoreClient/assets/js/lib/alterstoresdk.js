"use strict"

class AlterStoreSDK {
  constructor(storeListEntry) {
    this.errors = {"StoreDoesNotExist": "StoreDoesNotExist: Store list does not exist!",
                   "HttpRequestFailed": "HttpRequestFailed: HTTP request failed!"};
    this.storesList = [];
    if(localStorage.getItem(this.storesListEntry)) {
      this.storesList = JSON.parse(localStorage.getItem(this.storesListEntry));
    } else {
      console.warn(this.errors["StoreDoesNotExist"]);
    }
  }
  httpRequest(requestType, requestURL, requestData=null) {
    var request = new XMLHttpRequest({mozSystem: true});
    return new Promise((resolve, reject) => {
      request.onreadystatechange = () => {
        if (request.readyState !== 4) return;
        if (request.status >= 200 && request.status < 300) {
          try {
            resolve(JSON.parse(request.responseText));
          } catch (err) {
            resolve(request.responseText);
          }
        } else {
          reject(new Error(this.errors["HttpRequestFailed"]+"("+
                           request.status+request.statusText+")"));
        }
      };
      request.open(requestType, requestURL, true);
      if(requestData != null) request.send(requestData);
      else request.send();
    });
  }
  addStore(repoURL) {
    return new Promise((resolve, reject) => {
      this.httpRequest("GET", repoURL+"/ALTERSTORE.json")
      .then((repoData) => {
        this.storesList.push({"name": repoData["store_name"],
                              "owners": repoData["store_owners"],
                              "description": repoData["store_description"],
                              "restricted": repoData["store_restricted"],
                              "url": repoURL});
        localStorage.setItem(this.storesListEntry, JSON.stringify(this.storesList));
        resolve(this.storesList);
      })
      .catch((err) => {
        reject(err)
      });
    });
  }
  getAllStores() {
    return new Promise((resolve, reject) => {
      if(this.storesList != [] && typeof(this.storesList) == "object") {
        resolve(this.storesList);
      } else {
        reject(new Error(this.errors["StoreDoesNotExist"]));
      }
      
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
    return new Promise((resolve, reject) => {
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