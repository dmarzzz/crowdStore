
<div align="center">
    <img style="max-width: 900px" src="crowdStoreLogo.png">
</div>

Proof-of-Concept system to incentivize document propagation. Front end + back end for user to upload a document to filecoin and receive an NFT on ethereum. Currently only on localnet and was created for [HackFS](https://hack.ethglobal.co/showcase/crowdstore-recaDjxxX1ZxwnOmv) hackathon so code is not finalized and should be used more as an example for time being.

submission video: https://www.youtube.com/watch?v=Vz9X6tHTUYM&feature=youtu.be


## ⬇️ Installation and deployment⬇️

In order to run the demo, you will need to first have [powergate])(https://github.com/textileio/powergate) (ipfs + filecoin nodes) and [builder](https://github.com/nomiclabs/buidler) a local blockchain network running, then you will need to deploy your smart contract and start the forum web app (demo), the seed page web app(client), and the verification/mint backend(backend). 

Install Powergate here : https://github.com/textileio/powergate/releases
run
BIGSECTORS=true make localnet

buidler:
npx buidler node
npx buidler run scripts/deploy.js

cd crowStore
npm install buidler
npx buidler buidler node

demo , seedPage :

cd crowdStore/x //where x=demo || x-seedPage
npm install
npm start

backend:

cd crowdStore/backend
npm install
node index.js 



## 📭Contributions📭
Pull requests are welcome!


## 💬To Do💬

- [x] Initial version of smart contracts : NFT mint function & address association
- [x] seedPage: smart contract interaction & storageDeal on filecoin working , all on react
- [x] demo: poll smart contract balance through web3js (wanted to compare ethersjs vs web3js) , all on react
- [x] backend: mint NFT through web3 and verify deal through lotus API , all on express
- [ ] More secure backend verification
- [ ] Add ability to customize deployment criteria (incentivize different parameters in the deal)

# Buidler 
this link has instructions for making sure your environment is set up properly so check out if commands dont work
https://buidler.dev/tutorial/
