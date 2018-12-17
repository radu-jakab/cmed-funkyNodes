// Node object
function Node(name, lowerLimit, upperLimit) {
    this.name = name;
    this.lowerLimit = lowerLimit;
    this.upperLimit = upperLimit;
}

Node.prototype.toString = function () {
    let result = " ";

    // display items as comma-separated
    // for (let i = this.lowerLimit; i <= this.upperLimit; i++) {
    //     result += this.name + "/" + i + ", ";
    // }

    // display items collapsed by ID ranges
    if (this.lowerLimit === this.upperLimit)
        result += this.name + "/" + this.lowerLimit + ", ";
    else
        result += this.name + "/" + this.lowerLimit + "-" + this.upperLimit + ", ";

    if (result.length === 1)
        return "";
    else return result.substr(0, result.length - 2);
};

function nodesSortFunction(n1, n2) {
    if (n1.name !== n2.name)
        return n1.name.localeCompare(n2.name);
    return n1.lowerLimit - n2.lowerLimit;
}

// NodeSet object
function NodeSet() {
    this.nodes = [];
}

NodeSet.prototype.parseAndAdd = function (input) {
    let t0 = performance.now();
    let parseNodes = input.split(",");
    if (parseNodes.length > 0)
        for (let node of parseNodes) {
            let parts = node.trim().split("/");
            if (!!parts[0])
                this.nodes.push(new Node(parts[0], parseInt(parts[1]), parseInt(parts[1])));
        }
    let t1 = performance.now();
    console.log(`Parsing took ${t1 - t0} milliseconds`);

    this.normalize();
};
NodeSet.prototype.normalize = function () {
    let sort_t0 = performance.now();
    this.nodes.sort(nodesSortFunction);
    let sort_t1 = performance.now();
    console.log(`Sorting took ${sort_t1 - sort_t0} milliseconds`);

    // starting from leftmost, try to merge with next element
    let merge_t0 = performance.now();
    for (let i = 0; i < this.nodes.length - 1; i++) {
        if (this.nodes[i].name !== this.nodes[i + 1].name)
            continue;

        let ul1 = this.nodes[i].upperLimit;
        let ll2 = this.nodes[i + 1].lowerLimit;
        let ul2 = this.nodes[i + 1].upperLimit;

        if (ul1 >= ll2 - 1) {
            this.nodes[i].upperLimit = (ul1 >= ul2) ? ul1 : ul2;
            this.nodes.splice(i + 1, 1);
            i--; // try again against next element
        }
    }
    let merge_t1 = performance.now();
    console.log(`Merging took ${merge_t1 - merge_t0} milliseconds`);
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
        $(id).html(label + " " + set.nodes);
}

function merge() {
    mergeSet = mergeSets(set1, set2);
    updateSet("#merged", "Merge result:", mergeSet);
}

function mergeSets(set1, set2) {
    let mergeSet = new NodeSet();
    mergeSet.nodes = cloneNodesArray(set1.nodes); // clone
    mergeSet.nodes.push(...cloneNodesArray(set2.nodes));
    mergeSet.normalize();
    return mergeSet;
}

function cloneNodesArray(nodeSet) {
    return nodeSet.map((x) => new Node(x.name, x.lowerLimit, x.upperLimit));
}

// global vars
let set1 = new NodeSet();
let set2 = new NodeSet();
let mergeSet = new NodeSet();

// initialization
$(document).ready(function () {
    set1.nodes.push(new Node("a", 1, 1));
    set1.nodes.push(new Node("a", 5, 7));
    updateSet("#set1", "Set 1:", set1);
    updateSet("#set2", "Set 2:", set2);
    merge();
});
