require('dotenv').config();
const mongoose = require('mongoose');
const mongoDB = require('mongodb');
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, 'useCreateIndex': true});

const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model("Person", personSchema);


const createAndSavePerson = (done) => { 
  const person = new Person({
    "name": "Ibra",
    "age": 32, 
    "favoriteFoods": ["Omelet", "Melon"]
  });

  person.save((err,data) => {
    if (err) return done(err);
  return done(null , data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople,(err, data)=>{
    if(err) return done(err);
    return done(null, data);
  })
};

const findPeopleByName = (personName, done) => {
  console.log(personName);
  console.log(typeof personName);
  Person.find({name: personName}, (err, data) => {
     if (err) return done(err);
    return done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data)=> {
     if (err) return done(err);
    return done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({_id: personId}, (err, data)=>{
    if(err) return done(err);
    return done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById({_id: personId}, (err, person)=>{
    err ? console.error(err) : person;
    person.favoriteFoods.push(foodToAdd);
    person.markModified("edited-field");
    person.save((err, person )=>err ? console.error(err) : done(null, person));
  });
};

//Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback) -- Mongoose Docs
const findAndUpdate = (personName, done) => {
  const query = {name: personName};
  const ageToSet = 20;
  const newData = {age: ageToSet};
  const options = {new: true, useFindAndModify: false};
  
  Person.findOneAndUpdate(query, newData, options, (err, person) => {
    err ? console.log(err) : person;
    person.markModified("edited-field");
    person.save((err, person ) => err ? console.error(err) : done(null, person));
  });
};

//Model.remove(conditions -object-, options -object-, callback -function-) --Mongoose Docs
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson)=>{
    err ? console.log(err) : removedPerson;
    removedPerson.remove(removedPerson, (err, removedPerson)=>{
      err ? console.log(err) : done(null, removedPerson);      
    });
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove}, (err, res)=>{
    err ? console.log(err) : done(null, res);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person
  .find({favoriteFoods: foodToSearch})
  .sort('name')
  .limit(2)
  .select('-age')
  .exec((err, data)=> {
    err ? console.log(err) : done(null, data)
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
