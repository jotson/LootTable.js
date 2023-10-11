/**
 * Copyright © 2015 John Watson
 * Licensed under the terms of the MIT License
 * ---
 * LootTable is used to make a random choice among a weighted list of alternatives
 * for item drops, map generation, and many other processes. Here's a good overview
 * of loot tables: http://www.lostgarden.com/2014/12/loot-drop-tables.html
 *
 * Example:
 *
 * const loot = new LootTable();
 * loot.add('sword', 20);
 * loot.add('shield', 5);
 * loot.add('gold', 5);
 * loot.add(null, 1);
 * const item = loot.choose(); // most likely a sword, sometimes null
 */
const LootTable = function(table=[]) {
    this.table = table;
};

LootTable.prototype.constructor = LootTable;

LootTable.prototype.clear = function() {
    this.table.length = 0;
};

/**
 * Add an item
 *
 * Weights are arbitrary, not percentages, and don't need to add up to 100.
 * If one item has a weight of 2 and another has a weight of 1, the first item
 * is twice as likely to be chosen. If quantity is given, then calls to choose()
 * will only return that item while some are available. Each choose() that
 * selects that item will reduce its quantity by 1.
 *
 * Item can be anything, not just strings. It could be an array, a number, JSON
 * data, null, a function... even another LootTable!
 * 
 * @param {mixed} item      The item to be chosen
 * @param {number} weight   (optional) The weight of the item, defaults to 1
 * @param {number} quantity (optional) Quantity available, defaults to Infinite
 */
LootTable.prototype.add = function(item, weight, quantity) {
    if (weight === undefined || weight === null || weight <= 0)
        weight = 1;
    if (!Number.isInteger(quantity) || quantity <= 0)
        quantity = Number.POSITIVE_INFINITY;

    this.table.push({ item, weight, quantity });
};

/**
 * Return a random item from the LootTable
 */
LootTable.prototype.choose = function() {
    if (this.table.length === 0)
        return null;
    
    let totalWeight = 0;
    for (const v of this.table)
        if (v.quantity > 0)
            totalWeight += v.weight;

    let choice = 0;
    const randomNumber = Math.floor(Math.random() * totalWeight + 1);
    let weight = 0;

    for (let i = 0; i < this.table.length; i++) {
        const v = this.table[i];
        if (v.quantity <= 0)
            continue;

        weight += v.weight;
        if (randomNumber <= weight) {
            choice = i;
            break;
        }
    }

    const chosenItem = this.table[choice];
    this.table[choice].quantity--;

    return chosenItem.item;
};


export default LootTable;
