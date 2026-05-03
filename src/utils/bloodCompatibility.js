const recipientCompatibility = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

const getCompatibleDonorTypes = (recipientBloodType) => {
  return recipientCompatibility[recipientBloodType] || [];
};

const getCompatibleRequestTypes = (donorBloodType) => {
  return Object.entries(recipientCompatibility)
    .filter(([recipient, donors]) => donors.includes(donorBloodType))
    .map(([recipient]) => recipient);
};

module.exports = {
  getCompatibleDonorTypes,
  getCompatibleRequestTypes
};
