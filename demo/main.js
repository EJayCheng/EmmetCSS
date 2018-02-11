$(() => {
  let temp = [];
  let data = [];
  function deleteNote(_data) {
    let data = _data
      .map(desc => desc.trim().split("//")[0])
      .filter(desc => desc != "")
      .filter(desc => desc.indexOf("@import") == -1);
    let deleteFlag = false;
    for (let i in data) {
      let desc = data[i];
      if (desc.indexOf("*/") != -1) {
        deleteFlag = false;
        data[i] = desc.split("*/").pop();
      }
      if (deleteFlag) {
        data[i] = "";
      }
      if (desc.indexOf("/*") != -1) {
        deleteFlag = true;
        data[i] = desc.split("/*")[0];
      }
    }
    return data.filter(desc => desc != "");
  }
  function splitClass(_data) {
    let deepIndex = 0;
    let startIndex = 0;
    let data = [];
    for (let i in _data) {
      let desc = _data[i];
      if (desc.indexOf("{") != -1) {
        deepIndex++;
      }
      if (desc.indexOf("}") != -1) {
        deepIndex--;
        if (deepIndex == 0) {
          let classDesc = _data
            .slice(startIndex, i * 1 + 1)
            .join("")
            .trim();
          let className = classDesc
            .split("{")[0]
            .split(",")
            .map(name => name.trim())
            .filter(name => name[0] == ".");
          startIndex = i * 1 + 1;
          if (className.length == 0) continue;
          let classAttr = classDesc
            .split("}")
            .join("")
            .split("{")[1]
            .split(";")
            .map(attr => attr.trim())
            .filter(attr => attr != "");
          console.log(classDesc, className, classAttr);
          temp.push({
            classDesc: classDesc,
            className: className,
            classAttr: classAttr
          });
          data.push(
            classDesc
              .split(",")
              .join(",\n")
              .split("{")
              .join("\n{\n    ")
              .split(";")
              .join(";\n    ")
              .split(";\n    }")
              .join("\n}")
          );
        }
      }
    }
    return data;
  }
  $("#loader").load("../scss/emmet.scss", function(_data) {
    data = splitClass(deleteNote(_data.split("\n")));
    console.log(JSON.stringify(temp));
  });
  let $searchInput = $("#searchInput");
  let $res = $("#res");
  $searchInput.keydown(() => {
    $res.val(
      data
        .filter(desc => desc.indexOf($searchInput.val()) != -1)
        .join("\n\n--------------\n\n")
    );
  });
});
