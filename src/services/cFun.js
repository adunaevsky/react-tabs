const createDictionary = (textID, text, data) => {

    var result = {};
    data.forEach((d) => {
        
        result[d[textID]] = d[text];
    });
    return result;

}

const cFun = {
    createDictionary: createDictionary
}

export { cFun as default };