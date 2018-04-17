$(document).ready(function(){
  // hide parts of the page
  $(".battle").hide();
  // $(".selection").hide();
  $(".win").hide();
  $(".loose").hide();
  $("#used-att").hide();
  $("#used-def").hide();
  $("#jumbo2").hide();

  //disable continue button
  $('#continue').prop("disabled", true);

  // turnswitches off
  $('.myCheckbox').prop('checked', false);

  var round = 0; //{0-4}
  var score = 0; //{0-5}
  var fight = 1;
  var atth,attr,defh,defr;
  var nameh, namer;
  var heroes = [] ;
  var robots= [];
  var obj = [];
  var lock =false,lock2 = false;

  var i;
  for(i=0;i<10;i++){
    obj.push( [0, genPower(), genPower()] );
  }

  //when we toggle the switch this is called twice for some reason
  $(".switch").click(function(){
    // find out which toggle switch was clicked
    var num=parseInt(this.id.slice(-1));
    if(num == 0){ //#switch-10 we want 10 not 0
      num = 10;
    }

    // 2 is on
    // 0 is off
    // num{1-10} --> obj{0-9}
    if(obj[num-1][0]<2){
      obj[num-1][0]++;
    }else if(obj[num-1][0]=2){
      obj[num-1][0]=-1;
    }

    var count = 0;
    var i;
    for(i=0;i<10;i++){
      count+=obj[i][0];
    }
    console.log(count);

    if(count == 10){//==10
      $('#continue').prop("disabled", false);//.prop new attr disabled
      console.log("success");
    }else{
      $('#continue').prop("disabled", true);
    }
  });

  $("#reset-btn").click(function(){
    location.reload();
  });

  $("#continue").click(function(){
    $(".selection").hide();
    $("#jumbo2").show();
    $(".battle").show();
    console.table("Content: " + obj);//obj[][0] is either 0 or 2

    var i;
    for(i=0;i<10;i++){
      if(obj[i][0]==2){
        heroes.push(i);
      }else{
        robots.push(i);
      }
    }

    robots.sort();
    heroes.sort();
    console.log("Picked heroes: " + heroes);
    console.log("Picked robots: " + robots);

    nameh=heroes[round]+1;
    atth=obj[heroes[round]][1];
    defh=obj[heroes[round]][2];

    namer=robots[round]+1;
    attr=obj[robots[round]][1];
    defr=obj[robots[round]][2];

    console.log("hero number: "+nameh+" att: "+atth+" def: "+defh);
    console.log("robo number: "+namer+" att: "+attr+" def: "+defr);

    showStatsHero(nameh,atth,defh,namer);

  });

  $("#attack-card").click(function(){

    if(lock==false){
      lock=true;//lock
      lock2=false;//unlock
      showStatsRobot(attr,defr);

      //true == attack | false == defense
      var robotDecision = Math.random() >= 0.5;
      showRobotDecision(robotDecision);
      if(robotDecision && (atth>=attr)){
        updateScore();
      }
      if(!robotDecision && (atth>=defr)){
        updateScore();
      }
    }
    if(fight == 5){
      theEnd();
      return;
    }
  });

  $("#defend-card").click(function(){

    if(lock==false){
      lock=true;//lock
      lock2=false;//unlock
      showStatsRobot(attr,defr);

      //true == attack | false == defense
      var robotDecision = Math.random() >= 0.5;
      showRobotDecision(robotDecision);
      if(!robotDecision && (defh>=defr)){
        updateScore();
      }
      if(robotDecision && (defh>=attr)){
        updateScore();
      }
    }
    if(fight == 5){
      theEnd();
      return;
    }
  });

  $("#nextRound").click(function(){
    if(lock2==false){
      updateRound();
      hideStatsRobot();
      hideRobotDecision();
      nextRound();
      lock = false;//unlock
      lock2 = true;//lock
    }
  })



  function nextRound(){
    if(round<5){//round {0-4}
      round++;
      nameh=heroes[round]+1;
      console.log(heroes);

      atth=obj[ heroes[round] ] [1];
      defh=obj[ heroes[round] ] [2];

      namer=robots[round]+1;
      attr=obj[robots[round]][1];
      defr=obj[robots[round]][2];

      console.log("hero number: "+nameh+" att: "+atth+" def: "+defh);
      console.log("robo number: "+namer+" att: "+attr+" def: "+defr);

      showStatsHero(nameh,atth,defh,namer);
    }else{
      theEnd();
    }
  }

  function updateScore(){
    score++;
    $("#score").text("Score <"+score+"/5>");
  }

  function updateRound(){
    if(fight<5){
    fight++;
    $("#round").text("Round <"+fight+"/5>");}
  }

  function theEnd(){
    if(score>=3){
      $(".win").show();
    }else{
      $(".loose").show();
    }
    $("#nextRound").hide();
  }

});
//--END READY--//












function showRobotDecision(rd){
  if(rd){
    $("#used-att").show();
  }else{
    $("#used-def").show();
  }
}

function hideRobotDecision(){
  $("#used-att").hide();
  $("#used-def").hide();
}



function showStatsHero(nh,ah,dh,   nr){
  //image
  $("#hero-img").attr("src","pics/hero"+nh+".png");
  // name
  $("#hero-num").text( "Hero: "+nh );
  // attack
  $("#hero-att").text( "Attack: "+ah+"/50");
  $("#hero-att").attr("style","width: "+2*ah+"%");
  // defense
  $("#hero-def").text(" Defense: "+dh+"/50");
  $("#hero-def").attr("style","width: "+2*dh+"%");

  //opponent image
  $("#robot-img").attr("src","pics/hero"+nr+".png");
  //opponent name
  $("#robot-num").text( "Anti-Hero: "+nr );
}

function showStatsRobot(ar,dr){
  //attack
  $("#robot-att").text( "Attack: "+ar+"/50");
  $("#robot-att").attr("style","width: "+2*ar+"%");
  // bg-secondary to bg-danger
  $("#robot-att").removeClass('bg-secondary').addClass('bg-danger');

  // defense
  $("#robot-def").text(" Defense: "+dr+"/50");
  $("#robot-def").attr("style","width: "+2*dr+"%");
  // bg-secondary to bg-success
  $("#robot-def").removeClass('bg-secondary').addClass('bg-success');

}

function hideStatsRobot(){
  //attack
  $("#robot-att").text( "Attack: ???/50");
  $("#robot-att").attr("style","width: 100%");
  //bg-danger(red) to bg-secondary(grey)
  $("#robot-att").removeClass('bg-danger').addClass('bg-secondary');

  // defense
  $("#robot-def").text(" Defense: ???/50");
  $("#robot-def").attr("style","width: 100%");
  // bg-success(green) to bg-secondary(grey)
  $("#robot-def").removeClass('bg-success').addClass('bg-secondary');
}

//removesDuplicates from an array
function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

// random num between 1 and 50
function genPower(){
  return Math.floor((Math.random() * 50) + 1);
}

// don't do anything for x milliseconds
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
