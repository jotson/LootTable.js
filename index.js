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
 * var loot = new LootTable();
 * loot.add('sword', 20);
 * loot.add('shield', 5);
 * loot.add('gold', 5);
 * loot.add(null, 1);
 * var item = loot.choose(); // most likely a sword, sometimes null
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {

    var LootTable = function(table) {
        this.table = [];
        if (table !== undefined) this.table = table;
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
        if (weight === undefined || weight === null || weight <= 0) weight = 1;
        if (quantity === undefined || quantity === null || quantity <= 0) quantity = Number.POSITIVE_INFINITY;
        this.table.push({ item: item, weight: weight, quantity: quantity });
    };

    /**
     * Return a random item from the LootTable
     */
    LootTable.prototype.choose = function() {
        if (this.table.length === 0) return null;
        
        var i, v;
        var totalWeight = 0;
        for(i = 0; i < this.table.length; i++) {
            v = this.table[i];
            if (v.quantity > 0) {
                totalWeight += v.weight;
            }
        }

        var choice = 0;
        var randomNumber = Math.floor(Math.random() * totalWeight + 1);
        var weight = 0;
        for(i = 0; i < this.table.length; i++) {
            v = this.table[i];
            if (v.quantity <= 0) continue;

            weight += v.weight;
            if (randomNumber <= weight) {
                choice = i;
                break;
            }
        }

        var chosenItem = this.table[choice];
        this.table[choice].quantity--;

        return chosenItem.item;
    };

    return LootTable;
}));
