var arrZpid = ["13387360", "6900654", "7115494", "10875155", "10881469", "59937785", "14422213", "64812633", "46269897", "46254829", "46185302", "29376016", "19502566", "111433854", "48824588"];
var homesInfo = [];
var homesInfoPromise = [];
var obj = {};
var timer = ''
var imgArr = [];
// constructing a queryURL variable we will use instead of the literal string inside of the ajax method
var zwsid = "X1-ZWz181f7ao8w7f_7oq0o";
var cors = "https://cors-anywhere.herokuapp.com/";
var houseIndex = 0;

$(document).ready(function () {

    //START Firebase Auth and Database Functionality

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBS6ED3MPTd7vVN5xO-4V8N6Tyee1Zd_p8",
        authDomain: "gtbc-zillopoly.firebaseapp.com",
        databaseURL: "https://gtbc-zillopoly.firebaseio.com",
        projectId: "gtbc-zillopoly",
        storageBucket: "gtbc-zillopoly.appspot.com",
        messagingSenderId: "213038611947"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var auth = firebase.auth();


    // vars

    var userName;
    var email;
    var password;
    var hasSignedUp;
    var hasSignedIn;
    var userWins = 0;
    var userLosses;
    var userProperties;
    var authState;

    //create new user account

    $("#createUserBtn").on("click", function (event) {
        event.preventDefault();

        var displayName = $("#userName-input").val().trim();
        var email = $("#userEmail-input").val().trim();
        var password = $("#userPw-input").val().trim();
        var photoURL = $("#userPic-input").val().trim();
        var hasSignedUp = true;

        console.log("User = " + displayName);
        console.log("Email = " + email);
        console.log("UserPassword = " + password);

        database.ref("users").push({
            displayName: displayName,
            email: email,
            hasSignedUp: hasSignedUp,
            password: password,
            photoURL: photoURL,
            userKey: "userKey"

        });

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {

            if (error != null) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                var errorNum = 1;
                // ...

                console.log("error code and Msg... " + errorCode + " ... " + errorMessage);

                $("#signUpErrorMsg").html(errorMessage);

            } else {

                // Trying to erase the error message currently not working
                $("#signUpErrorMsg").html();
            }

        });
    });

    // Firebase Observer

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var authState = true;

        } else {
            // No user is signed in.
            var authState = false;

        }
        // problem: stat is only seen within this function :-(
        console.log("authState = " + authState);

        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified, displayName;

        // I'll put the auth state and associated div's to show/hide in here and see what happens
        // IT WORKS!!!

        if (authState == false) {

            $("#homeData").hide();
            $("#guessData").hide();
            $("#scoreData").hide();

        } else {
            $("#homeData").show();
            $("#guessData").show();
            $("#scoreData").show();
            $("#gameDiv").html("<h2>Welcome " + user.email + "!</h2>");

        }

    });

    // watch the db for new user sign ups and push the userKey

    database.ref("users").on("child_added", function (childSnapshot) {

        var userName = (childSnapshot.val().userName);
        //console.log(childSnapshot.ref.path.pieces_[1]);

        var userKey = (childSnapshot.ref.path.pieces_[1]);


        // =============  HELP: TRYING TO SORT THIS!!! ++++++++++++++


        //    // var sort = firebase.database().ref("users/").orderByChild("wins");

        //     firebase.database().ref("users/").orderByChild("wins", function (childSnapshot){  

        //     console.log("this is the userKey... " + childSnapshot.ref.path.pieces_[1]);



        // add users to the user table above

        $("#userData").append(
            "<tr><td>" + childSnapshot.val().userName +
            "</td><td>" + childSnapshot.val().wins +
            "</td></tr>");


    //});

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

});


//sign in to user account

$("#submitLogInBtn").on("click", function (event) {
    event.preventDefault();

    var userName = $("#userName-input").val().trim();
    var email = $("#userEmail-input").val().trim();
    var password = $("#userPw-input").val().trim();
    var hasSignedIn = true;

    console.log("User has Signed In! = " + userName);
    console.log("Email Sign In = " + email);
    console.log("User Password= " + password);

    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {

        var user = firebase.auth().currentUser.email;

        console.log("signed in user..." + user);

    }).catch(function (error) {

        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        console.log("error code... " + error.code + " error message...  " + error.message);
    });

    database.ref("loggedin").push({  //adds logged in users to the logged in firebase folder
        newUserSignIn: userName,
        email: email,
        hasSignedIn: hasSignedIn,
        password: password,
        //userKey: userKey

    });

    $("#userName-input").val("");

});

// Logged Out Button

$("#submitLogOutBtn").on("click", function (event) {
    event.preventDefault();

    var user = firebase.auth().currentUser.uid;

    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });

    console.log("User has Signed OUT! = " + user);

});

$("#addWins").on("click", function (event) {

    //var userWins = //
    userWins++;

    console.log(userWins);

    database.ref("buttonPushWins").push({  //adds points to  userWins in the logged in firebase folder
        // newUserSignIn: userName,
        // email: email,
        // hasSignedIn: hasSignedIn,
        wins: userWins

    });

    $("#userWins").html(userWins);

});


//END Firebase Auth and Database Functionality


//START Zillow API Functionality


//Write to another array


async function getInfo() {
    return new Promise(async (resolve, reject) => {
        for (i = 0; i < arrZpid.length; i++) {
            homesInfoPromise.push(getObjList(i))
            // console.log(val)
            // obj = { price: homePrice, images: imgArr, bedrooms: homeBedrooms, bathrooms: homeBathrooms };
            // var homePrice = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.price["#text"];

            // homeBedrooms = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bedrooms["#text"];

            // homeBathrooms = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bathrooms["#text"];

            // for (j = 0; j < 3; j++) {
            //     homeImage = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.images.image.url[j]["#text"];
            //     imgArr[j] = homeImage;
            // }
            // console.log(val)
            // homesInfoPromise.push(val)

        }
        // console.log(homesInfoPromise)
        resolve(homesInfoPromise)
    })
}

async function getObjList(i) {
    return new Promise((resolve, reject) => {
        var imgArr = [];

        var queryURL = cors + "www.zillow.com/webservice/GetUpdatedPropertyDetails.htm?zws-id=" + zwsid + "&zpid=" + arrZpid[i];

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {


            var jsonResponse = xmlToJson(response);
            // console.log(jsonResponse)


            let arr = []
            arr.push(jsonResponse)

            resolve(arr)
        })
            .catch(function (err) {
                reject(err)
            });
    })
}


async function gotInfo() {
    try {
        homesInfoPromise = await getInfo()
        Promise.all(homesInfoPromise).then(jsonResponse => {
            jsonResponse.forEach((res, i) => {
                if (i !== 1) {

                    const obj = {}
                    obj.homePrice = res[0]["UpdatedPropertyDetails:updatedPropertyDetails"].response.price["#text"];

                    obj.homeBedrooms = res[0]["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bedrooms["#text"];

                    obj.homeBathrooms = res[0]["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bathrooms["#text"];
                    const arr = []
                    for (var j = 0; j < 3; j++) {
                        arr.push(res[0]["UpdatedPropertyDetails:updatedPropertyDetails"].response.images.image.url[j]["#text"])
                    }
                    obj.images = arr

                    homesInfo.push(obj)
                }
            })


            // other logic here


            loadProperty()

        })
        // loadProperty()
        // homeInfo()
        return homesInfoPromise
    } catch (err) {
        console.log(err)
        throw err
    }



    // append here


}


// function loadProperty() {
//     timer = setInterval(countdown, 1000);
//     for (var i = 0; i < homesInfo.length; i++) {


//         $("#bedandbath").append("<p>Bedrooms: " + homesInfo[0].homeBedrooms + "</p>");

//         $("#bedandbath").append("<p>Baths: " + homesInfo[0].homeBathrooms + "</p>");
//         // console.log("This is Homes Info",homesInfo[0]);
//     }


// }

gotInfo()



// async function homesInfo(homesInfoPromise){
//     return new Promise((resolve,reject)=>{
//         Promise.all(homesInfoPromise).then(val=>{
//             resolve(val)
//          })
//          .catch(err=>{
//             reject(err)
//          })
//     })
// }


// Changes XML to JSON
function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;

};

//game code

$(".submit-answer").on("click", function (event) {
    event.preventDefault();
    bid();
})

houseIndex = 0;
clock = 9999999999999;
wins = 0;
losses = 0;

});


//user must place bid withing certain amt of time
function countdown() {
    clock--;
    if (clock <= 0) {
        timesUp();
    }
}

function loadProperty() {
    console.log(homesInfo);
    timer = setInterval(countdown, 1000);
    for (var i = 0; i < homesInfo.length; i++) {
        //append pics to image div(Will working on slider)
        //append bed and bath info to respective div
        $("#images").html("<img id='imagefromzillow' src='" + homesInfo[houseIndex].images[0] + "'/>")

        $("#bedandbath").text("Bedrooms: " + homesInfo[houseIndex].homeBedrooms);

        $("#bedandbath").append("<p>Baths: " + homesInfo[houseIndex].homeBathrooms + "</p>");

        $("#progress").html(houseIndex + 1);

        $("#win-number").html("<p>Wins: " + wins + "</p>");

        $("#loss-number").html("<p>Losses: " + losses + "</p>");
    }


}

function nextProperty() {
    houseIndex++;
    loadProperty();
}

function timesUp() {
    clearInterval(timer);
    if (houseIndex == 6) {
        setTimeout(results, 3 * 1000);
    } else {
        setTimeout(nextProperty, 3 * 1000);
    }
}
//show final leaderboard
//show how many properties won by user
function results() {
    clearInterval(timer);
    $("#score").html("<p>Final Results!</p>");
    $("#score").append("<p>You won a total of " + wins + " homes!</p>");
    reset();

}
//take players bid
function bid() {
    minBid = (homesInfo[houseIndex].homePrice) * .80


    maxBid = (homesInfo[houseIndex].homePrice) * 1.2

    currentBid = $("#guess-price").val();
    if (minBid <= currentBid) {
        wonBid();
    } else {
        lostBid();
    }
}
function wonBid() {
    clearInterval(timer);
    wins++;
    $("#score").html("<p>Congrats! You just purchased this beautiful home</p>")

    var database = firebase.database();

    database.ref("zWins").push({  //adds points to  userWins in the logged in firebase folder

        wins: wins

    });

    $("#userWins").html(wins);

    if (houseIndex == 6) {
        setTimeout(results, 3 * 1000);
    } else {
        setTimeout(nextProperty, 3 * 1000);
    }

}
function lostBid() {
    clearInterval(timer);
    losses++;
    $("#score").html("<p>Sorry, your bid was rejected by the seller!</p>")
    if (houseIndex == 6) {
        setTimeout(results, 3 * 1000);
    } else {
        setTimeout(nextProperty, 3 * 1000);
    }
}
function reset() {
    houseIndex = 0;
    clock = 0;
    wins = 0;
    losses = 0;

}

// Assign variable to keep increasing from 0-14 for index value

