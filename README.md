# LootTable.js

A loot drop table implementation in JavaScript.

LootTable is used to make a random choice among a weighted list of alternatives for item drops,
map generation, and many other processes. There's a good overview of loot tables on
[Lost Garden](http://www.lostgarden.com/2014/12/loot-drop-tables.html).

## Example

```javascript
var loot = new LootTable();
loot.add('sword', 20);
loot.add('shield', 5);
loot.add('gold', 5);
loot.add(null, 1);
var item = loot.choose(); // most likely a sword, sometimes null
```

Weights are arbitrary, not percentages, and don't need to add up to 100.
If one item has a weight of 2 and another has a weight of 1, the first item
is twice as likely to be chosen. If quantity is given, then calls to `choose()`
will only return that item while some are available. Each `choose()` that
selects that item will reduce its quantity by 1.

Items can be anything, not just strings. They can be arrays, numbers, JSON
data, null, functions... even another LootTable!

# Node, UMD (by @mreinstein)

The UMD branch contains a version packaged for Node. Install with

`npm install jotson/LootTable.js#UMD`
