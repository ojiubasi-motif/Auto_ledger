import express from "express";
import CryptoJS from "crypto-js";
import verify from "../middleware/verifyToken.js";
import officer from "../models/officer.js";

const router = express.Router();

router.post("/officers", async (req, res) => {
    const {
        service_no,
        first_name,
        last_name,
        phone,
        email,
        avatar,
        office,
        password
    } = req.body

    if (Object.keys(req.body).includes("previleges") ||
        Object.keys(req.body).includes("status")) return res.status(403).json({
            msg: "you're NOT AUTHORIZED to update SOME data, contact the system admin",
            type: "NOT_AUTHORISED",
            code: 604,
        })
    try {
        const checkOfficer = await officer.findOne({ $or: [{service_no},{ email }, { phone }]},'service_no first_name last_name email phone');
        if(checkOfficer) return res.status(403).json({ msg: "this service_number, email and/or phone has been used by another officer", type: "EXIST", code: 602 });
        const id = "OFCR" + Math.floor(Math.random() * 105700 + 1)
        const newOfficer = new office({
            service_no:id,
            first_name,
            last_name,
            phone,
            email,
            avatar:avatar?avatar:'',
            office,
            password: CryptoJS.AES.encrypt(password, process.env.PW_CRYPT).toString()
        });
        const savedOfficer = await newOfficer.save();

     const { password:repsonsePass, _id, createdAt, updatedAt, __v, company, refresh_token, ...data } = savedOfficer._doc //filter the response
        res.status(201).json({ msg: "officer created success", data, type: "SUCCESS", code: 600 });
    } catch (error) {
        res.status(500).json({ msg: "error creating officer", data: error, type: "FAILED", code: 601 });
    }

})

// get a single officer record===
// router.get("/officers/:service_no", verify, async (req, res) => {
//     const { staff_id } = req.params;

//     if (!staff_id)
//         return res.status(401).json({
//             msg: "staff_id missing",
//             type: "WRONG_OR_MISSING_PAYLOAD",
//             code: 605,
//         });
//     const {
//         // email: userData?.email,
//         roles: userRoles,
//         company: userCompany,
//         office: userOffice,
//         status: userStatus,
//         id: userId,
//     } = req.user;

//     if (userStatus !== "active")
//         return res.status(403).json({
//             msg: "you're NOT authorized to fetch ANY staff record",
//             type: "NOT_AUTHORISED",
//             code: 604,
//         });
//     const fetchStaff = staff
//         .findOne({ id: staff_id }, "-_id -createdAt -updatedAt -__v -password")
//         .populate("company", "-_id id name")
//         .populate("office", "-_id id name");

//     try {
//         const staffdata = await fetchStaff.exec();
//         if (!staffdata)
//             return res.status(401).json({
//                 msg: "staff NOT found",
//                 type: "NOT_EXIST",
//                 code: 603,
//             });
//         if (
//             userId !== staffdata?.id ||
//             (userRoles.includes(113) && userCompany !== staffdata?.company?.id) ||
//             (userRoles.includes(111) && userCompany !== staffdata?.company?.id)
//         )
//             return res.status(403).json({
//                 msg: "you're NOT authorized to fetch THIS staff's record",
//                 type: "NOT_AUTHORISED",
//                 code: 604,
//             });

//         const { password, createdAt, updatedAt, __v, refresh_token, ...data } =
//             staffdata._doc;
//         res
//             .status(200)
//             .json({ msg: "staff record found", data, type: "SUCCESS", code: 600 });
//     } catch (error) {
//         res
//             .status(500)
//             .json({
//                 msg: "fetching staff error",
//                 data: error,
//                 type: "FAILED",
//                 code: 601,
//             });
//     }
// });
// ====update officer record=======
router.put("/officers/:service_no/update", verify, async (req, res) => {
    const { service_no } = req.params;
    if (!service_no)
      return res.status(401).json({
        msg: "service_no is  missing",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });
    const { roles: userRoles, id: userId } = req.user;
  
    if (!userRoles.includes(111))
      return res.status(403).json({
        msg: "you're NOT authorized to edit ANY officer record ",
        type: "NOT_AUTHORISED",
        code: 604,
      });
    const fetchOfficer = officer
      .findOne(
        { service_no },
        "-createdAt -updatedAt -__v -password -refresh_token"
      )
    // const fetchStore = store
    //   .findOne({ id: store_id })
    //   .populate("company", "id name");
    try {
      const officerData = await fetchOfficer.exec();
      if (!officerData)
        return res.status(401).json({
          msg: "officer NOT found",
          type: "NOT_EXIST",
          code: 603,
        });
      //limit the number of items that can be sent in the req.body
      if (Object.keys(req.body).length > 10) return res.status(403).json({
        msg: "you request isn't genuine",
        type: "NOT_AUTHORISED",
        code: 604,
      })
      // put checks on the fields that the admin can edit
      if (Object.keys(req.body).includes("office") || Object.keys(req.body).includes("service_no")
        || Object.keys(req.body).includes("email") || Object.keys(req.body).includes("phone")
        || Object.keys(req.body).includes("refresh_token")) {
        return res.status(403).json({
          msg: "you're NOT AUTHORIZED to edit SOME data, contact the system admin",
          type: "NOT_AUTHORISED",
          code: 604,
        })
      }
      // ===update the staff's record
      const updatedOfficer = await officer.findByIdAndUpdate(
        officerData?._id,
        {
          $set: req.body,
        },
        { new: true }
      )
  
      const { _id, createdAt, updatedAt, __v, password, refresh_token, ...data } = updatedOfficer._doc;
      res.status(200).json({ msg: "officer record update success", data, type: "SUCCESS", code: 600 });
  
    } catch (error) {
      res
        .status(500)
        .json({
          msg: "officer record update error",
          data: error,
          type: "FAILED",
          code: 601,
        });
    }
  });

export default router;