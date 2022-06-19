const Parse = require('parse/node');
const fs = require('fs');

Parse.initialize("KaN0L8q4IDEc3V1Fs47K0rzLNc2QE7d6ESI2FMmL", "9MczE8wX3MYuMz9hvM97HOSdTI9bs8bRVUrPrhzB"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

//uploadPhotos();
updateSpecies();

function uploadPhotos() {
    fs.readdir("./photos", (err, files) => {
        if (err)
          console.log(err);
        else {
          files.forEach(file => {
            fs.readFile("./photos/"+file, function(e, data) {
              if (e) {
                  throw e;
              }
              var specieName = file.split(" ")[0]
              const fileU = new Parse.File(specieName, Array.from(Buffer.from(data, 'binary')), "image/jpg");
              fileU.save().then(function() {
                const speciePhoto = new Parse.Object("SpeciePhoto");
                speciePhoto.set("specieName", specieName);
                speciePhoto.set("speciePhoto", fileU);
                speciePhoto.save();
              }, function(error) {
                console.log(error)
              });              
          });
          })
        }
      })
}

async function updateSpecies() {
  const Specie = Parse.Object.extend("Specie");
  const query = new Parse.Query(Specie);
  const species = await query.find();
  for (let i = 0; i < species.length; i++) {
    const specie = species[i];
    const SpeciePhoto = Parse.Object.extend("SpeciePhoto");
    const queryPhoto = new Parse.Query(SpeciePhoto);
    queryPhoto.startsWith("specieName", specie.get('specie_id'));
    queryPhoto.limit(1);
    queryPhoto.find().then(function(result) {
      console.log(result);
      if(result.length != 0) {
      specie.set("logo", result[0].get("speciePhoto"));
      specie.save();
      }
    }
  );
  }
}
