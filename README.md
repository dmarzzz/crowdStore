
<div align="center">
    <img style="max-width: 900px" src="crowdStoreLogo.png">
</div>

Proof-of-Concept system to incentivize document propagation. Front end + back end for user to upload a document to filecoin and receive an NFT on ethereum. Currently only on localnet and was created for HackFS so code is not finalized and should be used more as an example for time being.

submission video: https://www.youtube.com/watch?v=Vz9X6tHTUYM&feature=youtu.be


## ⬇️ Installation⬇️

In order to run the demo, you will need to first have [powergate])(https://github.com/textileio/powergate) (ipfs + filecoin nodes) and [builder](https://github.com/nomiclabs/buidler) a local blockchain network running, then you will need to deploy your smart contract and start the forum web app (demo), the seed page web app(client), and the verification/mint backend(backend). 

# Install
cd client && npm install

# Buidler 
this link has instructions for making sure your environment is set up properly so check out if commands dont work
https://buidler.dev/tutorial/

from root run:
npm install && npx buidler test
