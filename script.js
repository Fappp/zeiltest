(function() {
  const START = 0;
  const END = 1;
  let display = $("#display");
  let el;

  let shipData = [];

  let availabilityData = [];

  for (let key in availability) {
    shipData[key] = null;
    if (availability.hasOwnProperty(key)) {
      let hasData = !Array.isArray(availability[key]);
      availabilityData.push(hasData ? availability[key] : "empty set");
      if (hasData) {
        shipData[key] = new ShipData(null, availability[key], null);
      }
    }
  }

  console.log(shipData);

  function dateModified(d) {
    $("#display").empty();
    let date = $("#date" + d)
      .val()
      .split("-");
    let newDate = date[1] + "/" + date[2] + "/" + date[0];
    let stamp = new Date(newDate).getTime();
    $("#datestamp" + d).val(stamp / 1000);

    if (d === 0 && $("#date1").val() === "") {
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
            "<b>Filter Gegevens</b><br/><br/>Boot ID: " +
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
              "Aantal dagen geselecteerd: " +
              calculateLength() +
              " dag(en)<br /><br/><b>Agenda Data:</b><br/><br/>"
          );
          for (let d in availabilityData[a]) {
            let arr = availabilityData[a][d];
            let tripLength = calculateLength(arr[0], arr[1]);
            let tripType = getTripType(tripLength, arr[0], tripLength);
            let available = isAvailable(arr[0], arr[1], tripType, tripLength);
            el.append(
              stampToDetail(arr[0]) +
                " t/m " +
                stampToDetail(arr[1]) +
                "<br />" +
                "Trip Lengte: " +
                tripLength +
                "<br />Trip Type: " +
                tripType +
                "<br />Beschikbaar: " +
                available +
                "<br /><br />"
            );
          }
          display.append(el);
        }
      }
    }
  }

  function isAvailable(s, e, t, l) {
    let startDay = stampToWeekday(s);
    let userStart = $("#datestamp0").val();
    let userEnd = $("#datestamp1").val();
    let userLength = calculateLength();

    if (
      t === "Weekendtocht" &&
      userLength < 3 &&
      (userStart === "Vrijdag" || userStart === "Zaterdag")
    ) {
      return false;
    } else if (userLength < 1 && (t === "Dagdeel" || t === "Avondtocht")) {
      return true;
    } else {
      return false;
    }
  }

  function calculateLength(s, e) {
    let l = 0;
    if (!s && !e) {
      if ($("#datestamp0").val() === $("#datestamp1").val()) {
        return l;
      } else {
        l = $("#datestamp1").val() - $("#datestamp0").val();
        return l / 86400;
      }
    } else {
      l = e - s;
      return (Math.round((l / 86400) * 100) / 100).toFixed(1);
    }
  }

  function getTripType(l, s = -1, e = -1) {
    let start = new Date(s).getHours();
    if (l > 1) {
      if (
        l < 3 &&
        (stampToWeekday(s) === "Vrijdag" || stampToWeekday(s) === "Zaterdag")
      ) {
        return "Weekendtocht";
      } else if (
        l < 6 &&
        (stampToWeekday(s) !== "Vrijdag" ||
          stampToWeekday !== "Zaterdag" ||
          stampToWeekday !== "Zondag")
      ) {
        return "Midweek";
      } else {
        return "Meerdaags";
      }
    } else if (l < 0.5) {
      if (start > 16) return "Avondtocht";
      else {
        return "Dagdeel";
      }
    } else {
      return "Dagtocht";
    }
  }

  function stampToDetail(timestamp) {
    let d = new Date(timestamp * 1000);
    return (
      d.getDate() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getFullYear() +
      " " +
      d.getHours() +
      ":" +
      (d.getMinutes() + "" + 0).substring(0, 2)
    );
  }

  $('input[type="checkbox"]').on("change", checkTimeBlocks);

  function checkTimeBlocks() {
    let dagdeel = $("#dagdeel").prop("checked");

    console.log(dagdeel);
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
