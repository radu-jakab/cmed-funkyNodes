function handleFileSelect(evt) {
    let file = evt.target.files[0];

    if (file) {
        let load_t0 = performance.now();
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            let load_t1 = performance.now();
            console.log(`File load took ${load_t1 - load_t0} milliseconds`);

            let testResult = "";
            let lines = evt.target.result.split("\n");
            for (let i = 0; i + 2 < lines.length; i += 3) {
                let t0 = performance.now();

                let scenarioName = lines[i];
                let set1 = new NodeSet();
                set1.parseAndAdd(lines[i + 1]);
                let set2 = new NodeSet();
                set2.parseAndAdd(lines[i + 2]);

                let mergeSet = mergeSets(set1, set2);
                let t1 = performance.now();

                testResult += "<b>" + scenarioName + "</b><br>";
                testResult += ((set1.nodes.length === 0) ? ("Set 1: empty") : ("Set 1: " + set1)) + "<br>";
                testResult += ((set2.nodes.length === 0) ? ("Set 2: empty") : ("Set 2: " + set2)) + "<br>";
                testResult += ((mergeSet.nodes.length === 0) ? ("Merged: empty") : ("Merged: " + mergeSet)) + "<br>";
                testResult += `<b>Computation took ${t1 - t0} milliseconds</b><br><br>`;
            }

            $("#testResult").html(testResult);
        };
    }
}

$(document).ready(function () {
    document.getElementById("fileLoad").addEventListener('change', handleFileSelect, false);
});
