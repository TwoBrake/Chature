fs.readFile(
  "/supportRoles.json",
  "utf8",
  function readFileCallback(error, data) {
    if (error) {
      throw error;
    }

    var object = JSON.parse(data);
    let toAdd = "";

    object["guildId"] = toAdd;
    //object.array.push(toAdd);

    var json = JSON.stringify(object, null, 2);

    fs.writeFile("/supportRoles.json", json, "utf8", (error) => {
      if (error) {
        throw error;
      } else {
        console.log("Success!");
      }
    });
  }
);
