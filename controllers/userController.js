import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { cloudinaryInstance } from "../config/cloudinary.js";
const NODE_ENV=process.env.NODE_ENV
export const userSignup=async(req,res,next)=>{
    try {
        console.log('sign in ');
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);
       // res.send('Hello World4!');
        //res.json({message:"signup success"})



        //collect user data
        const {name,email,password,confirmPassword,mobile,profilePic}=req.body;
        // data validation

        if(!name||!email||!password||!confirmPassword||!mobile)
            {
            return res.status(400).json({message:"all fields are required"});

        }
        console.log(name,email,mobile);
        

        //check if already exist

        const userExist=await User.findOne({email})

        if(userExist){
            return res.status(400).json({message:"user already exist"})
        }

         const cloudinaryRes=await cloudinaryInstance.uploader.upload(req.file.path)
         console.log("cloudinary response====",cloudinaryRes);
        

        //compare with confirm password
        if(password!==confirmPassword)
        {
            return res.status(400).json({message:"password not same"});
        }


        //password hashing
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser= new User({name,email,password:hashedPassword,mobile,profilePic:cloudinaryRes.url});
        await newUser.save()


        
        //generate token using id and role
       const token=generateToken(newUser.id,"user");
       res.cookie('token',token,{
        sameSite:NODE_ENV==="production"?"none":"Lax",
        secure:NODE_ENV==="production",
        httpOnly:NODE_ENV==="production",
       });
       res.json({data:newUser,message:"signup accessed"})


        
    } catch (error) {

        res.status(error.statuscode||500).json({message:error.message||'internal server error'})
        console.log(error);


        
    }
}


//login
export const userLogin=async(req,res,next)=>{
    try {
       
         //collect user data
         const {email,password}=req.body;



         // data validation
 
         if(!email||!password)
             {
             return res.status(400).json({message:"all fields are required"});
 
         }
       // user exist
       const userExist=await User.findOne({email})
        if(!userExist)
        {
            return res.status(404).json({message:"user not found"});

        }
       //password mach
       
       const passwordMatch=bcrypt.compareSync(password,userExist.password);

       if(!passwordMatch){
        return res.status(401).json({message:"invalid credential"})
       }
//active check
     if(!userExist.isActive)
     {
        return res.status(401).json({message:"user account is not active"});
     }

       //token
       const token=generateToken(userExist._id,"user");
       res.cookie('token',token,{
        sameSite:NODE_ENV==="production"?"none":"Lax",
        secure:NODE_ENV==="production",
        httpOnly:NODE_ENV==="production",
       });
       console.log("login success");

       //DELETE PASSWORD FROM OBJRECT RESPONSE:


    //    {
    //     const {password,...userDatawithoutpassword}=userExist;
    //     res.json({data:userDatawithoutpassword,message:"login success"})
    //    }

       delete userExist._doc.password;
       console.log("login success");
       res.json({data:userExist,message:"login success"})
       console.log("login success");
       console.log(userExist.name);

       


        
    } catch (error) {

        res.status(error.statuscode||500).json({message:error.message||'internal server error'})
        console.log(error);
        
    }
}

//profile fetch:

export const userProfile=async(req,res,next)=>{
    try {
       //user id
      // console.log("hit hit");
       const userId=req.user.id;
       //const userId="67db08da5874baf467eabfca"
       const userData=await User.findById(userId).select("-password");
       res.json({data:userData,message:"user profile fetched"})
       
        
    } catch (error) {

        res.status(error.statuscode||500).json({message:error.message||'internal server error'})
        console.log(error);
        
    }
}


//user profile update

export const userProfileUpdate=async(req,res,next)=>{
    try {
       //user id
      // console.log("hit hit");

      const {name,email,password,confirmPassword,mobile,profilePic}=req.body;
      const userId=req.user.id;
      //userId="67db08da5874baf467eabfca"
       const userData=await User.findByIdAndUpdate(userId,{name,email,password,confirmPassword,mobile,profilePic},{new:true});
       res.json({data:userData,message:"user profile fetched"})
       
        
    } catch (error) {

        res.status(error.statuscode||500).json({message:error.message||'internal server error'})
        console.log(error);
        
    }
}

//logout

export const userLogout=async(req,res,next)=>{
    try {

        res.clearCookie("token",{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        res.json({message:"user logout success"});
   
        
    } catch (error) {

        res.status(error.statuscode||500).json({message:error.message||'internal server error'})
        console.log(error);
        
    }
}

//check user

export const CheckUser=async(req,res,next)=>{
    try {

        
        res.json({message:"user autherized"});
   
        
    } catch (error) {

        res.status(error.statuscode||500).json({message:error.message||'internal server error'})
        console.log(error);
        
    }
}


// Deactivate user account
export const deactivateUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
        res.json({ message: "User account deactivated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Delete user account
export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Here, you would send a reset token via email (not implemented yet)
        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Change Password
export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        const user = await User.findById(userId);
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }
        
        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Update Address
export const updateAddress = async (req, res, next) => {
    try {
        const { address } = req.body;
        const userId = req.user.id;
        
        const user = await User.findByIdAndUpdate(userId, { address }, { new: true });
        res.json({ message: "Address updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
