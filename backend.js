function validateZipCode(zipCode) {
  if (typeof zipCode !== 'string' || zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
    return false;
  }
  return true;
}

function processUserData(userData) {
  if (!userData.fullName) {
    return { success: false, message: "Full Name is required." };
  }
  if (!userData.address1) {
    return { success: false, message: "Address 1 is required." };
  }
  if (!userData.city) {
    return { success: false, message: "City is required." };
  }
  if (!userData.state) {
    return { success: false, message: "State is required." };
  }
  if (!userData.zip) {
    return { success: false, message: "Zip Code is required." };
  }
  if (userData.skills.length === 0) {
    return { success: false, message: "Skills are required." };
  }
  if (userData.availability.length === 0) {
    return { success: false, message: "Availability is required." };
  }
  if (!validateZipCode(userData.zip)) {
    return { success: false, message: "Invalid Zipcode" };
  }

  if (userData.fullName.length > 50) {
    return { success: false, message: "Full Name exceeds 50 characters." };
  }
  if (userData.address1.length > 100) {
    return { success: false, message: "Address 1 exceeds 100 characters." };
  }
  if (userData.address2 && userData.address2.length > 100) {
    return { success: false, message: "Address 2 exceeds 100 characters." };
  }
  if (userData.city.length > 100) {
    return { success: false, message: "City exceeds 100 characters." };
  }

  let storedData = {
    ...userData,
    status: "processed"
  };
  return { success: true, message: "Data processed", data: storedData };
}

module.exports = {
  validateZipCode: validateZipCode,
  processUserData: processUserData,
};