const multer = require("multer");

const mime_type_map = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    const isValid = mime_type_map[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    cb(null, "express_src/images");
  },
  filename: (req,file,cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = mime_type_map[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+ext)
  }
});

module.exports = multer({storage:storage}).single("image")
