(function() {
  const START = 0;
  const END = 1;
  let display = $("#display");
  let display2 = $("#display2");
  let el;

  let availabilityData = [];

  for (let key in availability) {
    if (availability.hasOwnProperty(key)) {
      let hasData = !Array.isArray(availability[key]);
      availabilityData.push(hasData ? availability[key] : "empty set");
      if (hasData) {
        el = $("<div>", { class: "item data" });
        el.html(key + "<br />" + JSON.stringify(availability[key]));
        //display.append(el);
      }
    }
  }

  function dateModified(d) {
    $("#display2").empty();
    let date = $("#date" + d)
      .val()
      .split("-");
    let newDate = date[1] + "/" + date[2] + "/" + date[0];
    let stamp = new Date(newDate).getTime();
    $("#datestamp" + d).val(stamp / 1000);

    if (d == 0 && $("#date1").val() === "") {
      // HALT HERE IF START DATE
      $("#date1").val($("#date0").val());
      dateModified(1);
      return;
    }

    for (let a in availabilityData) {
      if (availabilityData[a] !== "empty set") {
        if (availabilityData.hasOwnProperty(a)) {
          el = $("<div>", { class: "item date" });
          let n = parseInt(a, 10) + 1;
          el.append(
            "Boot ID: " +
              n +
              "<br />" +
              stampToWeekday($("#datestamp0").val()) +
              " " +
              $("#date0").val() +
              " t/m " +
              stampToWeekday($("#datestamp1").val()) +
              " " +
              $("#date1").val() +
              "<br />" +
              "Trip Lengte: " +
              calculateLength() +
              "<br /><br/>"
          );
          for (let d in availabilityData[a]) {
            el.append(availabilityData[a][d] + " <br /> ");
          }
          console.log(
            "allData for ",
            n,
            availabilityData[a],
            availabilityData[a][d]
          );
          display2.append(el);
        }
      }
    }
  }

  function isAvailable(s, e) {}

  function calculateLength() {
    if ($("#datestamp0").val() === $("#datestamp1").val()) {
      return 0;
    } else {
      let l = $("#datestamp1").val() - $("#datestamp0").val();
      return l / 86400;
    }
  }

  function stampToWeekday(timestamp) {
    var a = new Date(timestamp * 1000);
    var days = [
      "Zondag",
      "Maandag",
      "Dinsdag",
      "Woensdag",
      "Donderdag",
      "Vrijdag",
      "Zaterdag"
    ];
    var dayOfWeek = days[a.getDay()];
    return dayOfWeek;
  }

  $("#date0").change(function() {
    dateModified(START);
  });
  $("#date1").change(function() {
    dateModified(END);
  });
})();
