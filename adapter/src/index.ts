import * as express from "express"
import * as ipfsClient from "ipfs-http-client"

const ipfs = ipfsClient("https://ipfs.infura.io:5001")
const app = express();

app.use(express.json());

app.get('/files/:cid/addresses/:address/existence', async (req, res) => {
    const cid = req.params.cid
    const address = req.params.address
    const content = await getFile(cid)
    const isAddressContained = content.addresses.includes(address) // Assume json like { "addresses": ["address1", "address2", ...] }

    return res.send(isAddressContained)
})

const getFile = async (cid) => {
    for await (const file of ipfs.get(cid)) {
        if (!file.content) {
            continue;
        }
        const content = []
        for await (const chunk of file.content) {
            content.push(chunk)
        }
        return JSON.parse(content.toString())
    }
}

app.listen(3000, () => {
    console.log('Server listening on port 3000')
})
