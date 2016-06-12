'use strict';

var objectHelpers = require('../reducers/object_helpers');
var stringHelpers = require('../reducers/string_helpers');

/*
 * This module is responsibe for the state used by tabs: WL_STATE.ui.tabs
 * the tab state is generated by the dom elements which are found by the watcher
 * when the watcher finds a tab, it sends the details here to the guard.
 * There is an array (tabs) within which only one named tab can be true at any time
 * the state of said tab is a named object attribute of the <tab_group>
 * This may seem weird to have everything split between individual objects 
 * and an array, but the array is good for in here (looping over an object is a bit complex)
 * and rivets only reads state from an object, unless you're generating that 
 * object from an array, which is normal, except here where we're doing the oposite.
 * so that's tabs!
 * 
 * Example tab group state object: {
		<tab_group_name>: {
			tabs: [ <tab_name>, <tab2_name> ],
			<tab_name>: true,
			<tab2_name>: false
		]
	}
*/


module.exports = {

	createTabGroup: function(groupName){
		var checkError = false;

		//first check the name we've been passed is all good
		if (typeof(groupName) != 'string' || groupName == null || groupName == undefined) {
			console.error("There's someting weird about the tab group you're trying to add that tab to: ", WL_STATE.ui.tabs[groupName]);
			checkError = true;
		}

		//check if the tab name has any white space or caps, can't do that with rivets	
		if (stringHelpers.hasWhiteSpace(groupName) || stringHelpers.hasUpperCaseChars(groupName)) {
			console.error("Sorry, tab names cannot have white space or uppercase characters");
			checkError = true;
		}

		//now lets check that the group doesn't already exist
		if (WL_STATE.ui.tabs.hasOwnProperty(groupName)) {
			console.warn("Tab group already exists, not adding");
			checkError = true;
		}

		if (!checkError) {
			//yeay! New tab group!
			console.info('setting new empty tab group');
			WL_STATE.ui.tabs[groupName] = {tabs:[]};
		}
	},

	addTabToTabGroup: function(groupName, tabName){
		var checkError = false;

		//first check the tab name is good
		if (typeof(tabName) != 'string' || tabName == undefined || tabName == null) {
			console.error("There's something weird about the name of the tab you're trying to create: ", tabName);
			checkError = true;
		}

		//check if the tab name has any white space or caps, can't do that with rivets	
		if (stringHelpers.hasWhiteSpace(tabName) || stringHelpers.hasUpperCaseChars(tabName)) {
			console.error("Sorry, tab names cannot have white space or uppercase characters");
			checkError = true;
		}

		//and check the group name
		if (typeof(groupName) != 'string' || groupName == null || groupName == undefined) {
			console.error("There's someting weird about the tab group you're trying to add that tab to: ", WL_STATE.ui.tabs[groupName]);
			checkError = true;
		}

		//and make sure the group exists and is valid
		if (typeof(WL_STATE.ui.tabs[groupName]) != 'object') {
			console.error("There's something weird about the tab group you're trying to add your tab to: ", WL_STATE.ui.tabs[groupName]);
			checkError = true;
		}

		if (!checkError) {
			//yeay! new tab :) also don't worry about cloning / mutating / applying to the global state, rivets shouldn't be running yet

			//first add the tab to the tab group array
			WL_STATE.ui.tabs[groupName].tabs.push(tabName);

			//now add the named tab state object for rivets
			if (WL_STATE.ui.tabs[groupName].tabs.length > 1) {
				WL_STATE.ui.tabs[groupName][tabName] = false;
			} else {
				//by default, the first tab is true
				WL_STATE.ui.tabs[groupName][tabName] = true;
			}
		}
	},

	activateTab: function(groupName, tabToActivate){
		//going to assume the creation process above caught any tab bugs so we can run this afap! giggity
		var newTabGroup = objectHelpers.cloneThisObject(WL_STATE.ui.tabs[groupName]);

		for (var t = 0; t < newTabGroup.tabs.length; t++) {
			//set all the tabs to false (using the array to get the tab's attribute name, eh! see what I did there! nice.)
			newTabGroup[newTabGroup.tabs[t]] = false;
		}

		newTabGroup[tabToActivate] = true;	
		console.log('WL_STATE.ui.tabs[groupName]: ', WL_STATE.ui.tabs[groupName]);
		WL_STATE.ui.tabs[groupName] = newTabGroup;
	}
};