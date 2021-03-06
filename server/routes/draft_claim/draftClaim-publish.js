var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the modals */
var User = require('../../models/user'),
	DraftClaim = require('../../models/draftClaim'),
	Claim = require('../../models/claim');

/*  _____  _     _ ______         _____ _______ _     _
 * |_____] |     | |_____] |        |   |______ |_____|
 * |       |_____| |_____] |_____ __|__ ______| |     |
 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=PUBLISH
 */

 /**
  * This moves a draft claim out into the published network.
  * For Alpha, this will only publish a single claim. Refrences to any drafts will be lost.
  * In a future update, the option to publish all / a selectiong of the refrenced drafts will be written.
  * Done: remove refrences to any draft claims in the argument groups.
  * Done: remove the draft claim from the user object
  * TODO: if removal of draft claims leaves an empty argument group, kill that too.
  * Done: return the entire user object
  * TODO: Update the status of any draft claims that refrence this guy to 'published!' <-- oh oh, spagetti code :(
  * TODO: Clean the input
  */
module.exports = function(req, res) {

	//This is the draftClaim that is being published
	var candidateClaim = req.body.draftClaim;

	//This is the user that's doing the publishing
	var currentUser = req.user;

	// Clean them? ============================================================ <- this should be like a blood-brain barrier

	async.waterfall([
			function(callback) {
			//1: check if there's an identicle claim already published
				Claim.find({'description':candidateClaim.description}).exec(function(err,result){
					if(err) callback(err);

					if (result.length){
						//Can't publish - there is an identical claim
						res.status(409);
						callback(new Error("Can't publish, identical claim already exists."));
					} else {
						//didn't find any conflicts, on to the publishing!
						callback(null);
					}
				});
			},
			function(callback) {
			//2: Remove any refrences to draft claims from candidate claim
				removeDraftRefrences('supporting');
				removeDraftRefrences('opposing');
				callback(null);


				function removeDraftRefrences(side) {
					for (var i = 0; i < candidateClaim[side].length; i++) {
						//console.log('this argument group: ', candidateClaim[side][i]);
						//iterate through reasons
						for (var j = 0; j < candidateClaim[side][i].reasons.length; j++) {
							//console.log('this reason: ', candidateClaim[side][i].reasons[j].reasonMeta.draft);
							if (candidateClaim[side][i].reasons[j].reasonMeta.draft) {
								// it's a draft, kill it
								candidateClaim[side][i].reasons.splice(j, 1);
								j--; //so the iterator doesn't skip

							}
						}

						//is there any reasons left in the group? No? Kill it.
						console.log('hows the group: ', candidateClaim[side][i].reasons.length);
						if (candidateClaim[side][i].reasons.length == 0) {
							console.log('reasons are gone, kill the group');

							candidateClaim[side].splice(i, 1);
							i--; //again, stop the iterator from getting confuzled.
						}
					}
				}

			},
			function(callback) {
				//3.1: Create a new claim object
				var newClaim = new Claim;
				newClaim.description = candidateClaim.description;
				newClaim.supporting = candidateClaim.supporting;
				newClaim.opposing = candidateClaim.opposing;
				newClaim.meta = candidateClaim.meta; //TODO: remode 'draft' meta - it's not required

				//3.2 Save new claim object to db
				newClaim.save(function(err,result){
					if(err) {
						res.status(500);
						callback(new Error("Can't publish, DB error: " + err));
					} else {
						callback(null, result);
					}
				});
			},
			function(newPublishedClaim, callback) {
				//4 remove old draft claim from draft claims db
				// TODO: this is repeated code from the draftClaim-delete.js route... probably need to manage this more efficently
				DraftClaim.find({'_id':candidateClaim._id}).remove().exec(function(err,result){
					if(err){
						res.status(500);
						callback(new Error("Can't remove draft claim, DB error: " + err));
					} else {
						callback(null, newPublishedClaim);
					}
				});
			},
			function(newPublishedClaim,callback) {
				//5.1: add newClaim to user's published list
				currentUser.meta.published.push(newPublishedClaim._id);
				
				//5.2: remove draftClaim from user's unPublished list
				var killDex = currentUser.meta.unPublished.indexOf(candidateClaim._id);
				currentUser.meta.unPublished.splice(killDex, 1);

				//5.3: save the new user object
				currentUser.save(function(err, result){
					if(err){
						res.status(500);
						callback(new Error("Can't update user profile, DB error: " + err));
					} 
					//success, move onto the next step
					callback(null, currentUser);
				});	
			}
		],
		function (err, currentUser) {//finished!
			if(err) {
				console.error('Error in draftClaim-publish.js: ', err);
				res.send('routes/draft_claim/draftClaim-publishjs <- ' + err);
			} else {
				//return the updated user object
				var userObjToSend = {};
					userObjToSend.meta = currentUser.meta; //stops us from sending the password and db id with the user object. Bit messy. but hey.
				res.status(200).send(userObjToSend);
			}
			
		}
	);
};
