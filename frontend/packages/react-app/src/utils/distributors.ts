import { Distributor } from "../interfaces";

const distributors: Distributor[] = [
  {
    id: "0xb562cf605a0f8a123bf7abfdfe1317671a8b5ead",
    distributorCid: "Qmf8C4mjVGgzxVzWcAevxCHZiCCUG38rxeDC7Byt5tsVoA",
    distributorMetadata: {
      name: "Wallet Address Distributor",
      description: "",
      image: "https://example.com/distributorimage.jpg",
    },
    type: "wallet",
    version: "",
  },
  {
    id: "0x590b4465a94be635bf2f760025c61ec3680f687c",
    distributorCid: "Qmf8C4mjVGgzxVzWcAevxCHZiCCUG38rxeDC7Byt5tsVoA",
    distributorMetadata: {
      name: "Audius Followers Distributor",
      description:
        "This distributor enables creators to distributes tokens for their followers on Auduis.",
      image: "https://example.com/distributorimage.jpg",
    },
    type: "audius",
    version: "",
  },
];

export default distributors;
