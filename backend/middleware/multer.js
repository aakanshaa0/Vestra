import multer from "multer";

const storage = multer.diskStorage({
    fileName: function(req, file, callback){
        callback(null, file.originalName)
    }
})

const upload = multer({storage});

export default upload;