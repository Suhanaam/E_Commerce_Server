import e from "express";//default import
import { changePassword, CheckUser, deactivateUser, deleteUser, forgotPassword, updateAddress, userLogin, userLogout, userProfile, userProfileUpdate, userSignup} from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router=e.Router();

router.get('/', (req, res) => {
    res.send('Hello World3!')
  });


//signup
router.post("/signup",userSignup);
//login
router.put("/login",userLogin);
//profile
router.get("/profile",authUser,userProfile)

//profile-edit
router.put("/update",authUser,userProfileUpdate);

//profile deActivate
router.put("/deactivate", authUser, deactivateUser);

//profile delete
router.delete("/delete", authUser, deleteUser);

//forgot password
router.patch("/forgot", forgotPassword);

//change password
router.patch("/change", authUser, changePassword);

//address update
router.put("/address-update", authUser, updateAddress);








//profile delete
router.delete("/delete")

//logout
router.get("/logout",userLogout)
//forget-password
router.patch("/forgot")
//password-change
router.patch("/change")
//address-update


router.put("/deactivate-user/:userId",authAdmin);

//check-user
router.get("/check-user",authUser,CheckUser)


export { router as userRouter };
