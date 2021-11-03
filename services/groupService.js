const firebase = require('../firebase/index');
const userService = require('./userService');

const groupConverter = {
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data();
        return {
            
        }
    }
}

const getGroup = async groupID => {
    // Get group data
}

const updateGroup = async (groupID, data) => {
    // Check permissions
    // Update group data
}

const addMember = async (groupID, userID, role) => {
    // Find user document
    // Add to subcollection
}

const getMembers = async (groupID) => {
    // Return all members from subcollection
}

const removeMember = async (groupID, userID) => {
    // Find user document
    // Remove from subcollection
}

module.exports = {getGroup, updateGroup, addMember, getMembers, removeMember}