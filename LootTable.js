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
 * let loot = new LootTable();
 * loot.add('sword', 20);
 * loot.add('shield', 5);
 * loot.add('gold', 5);
 * loot.add(null, 1);
 * let item = loot.choose(); // most likely a sword, sometimes null
 */
class LootTable {
  constructor (table) {
    table === undefined ? this.table = [] : this.table = table;
  }

  clear () {
    this.table.length = 0;
  }

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
  add (item, weight, quantity) {
    if (weight === undefined || weight === null || weight <= 0) weight = 1;
    if (quantity === undefined || quantity === null || quantity <= 0) quantity = Number.POSITIVE_INFINITY;
    this.table.push({ item: item, weight: Number(weight), quantity: Number(quantity) });
  };

  /**
   * Return a random item from the LootTable
   */
  choose () {
    if (this.table.length === 0) return undefined;
    let temp = [];
    this.table.forEach(item => {
      for (let i = 0; i < item.weight; i++) {
        temp.push(this.table.indexOf(item))
      }
    });
    let weightedIndex = temp[Math.floor(Math.random() * temp.length)];
    let choice = this.table[weightedIndex];
    this.table[weightedIndex].quantity--;
    if (choice.quantity <= 0) this.table.splice(weightedIndex, 1);
    return choice;
  };
};

if (module) module.exports = LootTable;
