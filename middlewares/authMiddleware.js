// const JWT=require("jsonwebtoken")

// module.exports = async (req,res,next)=>{
//     try{
//         const token = req.headers['authorization'].split(" ")[1]
//         JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
//             if (err) {
//                 return res.status(200).send({ message:'Auth Failed', success: false })
//             }
//             else {
//                 req.body.userId= decode.id
//                 next()
//             }
//         })

//     }catch(error){
//         console.log(error)
//         res.status(401).send({message:'Auth Failed',success:false})
//     }
// }




// const JWT = require("jsonwebtoken");
// const userModel = require("../models/userModel");

// module.exports = async (req, res, next) => {
//     try {
//         const token = req.headers['authorization'].split(" ")[1];

//         // Verify the token
//         JWT.verify(token, process.env.JWT_SECRET, async (err, decode) => {
//             if (err) {
//                 return res.status(200).send({ message: 'Auth Failed', success: false });
//             }

//             // Check if the user is blocked
//             const user = await userModel.findById(decode.id);
//             if (user?.isBlocked) {
//                 return res.status(403).send({ message: 'Your account has been blocked', success: false });
//             }

//             req.body.userId = decode.id;
//             next();
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(401).send({ message: 'Auth Failed', success: false });
//     }
// };


const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(" ")[1];

        if (!token) {
            return res.status(401).send({ message: "Auth Failed: No token provided", success: false });
        }

        JWT.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                return res.status(401).send({ message: "Auth Failed: Invalid token", success: false });
            }

            const user = await userModel.findById(decode.id);

            if (!user) {
                return res.status(404).send({ message: "User not found", success: false });
            }

            
            if (user.isBlocked && !user.isAdmin) {
                return res.status(403).send({ message: "Your account has been blocked", success: false });
            }

            req.body.userId = req.body.userId || decode.id;
            req.body.isAdmin = user.isAdmin; 


            
            req.user = { id: decode.id, isAdmin: user.isAdmin };

            next();
        });
    } catch (error) {
        console.log("Middleware error:", error);
        res.status(500).send({ message: "Internal Server Error", success: false });
    }
};
