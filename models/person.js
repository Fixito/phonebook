import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        const regexMatch = /^\d{2,3}-\d{5,}$/.test(v);
        console.log(regexMatch, v);
        const isLengthValid = v.length >= 8;
        return regexMatch && isLengthValid;
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
});

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model('Person', personSchema);
