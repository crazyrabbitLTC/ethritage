//Front End Feedback
const { myEmitter } = require("./MyEmitter");
//ImageLoader
const loadImage = require("./loadImage");
//Exif Parser
const parseExif = require("./parseExif");
//Image Management
const resizeImage = require("./resizeImage");
//Watcher
const chokidar = require("chokidar");
//IPFS
const {IPFSnode, uploadToIPFS} = require("./IPFS");


//Variables
const watchedFolder = "./export";


IPFSnode.on("ready", () => {
  myEmitter.emit("IPFSREADY");
  watch();
})


const watcher = chokidar.watch(watchedFolder, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });



const watch = () => {
  watcher.on("add", async filePath => {
    myEmitter.emit('FileAdded', filePath);

    const image = await loadImage(filePath, myEmitter);

    const exif = await parseExif(image, myEmitter);

    const thumbnail = await resizeImage(image, myEmitter);

    const imageHash = await uploadToIPFS(image, myEmitter);
    const thumbHash = await uploadToIPFS(thumbnail, myEmitter);
    

    myEmitter.emit('TokenMinted');
      

  })
}
  


