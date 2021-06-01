function ejectGame(){
    //exit game
    ci.exit()
    //update ui
    $("#jsdos").css('display', 'none')
    $("#game").attr("class", "no-game");
    $("#game-title").text("Pick a game from the Games folder in the Start menu");
    $('.dosbox-button').prop('disabled', true);
}

function startGame(game){
    if($('#game').hasClass('no-game') == false){
        alert("You need to eject the current game before you can start another one.");
        return;
    }
    $("#game").attr("class", game);
    $("#game-title").text(game);
    $("#menu").css('display', 'none');
    $("#startbutton").attr("class", "startbutton-off");
    // fix start button toggle
    $("#jsdos").css('display', 'inline-block')
    Dos(document.getElementById("jsdos"), { 
        wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
        cycles: "auto",
        autolock: false,
      }).ready(function (fs, main) {
        fs.extract("assets/games/" + game + ".zip").then(function () {
          main(["-c", "cd " + game, "-c", game + ".EXE"]).then(function (ci) {
            window.ci = ci;
          });
        });
      });
    //un disable buttons
    $('.dosbox-button').prop('disabled', false);
}

function submitRating(){
    $('#submit-rating').prop('disabled', true);
    $('#rating-text').text("Duly noted, thanks!");
    // submit
}

function exitFlight(){
    $('#rocket-container').css("display", "none")
    $('#rocket-container button').remove()
}

function startFlight(){
  //////////////////////////////////////////////////////////take as note of how to refactor
    $('#rocket-container').css("display", "block")
    $('#rocket-container').append("<button>Press to exit flight</button>");
    $('#rocket-container button').css({"color": "red", "background-color": "black", "left": "45vw", "bottom": "10px"})
    $('#rocket-container button').click(function() {
        exitFlight();
      });
}

//Helper method for setZ that gets the highest z-index value for all draggable windows
function getHighestDraggableZ(){
    highest_z = 10; //had to make this 10 because of very strange bug that i still dont understand involving z-index at 10
    $('.ui-draggable').each(function(i, obj) {
      z = $(obj).css('z-index');
      if(z > highest_z){
        highest_z = z;
      }
    });
    return highest_z;
}

function setZ(clicked_window){
  highest_z = parseInt(getHighestDraggableZ());
  if(clicked_window.style.zIndex <= highest_z){
    new_highest_z = highest_z + 1;
    clicked_window.style.zIndex = new_highest_z;
    //remove clicked from all others
    removeProgramClicked();
    //also set clicked-program?
    body = clicked_window.querySelector('.window-body');
    body_id = body.id;
    program = "#" + body_id + "-program-container span";
    $(program).removeClass();
    $(program).addClass("program-clicked program");
  }
}

function closeWindow(windowToClose){
    //get program name (taskbar)
    program_name = windowToClose.parentNode.parentNode.nextElementSibling.id + "-program-container";
    //close window and remove program from taskbar
    windowToClose.parentNode.parentNode.parentNode.remove();
    $( "#" + program_name).remove();
    //find new program to toggle
    highest_z = getHighestDraggableZ();
    newClosestWindow = "";
    $('.ui-draggable').each(function(i, obj) {
      z = $(obj).css('z-index');
      if(z == highest_z){
        newClosestWindow = obj;
      }
    });
    if(newClosestWindow != ""){
      body = newClosestWindow.querySelector('.window-body');
      body_id = body.id;
      program = "#" + body_id + "-program-container span";
      $(program).removeClass();
      $(program).addClass("program-clicked program");
    }
}

function makeProgramClicked(program){
  program.className = "program-clicked program";
}

//remove program-clicked for all elements
function removeProgramClicked(){
  $(".program-clicked").removeClass("program-clicked");
}

function changeTheme(theme){
  $(".desktop").removeAttr('style');
  $(".startbar").removeAttr('style');
  $(".menu").removeAttr('style');
  $(".menu-content").removeAttr('style');
  switch (theme) {
    case "light":
      $(".desktop").css("background-color", "#008080");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "silver");
      $(".title-bar").removeClass().addClass("title-bar");
      $(".menu-sidebar").removeClass().addClass("menu-sidebar");
      break;
    case "dark":
      $(".desktop").css("background-color", "rgb(3 25 43)");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "#7b7979");
      $(".menu").css("background", "#7b7979");
      $(".menu-content").css("background", "#7b7979");
      $(".title-bar").removeClass().addClass("dark-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("dark-menu-sidebar menu-sidebar");
      break;
    case "rose-gold":
      $(".desktop").css("background-color", "#e6808c");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "silver");
      $(".title-bar").removeClass().addClass("rose-gold-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("rose-gold-menu-sidebar menu-sidebar");
      break;
    case "clouds":
      $(".desktop").css("background", "url('images/backgrounds/clouds.jpg') no-repeat");
      $(".desktop").css("background-size", "cover");
      $(".title-bar").removeClass().addClass("clouds-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("clouds-menu-sidebar menu-sidebar");
      break;
    case "cybercity":
      $(".desktop").css("background", "url('images/backgrounds/cybercity.gif') no-repeat");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "silver");
      $(".title-bar").removeClass().addClass("cybercity-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("cybercity-menu-sidebar menu-sidebar");
      break;
    case "cybernightcity":
      $(".desktop").css("background", "url('images/backgrounds/cybernightcity.gif') no-repeat");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "silver");
      $(".title-bar").removeClass().addClass("cybernightcity-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("cybernightcity-menu-sidebar menu-sidebar");
      break;
    case "galaxy":
      $(".desktop").css("background", "url('images/backgrounds/galaxy.gif') no-repeat");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "silver");
      $(".title-bar").removeClass().addClass("galaxy-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("galaxy-menu-sidebar menu-sidebar");
      break;
    case "xp":
      $(".desktop").css("background", "url('images/backgrounds/xp.jpg') no-repeat");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "silver");
      $(".title-bar").removeClass().addClass("xp-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("xp-menu-sidebar menu-sidebar");
      break;
    case "doge":
      $(".desktop").css("background", "url('images/backgrounds/doge.jpg') no-repeat");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "silver");
      $(".title-bar").removeClass().addClass("doge-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("doge-menu-sidebar menu-sidebar");
      break;
    case "star-wars":
      $(".desktop").css("background", "url('images/backgrounds/starwars.gif') no-repeat");
      $(".desktop").css("background-size", "cover");
      $(".startbar").css("background-color", "silver");
      $(".title-bar").removeClass().addClass("star-wars-title-bar title-bar");
      $(".menu-sidebar").removeClass().addClass("star-wars-menu-sidebar menu-sidebar");
      break;
  }
}

function getTheme(){
  theme = $("#intro-title-bar").attr('class');
  return theme;
}

function openDraggableWindow(windowToOpen){
    // make icon and name blue
    theme = getTheme();
    window_id = windowToOpen.getAttribute("id");
    highest_z = parseInt(getHighestDraggableZ()) + 1; //get highest z-index and set window to that

    wind = $(document.createElement('div')).attr({id: 'draggable-window', onmousedown: 'setZ(this)'}).addClass("window").css("z-index", highest_z);
    title_bar = $(document.createElement('div')).addClass(theme);
    title_bar_text_icon = $(document.createElement('div')).css({"display": "flex", "align-items": "center"});
    title_bar_controls = $(document.createElement('div')).addClass("title-bar-controls");
    title_bar_minimize = $(document.createElement('button')).attr('aria-label', 'Minimize');
    title_bar_maximize = $(document.createElement('button')).attr('aria-label', 'Maximize');
    title_bar_close = $(document.createElement('button')).attr('aria-label', 'Close').attr('onclick', 'closeWindow(this)');
    title_bar_controls.append([title_bar_minimize,title_bar_maximize,title_bar_close]);

    switch (window_id) {
        case "logan-icon":
          if($('#logan').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/logan_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Logan.exe");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'logan'});
            
            header_image1 = $(document.createElement('img')).attr({src: 'images/purp.gif'}).addClass("purp").css({"transform": "scaleX(-1)"});
            header_text = $(document.createElement('h2')).css({"text-decoration": "underline"}).text("About Me");
            header_image2 = $(document.createElement('img')).attr({src: 'images/purp.gif'}).addClass("purp");
            header = $(document.createElement('div')).css({"display": "flex", "justify-content": "space-between"}).append([header_image1, header_text, header_image2]);

            intro = "Born in December 1997, grew up in Atlanta, Georgia. Graduated high school in 2016 and started coding towards the end of my first year of college in 2017 after first learning about Bitcoin. Switched my major to computer science the following year and graduated from the University of Georgia in spring 2021.";
            work_interests = "Full stack web development but preferably front end work. Would love to do frontend work for any DeFi project utilizing the web3 framework. Would also love to work in game development and currently using Unity to hone my skills in this area in my freetime.";
            skills = "Experience in java, c++, c#, python, js, html, css, and solidity. More specifically experience within web frameworks such as django and spring."
            hobbies = "Coding, Crypto/DeFi/Web3, watching atlanta sports teams (sadly), grilling, traveling, playing/developing video games."
            food = String.fromCodePoint(0x1F355); // pizza emoji
            movie = " Star Wars: The Phantom Menace (just kidding...but not really)";


            window_body.append([
              header,
              $(document.createElement('p')).text(intro),
              $(document.createElement('p')).text(work_interests).prepend($(document.createElement('b')).text("Work Interests:")),
              $(document.createElement('p')).text(skills).prepend($(document.createElement('b')).text("Skills:")),
              $(document.createElement('p')).text(hobbies).prepend($(document.createElement('b')).text("Personal Interests/Hobbies:")),
              $(document.createElement('p')).text(food).prepend($(document.createElement('b')).text("Favorite Food:")),
              $(document.createElement('p')).text(movie).prepend($(document.createElement('b')).text("Favorite Movie:")),
              $(document.createElement('p')).append([$(document.createElement('b')).text("Favorite Game:"), $(document.createElement('img')).attr('src', 'images/chief.gif').css('height', '50px')])
            ]);
            
            //create program
            program = "logan"
            program_text = "Logan.exe";

          }
          break;
        case "projects-icon":
          if($('#projects').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/projects_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Projects.exe");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'projects'});

            //implement here
            //append to window body
            
            //create program
            program = "projects";
            program_text = "Projects.exe";
          }
          break;
        case "my-resume-icon":
          if($('#my-resume').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/my-resume_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("My_Resume.exe");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'my-resume'});

            //implement here
            //append to window body
            
            //create program
            program = "my-resume";
            program_text = "My_Resume.exe";
          }
          break;
        case "contact-me-icon":
          if($('#contact-me').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/contact-me_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Contact_Me.exe");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'contact-me'});

            //implement here
            //append to window body
            
            
            //create program
            program = "contact-me";
            program_text = "Contact_Me.exe";
          }
          break;
        case "steam-help-icon":
          if($('#steam-help').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/steam-help_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Steam98.exe");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'steam-help'});

            //implement here
            //append to window body
            
            
            //create program
            program = "steam-help";
            program_text = "Steam98Help";
          }
          break;
        case "themes-icon":
          if($('#themes').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/themes_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Themes.exe");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'themes'});

            //implement here
            //append to window body
            
            
            //create program
            program = "themes";
            program_text = "Themes";
          }
          break;
        case "aim-icon":
          if($('#aim').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/aim_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Sign On");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'aim'});

            //implement here
            //append to window body
            
            
            //create program
            program = "aim";
            program_text = "AOL Instant Messenger";
          }
          break;  
        case "rating-icon":
          if($('#rating').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/rating.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Rating");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'rating'});

            //implement here
            //append to window body
            
            
            //create program
            program = "rating";
            program_text = "Rating";
          }       
          break;
    }

    if($('#' + program + '-program-container').length == 0){
      removeProgramClicked();
      $("#start-program-container").append($(document.createElement('div'))
        .attr({ id: program + '-program-container' })
        .addClass("program-container"));
      $('#' + program + '-program-container').append($(document.createElement('span'))
        .addClass("program-clicked program"));
      $('#' + program + '-program-container span').append($(document.createElement('div')));
      $('#' + program + '-program-container span div').append($(document.createElement('img')).attr({ src: 'images/icons/' + program + '_small.png'}));
      $('#' + program + '-program-container span div').append($(document.createElement('p')).text(program_text));
    }
    wind.append([title_bar, window_body]);
    wind.draggable();
    $(".desktop").append(wind);
}