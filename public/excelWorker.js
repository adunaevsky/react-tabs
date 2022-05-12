importScripts('./xlsx.core.min.js', './axios.min.js');

function processData(rawData) {

    var data = new Uint8Array(rawData);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, { type: "binary" });
    var allFileData = {};
    workbook.SheetNames.forEach((n) => {
        allFileData[n] = XLSX.utils.sheet_to_json(workbook.Sheets[n])
    });
    return allFileData

}

async function doCalculation(e, handleResult) {

    var url = e.root + '/' + e.fileName + '.xlsx';

    let result = null;
        axios({
            url: url,
            responseType: 'arraybuffer'
        })
            .then(function (response) {
                result = processData(response.data);
                handleResult(result);
            })
            .catch(function (error) {
                console.log(error);
            }); 
}


self.onmessage = function (msg) {
    const { id, payload } = msg.data

    doCalculation(payload, function (result) {
        const msg = {
            id,
            payload: result
        }

        self.postMessage(msg)
    })
}