import url from './URL'
var allData = {},
    subfolders = {
        static: 'staticFilesDoNotTouch',
        trends: 'trends',
        root: 'data'

    };



var DataProvider = function (fileName, worksheetName, path, handleData) {


    if (allData[fileName]) {
        console.log('data cached')
        handleData(allData[fileName][worksheetName])
    } else {
        const wrapper = new Wrapper();
        // console.log(url.dataFile + (staticFile ? '/staticFilesDoNotTouch' : ''))
        wrapper.startWork({
            fileName: fileName,
            root: url.dataFile + subfolders[path]
        }).then(
            (workbook) => {
                allData[fileName] = workbook;

                handleData(workbook[worksheetName]);

            }
        ).catch(
            (err) => { console.log('Got error: ', err) }
        )
    }
}

const resolves = {}
const rejects = {}
let globalMsgId = 0
// Activate calculation in the worker, returning a promise
function sendMsg(payload, worker) {
    const msgId = globalMsgId++
    const msg = {
        id: msgId,
        payload
    }
    return new Promise(function (resolve, reject) {
        // save callbacks for later
        resolves[msgId] = resolve
        rejects[msgId] = reject
        worker.postMessage(msg)
    }).then((d) => {
        setTimeout(() => {
            worker.terminate();
        });

        return d;
    });
}
// Handle incoming calculation result
function handleMsg(msg) {
    const { id, err, payload } = msg.data
    if (payload) {
        const resolve = resolves[id]
        if (resolve) {
            resolve(payload)
        }
    } else {
        // error condition
        const reject = rejects[id]
        if (reject) {
            if (err) {
                reject(err)
            } else {
                reject('Got nothing')
            }
        }
    }

    // purge used callbacks
    delete resolves[id]
    delete rejects[id]
}
// Wrapper class
class Wrapper {
    constructor() {

        this.worker = new Worker(url.worker);
        this.worker.onmessage = handleMsg
    }

    startWork(dataReqestDetails) {
        return sendMsg(dataReqestDetails, this.worker)
    }
}


export { DataProvider as default }


//export { dataProvider as default } //TESTING ONLY.  SEE LINES 6 TO 16.  MAKE SURE XLSX LIBRARY IS DOANLOADED FOR ALL BROWSERS.