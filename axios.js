const axios = require("axios");
const querystring = require("querystring");

async function bookTeeTime() {
  try {
    // Define the data payload based on your form's requirements
    const payload = {
      Ressource_GUID: "{1C6D53A2-5E66-4FD6-89DB-424ADBF31A70}",
      Booking_Start: "20240909T060000",
      club_GUID: "{6D58C6D7-DC20-4F54-A1B2-9A79EBD5ABDD}",
      command: "next",
      commandValue: "",
      "FAC6E0FE-0E39-4124-AB7C-07EF4F93FAA4":
        "7811D867-FE45-439F-904C-D740E8A037AF",
      gbMembers: "0",
      guid_0: "{E81A8A4C-A6AD-4AAE-9441-046E272BF8E5}",
      txt_MemberClubID_0: "6-3871",
      GBDropDown_SelectedOption_ddIUnion_0: "DK",
      hidden_BookingPrice_0_9Hole: "0",
      hidden_BookingIsPaid_0: "0",
      hidden_BookingPrice_0: "0",
      hidden_ExtraPrice_0: "0",
      guid_1: "",
      chk_IsGuest_1: "0",
      GBDropDown_SelectedOption_ddIUnion_1: "favorite",
      txt_MemberClubID_1: "",
      txt_Name_1: "",
      ddl_Favorites_1: "6-4352@@DK",
      guid_2: "",
      chk_IsGuest_2: "0",
      GBDropDown_SelectedOption_ddIUnion_2: "favorite",
      txt_MemberClubID_2: "",
      txt_Name_2: "",
      ddl_Favorites_2: "6-4352@@DK",
      guid_3: "",
      chk_IsGuest_3: "0",
      GBDropDown_SelectedOption_ddIUnion_3: "favorite",
      txt_MemberClubID_3: "",
      txt_Name_3: "",
      ddl_Favorites_3: "6-4352@@DK",
      txtAttachedMessage: "",
      txtExtraEmail: "",
    };

    // Send the POST request with the payload
    const response = await axios.post(
      "https://www.golfbox.dk/site/my_golfbox/ressources/booking/window.asp",
      querystring.stringify(payload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // Include any cookies or authentication headers if needed
        },
        withCredentials: true, // Important if cookies/session is required
      }
    );

    console.log("Response:", response.data);
  } catch (error) {
    console.error(
      "Error posting:",
      error.response ? error.response.data : error.message
    );
  }
}

bookTeeTime();
