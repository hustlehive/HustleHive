const asyncHandler=require("express-async-handler");

const User=require("../models/userModel");
const Hustle=require("../models/hustleModel");
const Application=require("../models/hustleApplicationModel");
const FriendRequest=require("../models/friendRequestModel");
const cloudinary=require("../config/cloudinary");
const Message=require("../models/messageModel");
const Conversation=require("../models/conversationModel");
const Notification=require("../models/notificationModel");


const getDashboard=asyncHandler(async(req,res)=>{

    const totalUsers=await User.countDocuments();

    const totalHustles=await Hustle.countDocuments();

    const activeHustles=await Hustle.countDocuments({
        status:"open"
    });

    const completedHustles=await Hustle.countDocuments({
        status:"completed"
    });

    const totalApplications=await Application.countDocuments();

    const totalFriendships=await FriendRequest.countDocuments({
        status:"accepted"
    });

    res.status(200).json({
        success:true,
        dashboard:{
            totalUsers,
            totalHustles,
            activeHustles,
            completedHustles,
            totalApplications,
            totalFriendships
        }
    });

});


const getUsers=asyncHandler(async(req,res)=>{

    const users=await User.find()
    .select("-password")
    .sort({createdAt:-1});

    res.status(200).json({
        success:true,
        count:users.length,
        users
    });

});


const getUser=asyncHandler(async(req,res)=>{

    const user=await User.findById(req.params.userId)
    .select("-password");

    if(!user){
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        success:true,
        user
    });

});


const deleteUser=asyncHandler(async(req,res)=>{

    const user=await User.findById(req.params.userId);

    if(!user){
        res.status(404);
        throw new Error("User not found");
    }

    if(user.profilePic.publicId){
        await cloudinary.uploader.destroy(
            user.profilePic.publicId
        );
    }

    const hustles=await Hustle.find({
        createdBy:user._id
    });

    for(const hustle of hustles){
        if(hustle.photo.publicId){
            await cloudinary.uploader.destroy(
                hustle.photo.publicId
            );
        }
    }

    await Hustle.deleteMany({
        createdBy:user._id
    });

    await Application.deleteMany({
        $or:[
            {applicant:user._id},
            {acceptedApplicant:user._id}
        ]
    });

    await FriendRequest.deleteMany({
        $or:[
            {sender:user._id},
            {receiver:user._id}
        ]
    });

    await Notification.deleteMany({
        $or:[
            {sender:user._id},
            {receiver:user._id}
        ]
    });

    // await Message.deleteMany({
    //     sender:user._id
    // });

    // await Conversation.deleteMany({
    //     participants:user._id
    // });

    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    });

});


const getHustles=asyncHandler(async(req,res)=>{

    const hustles=await Hustle.find()
    .populate(
        "createdBy",
        "username fullName college"
    )
    .sort({createdAt:-1});

    res.status(200).json({
        success:true,
        count:hustles.length,
        hustles
    });

});


const deleteHustle=asyncHandler(async(req,res)=>{

    const hustle=await Hustle.findById(req.params.hustleId);

    if(!hustle){
        res.status(404);
        throw new Error("Hustle not found");
    }

    if(hustle.photo.publicId){
        await cloudinary.uploader.destroy(
            hustle.photo.publicId
        );
    }

    await Application.deleteMany({
        hustle:hustle._id
    });

    await Notification.deleteMany({
        referenceId:hustle._id
    });

    await hustle.deleteOne();

    res.status(200).json({
        success:true,
        message:"Hustle deleted successfully"
    });

});


const getApplications=asyncHandler(async(req,res)=>{

    const applications=await Application.find()
    .populate(
        "applicant",
        "username fullName college"
    )
    .populate(
        "hustle",
        "title reward status"
    )
    .sort({createdAt:-1});

    res.status(200).json({
        success:true,
        count:applications.length,
        applications
    });

});


module.exports={
    getDashboard,
    getUsers,
    getUser,
    deleteUser,
    getHustles,
    deleteHustle,
    getApplications
};