const router = require ("express").Router()
const mongoose = require ("mongoose")
const Actionplan = require("../models/Actionplan.model")
const Step = require("../models/Step.model")

//post/api/actionplans/:actionplanId/steps
router.post("/actionplans/:actionplanId", (req,res,next)=>{
    const {
        action,
        comment,
        deadline,
        location,
        status,
        actionplanId
    }= req.body

    const newStep = {
        action,
        comment,
        deadline,
        location,
        status,
        actionplanId
    }

Step.create(newStep)
        .then(stepFromDB => {
            return Actionplan.findByIdAndUpdate(actionplanId, { $push: { steps: stepFromDB._id } });
        })
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new step", err);
            res.status(500).json({
                message: "error creating a new step",
                error: err
            });
        })
});

//get/api/actionplans/:actionplanId/:stepId
router.get("/actionplans/:actionplanId/:stepId", (req,res,next)=>{
    const {stepId}= req.params;

    Step.findById(stepId)
    .then(stepfromDB=>{
        console.log(stepfromDB)
        res.json(stepfromDB)
    })
    .catch(err => {
        console.log("error displaying list of actionplans", err);
        res.status(500).json({
            message: "error displaying list of actionplans",
            error: err
        });
    })
})

//put/api/actionplans/:actionplanId/:stepId
router.put("/actionplans/:actionplanId/:stepId", (req,res,next)=>{
    const {stepId}= req.params;

    if(!mongoose.Types.ObjectId.isValid(stepId)){
        res.status(400).json({message: "specified id is not valid"})
        return
    }

    Step.findByIdAndUpdate(stepId, req.body, {new: true})
    .then(updatedStep => res.json(updatedStep))
    .catch(err => {
        console.log("error updating step", err);
        res.status(500).json({
            message: "error updating step",
            error: err
        });
    })

})

//delete/api/actionplans/:actionplanId/:stepId
router.delete("/actionplans/:actionplanId/:stepId", (req,res,next)=>{
    const {stepId} = req.params;
    

    if(!mongoose.Types.ObjectId.isValid(stepId)){
        res.status(400).json({message: "specified id is not valid"})
        return
    }

    Step.findByIdAndDelete(stepId)
    .then(()=>res.json({message: `Actionplan with ${stepId} is deleted`}))
    .catch(err => {
        console.log("error deleting step", err);
        res.status(500).json({
            message: "error deleting step",
            error: err
        });
    })
})



module.exports = router