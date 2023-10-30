import TornAPI from './torn-api.js';
const tornApi = new TornAPI();

export default class SetBuilder {
    constructor() {
        this.range = 1.02;
        this.stockThreshhold = 50;
        this.buyThreshhold = 29;
        this.scanFrequency = 30; // seconds

        this.allItems = [
            384,
            273,
            258,
            215,
            281,
            269,
            266,
            274,
            268,
            186,
            618,
            187,
            261,
            282,
            617, 
            271, 
            277, 
            263, 
            260, 
            272, 
            267, 
            264, 
            276, 
            385
            ];
        
        this.setData = null;
        this.scanner = null;
        this.scanning = false;
    }

    async init() {
        tornApi.getKey();
        
        await tornApi.updateItemData();
        await tornApi.updateInventoryData();
    }

    generateSetItems() {
        console.log("Generating item sets.");
        this.setData = [];
        for (const i of this.allItems) {
            const item = new SetItem(i, tornApi);
            this.setData.push(item);
        }
    }

    scanAll() {
        let requests = 0;
        for (const s in this.setData) {
            if (Object.hasOwnProperty.call(this.setData, s)) {
                const set = this.setData[s];
                
                if (set.stock <= this.stockThreshhold) {
                    requests++

                    setTimeout(() => {
                        set.updateBazaarData()
                        .then((data) => {
                            if (data[0].cost <= (set.tornValue * this.range) && data[0].quantity >= this.buyThreshhold
                            ||  data[1].cost <= (set.tornValue * this.range) && data[1].quantity >= this.buyThreshhold
                            ||  data[2].cost <= (set.tornValue * this.range) && data[2].quantity >= this.buyThreshhold) {
                                console.log("Should buy " + set.name + ": " + `https://www.torn.com/imarket.php#/p=shop&step=shop&type=${set.id}`)
                            }
                        })
                    }, 1500 * requests);
                }
            }
        }
    }

    startScanning() {
        this.scanAll();
        this.scanner = setInterval(() => {
            this.scanAll();
        }, this.scanFrequency * 1000);
    }

    stopScanning() {
        clearInterval(this.scanner);
    }
}

class SetItem {
    constructor(id) {
      this.id = id;
      this.api = tornApi;
      this.name = tornApi.getNameFromID(id);
      this.stock = tornApi.getStockFromID(id);
      this.bazaarData = 0;
      this.tornValue = tornApi.getTornValueFromID(id);
      this.type = tornApi.getTypeFromID(id);
    }

    updateBazaarData() {
        return tornApi.fetchBazaarData(this.id);
    }
}