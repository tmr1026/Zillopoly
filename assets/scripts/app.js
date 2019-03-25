var arrZpid = ["13387360", "6900654", "7115494", "10875155", "10881469", "59937785", "14422213", "64812633", "46269897", "46254829", "46185302", "29376016", "19502566", "111433854", "48824588"];

        var homesInfo = [];
        var obj = {};

        // constructing a queryURL variable we will use instead of the literal string inside of the ajax method
        var zwsid = "";
        var cors = "https://cors-anywhere.herokuapp.com/";


        //Write to another array

        for (i = 0; i < arrZpid.length; i++) {

            var imgArr = [];

            var queryURL = cors + "www.zillow.com/webservice/GetUpdatedPropertyDetails.htm?zws-id=" + zwsid + "&zpid=" + arrZpid[i];

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                var jsonResponse = xmlToJson(response);

                var homePrice = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.price["#text"];

                homeBedrooms = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bedrooms["#text"];

                homeBathrooms = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bathrooms["#text"];

                for (j = 0; j < 3; j++) {
                    homeImage = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.images.image.url[j]["#text"];
                    imgArr[j] = homeImage;
                }

                obj = { price: homePrice, images: imgArr, bedrooms: homeBedrooms, bathrooms: homeBathrooms };
                homesInfo.push(obj);
            });

        }


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



var homes =[
    {
        sellPrice: 1150000,
        image:"",
    },
]
 //game code
 var game = {
     houses: homes,
     houseIndex: 0,
     clock: 45,
     highPrice: 0,
     highBidder: "",
     wins: 0,
     losses: 0,
     didntBid: 0,
     
     countdown: function(){
        game.clock --;
        //append clock to html
        if(game.clock <=0){
            game.timesUp();
        }
     },

     loadProperty: function(){
        timer = setInterval(game.countdown,1000);
        //append timer to screen
        //append pictures to image div
        //append description to description div

     },
     nextProperty: function(){
         game.clock = 45;
         //append timer to screen
         game.houseIndex++;
         game.loadProperty();

     },
     timesUp: function(){
         clearInterval(timer);
         game.didntBid ++;
         //show sell price 
         if(game.houseIndex==homes.length){
             setTimeout(game.results, 3*1000);
         }else{
             setTimeout(game.nextProperty, 3*1000);
        } 
     },
     results: function(){
         clearInterval(timer);
         //show final leaderboard
         //show how many properties won by user
         
     },
     bid: function(){
         clearInterval(timer);
         if(currentBid>sellPrice){
             game.wonBid();
         }else{
             game.lostBid();
         }
     },
     wonBid: function(){
        clearInterval(timer);
        game.wins++;
        //message showing player they purchased home
        if(game.houseIndex==homes.length){
            setTimeout(game.results, 3*1000);
        }else{
            setTimeout(game.nextProperty, 3*1000);
       } 
         
     },
     lostBid: function(){
        clearInterval(timer);
        game.losses++;
        if(game.houseIndex==homes.length){
            setTimeout(game.results, 3*1000);
        }else{
            setTimeout(game.nextProperty, 3*1000);
       }  
     },
     reset: function(){
         game.houseIndex=0;
         game.clock=0;
         game.wins=0;
         game.losses=0;
         game.didntBid=0;
         game.loadProperty();  
     }
 }