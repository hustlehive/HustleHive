const multer=require("multer");
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const cloudinary=require("../config/cloudinary");

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"HustleHive/hustles",
        allowed_formats:[
            "jpg",
            "jpeg",
            "png",
            "webp"
        ]
    }
});

const uploadHustleImage=multer({storage});

module.exports=uploadHustleImage;