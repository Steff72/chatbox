// use browserify index.js -o bundle.js to generate JS
// use global. for function to be accessible from index.html

const Iota = require('@iota/core')
const Converter = require('@iota/converter')

const iota = Iota.composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
})

const seed = 'ZQNNNNOETNFTJVAWC9T9DAMYIQE9ISROMW9LLSKBRPFOQJWXYKKAVAQCECAIP9BZSBYQCZLNZ9TUTXVFX'
const outAddress = 'RBBVEOEBXUNLWVIPQXTQSKBHWVVGFBWOFGCDDQWMOSCOHWEHUWEDCZAQDBLHEFHRBWEIFEHCIGUJLOGCCOIBHBT9ZW'
const depth = 3
const minWeightMagnitude = 9

const query = {
    addresses: [outAddress],
    tags: ['XXX']
}

global.sendMessage = async () => {
    try {
        const message = Converter.asciiToTrytes(document.getElementById("message").value)
        const transfers = [{
            value: 0,
            address: outAddress,
            tag: 'XXX',
            message: message
        }]
        const trytes = await iota.prepareTransfers(seed, transfers)
        const bundle = await iota.sendTrytes(trytes, depth, minWeightMagnitude)
        document.getElementById("message").value = ''
        console.log(`Published message with tail hash: ${bundle[0].hash}`)
    } catch (err) {
        console.error(err.message)
    }
}

const messages = {}

const findMessages = async () => {
    try {
        const transactions = await iota.findTransactionObjects(query)
        transactions.map(transaction => {
            if (typeof messages[transaction.hash] == 'undefined') {
                const msg = Converter.trytesToAscii(transaction.signatureMessageFragment.replace(/9*$/, ''))
                messages[transaction.hash] = msg
                document.getElementById("show").innerHTML += "<p>" + msg + "</p>"
            }
        })
    } catch (err) {
        console.error(err.message)
    }
}

setInterval(() => findMessages(), 1000)
