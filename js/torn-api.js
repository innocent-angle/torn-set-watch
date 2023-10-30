import fs from 'node:fs';

export default class TornAPI {
    constructor() {
        this.key;
        this.items;
        this.inventory;
    };

    getKey() {
        const data = fs.readFileSync('./json/config.json');
        const json = JSON.parse(data);
        this.key = json.TornKey;
    }

    updateItemData() {
        console.log('Fetching itemlist data.')
        return fetch(`https://api.torn.com/torn/?selections=items&key=${this.key}&comment=CuteTools`)
        .then((response) => response.json()
        .then((json) => {
            this.items = json.items;
            console.log("Finished getting item data.");
        })).catch((e) => console.log(e));
    }

    updateInventoryData() {
        console.log('Fetching inventory data.')
        return fetch(`https://api.torn.com/user/?selections=inventory&key=${this.key}&comment=CuteTools`)
        .then((response) => response.json()
        .then((json) => {
            this.inventory = json.inventory;
            console.log("Finished getting inventory data.")
        })).catch((e) => console.log(e));
    }

    fetchBazaarData(id) {
        console.log("Fetching bazaar data for " + this.getNameFromID(id));
            return fetch(`https://api.torn.com/market/${id}?selections=bazaar&key=${this.key}&comment=CuteTools`)
            .then((response) => response.json()
            .then((json) => {
                return json.bazaar;
            }))
    }

    getNameFromID(id) {
        for (const i in this.items) {
            if (i == id) return this.items[i].name;
        }
    }

    getTypeFromID(id) {
        for (const i in this.items) {
            if (i == id) return this.items[i].type;
        }
    }

    getTornValueFromID(id) {
        for (const i in this.items) {
            if (i == id) return this.items[i].market_value;
        }
    }

    getStockFromID(id) {
        let quantity = 0;
        for (const i in this.inventory) {
            const item = this.inventory[i];
            if (item.ID == id) quantity = item.quantity;
        }
        return quantity;
    }

    empty(id) {
        found = false;
        for (const i in this.inventory) {
            const item = this.inventory[i];
            if (item.ID == id) found = true;
        }
        return found;
    }
}