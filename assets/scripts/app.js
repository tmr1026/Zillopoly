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