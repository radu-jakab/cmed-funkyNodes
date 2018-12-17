// NodeSet object
function NodeSet() {
    this.names = [];
    this.nodes = {};
}

NodeSet.prototype.addNode = function (name, id) {
    // check category already exists
    if (this.names.indexOf(name) < 0) {
        this.names.push(name);
        this.names.sort();
        this.nodes[name] = [];
    }

    // check size is large enough
    let requiredSize = Math.ceil(id / 32);
    if (requiredSize > this.nodes[name].length)
        for (let i = this.nodes[name].length; i < requiredSize; i++)
            this.nodes[name].push(0);

    // add node value
    let index = Math.floor(id / 32);
    let bit = id % 32;
    this.nodes[name][index] |= 1 << bit;
};

NodeSet.prototype.clone = function () {
    let result = new NodeSet();
    result.names = this.names.slice();
    for (let name of result.names)
        result.nodes[name] = this.nodes[name].slice();
};

NodeSet.prototype.mergeWithSet = function (otherSet) {
    for (let name of otherSet.names)
        if (this.names.indexOf(name) < 0) {
            // add any new names
            this.names.push(name);
            this.names.sort();
            this.nodes[name] = otherSet.nodes[name].slice();
        } else {
            // make sure we have the right capacity
            let requiredSize = otherSet.nodes[name].length;
            if (requiredSize > this.nodes[name].length)
                for (let i = this.nodes[name].length; i < requiredSize; i++)
                    this.nodes[name].push(0);

            // merge
            for (let i = 0; i < requiredSize; i++)
                this.nodes[name][i] |= otherSet.nodes[name][i];
        }
};

NodeSet.prototype.parseAndAdd = function (input) {
    let t0 = performance.now();
    let parseNodes = input.split(",");
    if (parseNodes.length > 0)
        for (let node of parseNodes) {
            let parts = node.trim().split("/");
            if (!!parts[0]) {
                this.addNode(parts[0], parts[1]);
            }
        }
    let t1 = performance.now();
    console.log(`Parsing took ${t1 - t0} milliseconds`);
};

NodeSet.prototype.toString = function () {
    let result = " ";

    // display items collapsed by ID ranges
    for (name of this.names) {
        let start = -1, end = -1;

        for (let i = 0; i < this.nodes[name].length * 32; i++) {
            let index = Math.floor(i / 32);
            let bitValue = this.nodes[name][index] & (1 << (i % 32));

            if (!bitValue) {
                if (start >= 0) {
                    if (start === end)
                        result += name + "/" + start + ", ";
                    else
                        result += name + "/" + start + "-" + end + ", ";
                    start = end = -1;
                }
            } else {
                if (start < 0) {
                    start = end = i;
                } else {
                    end = i;
                }
            }
        }

        if (start >= 0) {
            if (start === end)
                result += name + "/" + start + ", ";
            else
                result += name + "/" + start + "-" + end + ", ";
        }
    }

    if (result.length === 1)
        return "";
    else return result.substr(0, result.length - 2);
};

// GUI functions
function addToSet1() {
    let read = $("#set1-input").val();
    set1.parseAndAdd(read);
    updateSet("#set1", "Set 1:", set1);
    merge();
}

function clearSet1() {
    set1 = new NodeSet();
    updateSet("#set1", "Set 1:", set1);
    merge();
}

function addToSet2() {
    let read = $("#set2-input").val();
    set2.parseAndAdd(read);
    updateSet("#set2", "Set 2:", set2);
    merge();
}

function clearSet2() {
    set2 = new NodeSet();
    updateSet("#set2", "Set 2:", set2);
    merge();
}

// helper functions
function updateSet(id, label, set) {
    if (set.nodes.length === 0)
        $(id).html(label + " empty");
    else
        $(id).html(label + " " + set);
}

function merge() {
    mergeSet = mergeSets(set1, set2);
    updateSet("#merged", "Merge result:", mergeSet);
}

function mergeSets(set1, set2) {
    let t0 = performance.now();

    let mergeSet = new NodeSet();
    mergeSet.mergeWithSet(set1);
    mergeSet.mergeWithSet(set2);

    let t1 = performance.now();
    console.log(`Merging took ${t1 - t0} milliseconds`);

    return mergeSet;
}

// global vars
let set1 = new NodeSet();
let set2 = new NodeSet();
let mergeSet = new NodeSet();

// initialization
$(document).ready(function () {
    set1.addNode("a", 1);
    set1.addNode("a", 5);
    set1.addNode("a", 6);
    set1.addNode("a", 7);
    updateSet("#set1", "Set 1:", set1);
    updateSet("#set2", "Set 2:", set2);
    merge();
});
