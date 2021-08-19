const { Router } = require('express');
let express =  require('express');
let router = express.Router();
let validateSession = require('../middleware/validate.session');
let Log= require('../db').import('../models/log');

router.get('/practice', function(req, res) 
{
    res.send('Hey! This is a practice route!')
});

 /** **CREATE LOG***
 *****/
router.post('/create', validateSession, (req, res) =>  {
    const logEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
        owner_id: req.user.id
    }
    Log.create(logEntry)
        .then(logs => res.status(200).json(logs))
        .catch(err => res.status(500).json({error: err}))
});

// /*****
//  * GET ALL LOGS BY USER *
//  */
router.get("/", validateSession, (req, res) => {
    let userid = req.user.id
    Log.findAll({
       where: { owner_id: userid } 
    })
    .then(logs => res.status(200).json(logs))
    .catch(err => res.status(500).json({ error: err }))
});

// /*******
//  * GET LOGS BY ID ***
//  ********/
 router.get("/:entryId", function (req, res) {
    let entryId = req.params.entryId;
    Log.findAll({
       where: { id: entryId } 
    })
    .then(logs => res.status(200).json(logs))
    .catch(err => res.status(500).json({ error: err }))
});

/**Update log by a user */
router.put("/update/:entryId", validateSession, function (req, res) {
    const updateLogEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
    };
    const query = { where: { id: req.params.entryId, owner_id: req.user.id} };

    Log.update(updateLogEntry, query)
        .then((logs) => res.status(200).json(logs))
        .catch((err) => res.status(500).json({ error: err }));
});
/**Delete Log */
router.delete("/delete/:entryId", validateSession, function (req, res) {
    const query = { where: { id: req.params.entryId, owner_id: req.user.id } };

    Log.destroy(query)
    .then(() => res.status(200).json({ message: "Log Entry Removed" }))
    .catch((err) => res.status(500).json ({ error: err }));
});

module.exports = router;