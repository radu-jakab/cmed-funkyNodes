function generateDataset(nodeNameCount, maxNodesId, setSize) {
    let result = "";
    for (let i = 0; i < setSize; i++) {
        let name = String.fromCharCode(97 + nextRand(nodeNameCount));
        let nodeID = nextRand(maxNodesId, 1);

        result += name + "/" + nodeID + ", ";
    }

    if (result.trim().length === 0)
        return "";
    return result.substr(0, result.length - 2);
}

function nextRand(max, start) {
    start = start || 0;
    return Math.floor(Math.random() * max + start);
}

function test() {
    let x = 1;
    console.log(x);
    for (let i = 0; i < 63; i++) {
        x <<= 1;
        console.log(x);
    }
}