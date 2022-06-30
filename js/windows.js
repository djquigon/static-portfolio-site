/**
 * Removes the current game from Steam98.
 */
function ejectGame(){
    //exit game
    ci.exit()
    //update ui
    $("#jsdos").css('display', 'none')
    $("#game").attr("class", "no-game");
    $("#game-title").text("Pick a game from the Games folder in the Start menu");
    $('.dosbox-button').prop('disabled', true);
}

/**
 * Starts the selected game with Steam98.
 */
function startGame(game){
  if($('#steam-program-container').length == 0){
    openDraggableWindow(document.getElementById("steam-icon"));
  }
  if($('#game').hasClass('no-game') != true){
      alert("⚠️ You need to eject the current game before you can start another one. Please try again.");
      return;
  }
  $("#game").attr("class", game);
  $("#game-title").text(game);
  $("#menu").css('display', 'none');
  $("#startbutton").attr("class", "startbutton-off");
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

/**
 * Exits the threejs rocket mode by removing the rocket container.
 */
function exitFlight(){
    $('#rocket-container').css("display", "none")
    $('#rocket-container button').remove()
}

/**
 * Starts the threejs rocket mode by adding the rocket container.
 */
function startFlight(){
    $('#rocket-container').css("display", "block")
    $('#rocket-container').append("<button>Press to exit flight</button>");
    $('#rocket-container button').css({"color": "red", "background-color": "black", "left": "45vw", "bottom": "10px"})
    $('#rocket-container button').click(function() {
        exitFlight();
    });
}

/**
 * Helper method for setZ that gets the highest z-index value for all draggable windows
 */
function getHighestDraggableZ(){
    highest_z = 10; //had to make this 10 for bug reasons
    $('.ui-draggable').each(function(i, obj) {
      z = $(obj).css('z-index');
      if(z > highest_z){
        highest_z = z;
      }
    });
    return highest_z;
}

/**
 * Sets the z-index of the clicked window.
 */
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

/**
 * Submit function for rating window.
 */
 function submitRating(){
  $('#submit-rating').prop('disabled', true);
  $('#rating-text').text("Duly noted, thanks!");
  // submit
}

/**
 * Closes a window.
 */
function closeWindow(windowToClose){
    //get program name (taskbar)
    program_name = windowToClose.parentNode.parentNode.nextElementSibling.id + "-program-container";
    //if closing steam, close out game first if one is running
    if(program_name == "steam-program-container"){
      if($('#game').hasClass('no-game') != true){
        ejectGame();
      }
    }
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

/**
 * Remove program-clicked for all elements.
 */
function removeProgramClicked(){
  $(".program-clicked").removeClass("program-clicked");
}

/**
 * Changes the windows theme currently displayed.
 */
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

/**
 * Returns the current windows theme.
 */
function getTheme(){
  theme = $("#intro-title-bar").attr('class');
  return theme;
}

/**
 * Highlights a given desktop icon.
 */
function highlightIcon(icon){
  //overlay = "#" + icon.id + " div";
  //$(overlay).addClass("icon-overlay");
}

/**
 * Opens windows based off which window to open is passed in.
 */
function openDraggableWindow(windowToOpen){
    // make icon and name blue
    theme = getTheme();
    window_id = windowToOpen.getAttribute("id");
    highest_z = parseInt(getHighestDraggableZ()) + 1; //get highest z-index and set window to that

    wind = $(document.createElement('div')).attr({id: 'draggable-window', onmousedown: 'setZ(this)'}).addClass("window").css("z-index", highest_z).css("position", "absolute");
    
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

            intro = "Based in Atlanta, Georgia. Started coding towards the end of my first year of college in early 2017 after first learning about Bitcoin. Graduated from the University of Georgia with a major in computer science in spring 2021.";
            work_interests = "Full stack web development but preferably front end work. Working in game development eventually is also a goal of mine.";
            skills = "Strong experience with javascript where I've utilized various libraries such as node.js, React, ethers.js, jquery, and three.js. Strong experience in python, ranging from web developement using frameworks such as django, to data mining using various libraries such as pandas, numpy, scikit, and tensorflow. And of course with all this in mind, I'm also very familiar with html, and css. Minor experience in java, c++, and c# from schooling and small personal projects in Unity, pretty familiar with java's spring web framework."
            hobbies = "Coding, researching Crypto/DeFi/Web3, watching Atlanta sports teams, grilling, traveling, playing/modding/developing video games."



            window_body.append([
              header,
              $(document.createElement('p')).text(intro),
              $(document.createElement('p')).text(work_interests).prepend($(document.createElement('b')).text("Work Interests:")),
              $(document.createElement('p')).text(skills).prepend($(document.createElement('b')).text("Skills:")),
              $(document.createElement('p')).text(hobbies).prepend($(document.createElement('b')).text("Personal Interests/Hobbies:")),
            ]);
            wind.append([title_bar, window_body]);

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

            tree = $(document.createElement('ul')).addClass("tree-view").css("width", "400px");
            item1 = $(document.createElement('li')).append($(document.createElement('strong')).css("color", '#55468e').text('✨ Projects ✨'));
            steam98_text = "A lot of things! But my primary focus right now is full stack web development. Explore my projects in this area as well as others below.";
            item2 = $(document.createElement('li')).text("What do I work on?").append(
              $(document.createElement('ul')).append($(document.createElement('li')).text(steam98_text))
            );
            walletWatchoor = $(document.createElement('li')).append($(document.createElement('details')).append([
              $(document.createElement('summary')).text("wallet watchoor"),
              $(document.createElement('ul')).append([
                $(document.createElement('li')).append($(document.createElement('img')).attr("src", "images/walletWatchoor_project.PNG").css("width", "100px")),
                $(document.createElement('li')).text("A web3 app for tracking addresses on the Ethereum mainnet and interacting with other community members. Built with React, Node.js, and Ethers.js."),
                $(document.createElement('li')).append($(document.createElement('a')).text("Link").css("color", "#00f").attr({href: "https://walletwatchoor.net/", target: "_blank"})),
                $(document.createElement('li')).append($(document.createElement('a')).text("Source Code").css("color", "#00f").attr({href: "https://github.com/djquigon/wallet-watchoor", target: "_blank"})),
              ])
            ]));
            web3xr = $(document.createElement('li')).append($(document.createElement('details')).append([
              $(document.createElement('summary')).text("web3xr"),
              $(document.createElement('ul')).append([
                $(document.createElement('li')).append($(document.createElement('img')).attr("src", "images/web3xr_project.PNG").css("width", "100px")),
                $(document.createElement('li')).text("A web app containing a small demo exemplifying what's possible when combining ethers.js, WebXR, and Three.js."),
                $(document.createElement('li')).append($(document.createElement('a')).text("Medium Link").css("color", "#00f").attr({href: "https://medium.com/@scheidlogan", target: "_blank"})),
                $(document.createElement('li')).append($(document.createElement('a')).text("Source Code").css("color", "#00f").attr({href: "https://github.com/djquigon", target: "_blank"})),
              ])
            ]));
            pokedex = $(document.createElement('li')).append($(document.createElement('details')).append([
              $(document.createElement('summary')).text("potential-pokedex"),
              $(document.createElement('ul')).append([
                $(document.createElement('li')).append($(document.createElement('img')).attr("src", "images/pokedex_project.PNG").css("width", "100px")),
                $(document.createElement('li')).text("Classifying Pokemon images based on their primary types using a tensorflow convolutional neural network."),
                $(document.createElement('li')).append($(document.createElement('a')).text("Medium Link").css("color", "#00f").attr({href: "https://medium.com/@scheidlogan/creating-a-pok%C3%A9dex-pok%C3%A9mon-image-classification-using-a-convolutional-neural-network-ab2a0cb54d03", target: "_blank"})),
                $(document.createElement('li')).append($(document.createElement('a')).text("Source Code").css("color", "#00f").attr({href: "https://github.com/djquigon/potential-pokedex", target: "_blank"})),
              ])
            ]));
            exoplanet = $(document.createElement('li')).append($(document.createElement('details')).append([
              $(document.createElement('summary')).text("exoplanet-identification"),
              $(document.createElement('ul')).append([
                $(document.createElement('li')).append($(document.createElement('img')).attr("src", "images/exoplanet_project.PNG").css("width", "100px")),
                $(document.createElement('li')).text("Identifying exoplanets from a NASA dataset using various classification models from scikit-learn."),
                $(document.createElement('li')).append($(document.createElement('a')).text("Medium Link").css("color", "#00f").attr({href: "https://medium.com/@scheidlogan/identifying-exoplanets-using-multiple-classification-models-7ee48024d7fd", target: "_blank"})),
                $(document.createElement('li')).append($(document.createElement('a')).text("Source Code").css("color", "#00f").attr({href: "https://github.com/djquigon/exoplanet-identification", target: "_blank"})),
              ])
            ]));
            sentiment = $(document.createElement('li')).append($(document.createElement('details')).append([
              $(document.createElement('summary')).text("financial-sentiment-analysis"),
              $(document.createElement('ul')).append([
                $(document.createElement('li')).append($(document.createElement('img')).attr("src", "images/sentiment_project.PNG").css("width", "100px")),
                $(document.createElement('li')).text("Classifying sentiment of financial headlines using a GRU recurrent neural network."),
                $(document.createElement('li')).append($(document.createElement('a')).text("Medium Link").css("color", "#00f").attr({href: "https://medium.com/@scheidlogan/financial-headline-sentiment-analysis-using-a-recurrent-neural-network-dabbfde08233", target: "_blank"})),
                $(document.createElement('li')).append($(document.createElement('a')).text("Source Code").css("color", "#00f").attr({href: "https://github.com/djquigon/financial-sentiment-analysis", target: "_blank"})),
              ])
            ]));
            ugastats = $(document.createElement('li')).append($(document.createElement('details')).append([
              $(document.createElement('summary')).text("uga-stats"),
              $(document.createElement('ul')).append([
                $(document.createElement('li')).append($(document.createElement('img')).attr("src", "images/ugastats_project.jpeg").css("width", "100px")),
                $(document.createElement('li')).text("A web app for UGA football statistics junkies. Users can create accounts to view and save their favorite players and stats."),
                $(document.createElement('li')).append($(document.createElement('a')).text("Source Code").css("color", "#00f").attr({href: "https://github.com/djquigon", target: "_blank"})),
              ])
            ]));
            //implement here
            //append to window body
            tree.append([
              item1, item2, walletWatchoor, web3xr, pokedex, exoplanet, sentiment, ugastats
            ]);
            window_body.append(tree);
            wind.append([title_bar, window_body]);

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
            window_body.append([
              $(document.createElement('iframe')).attr({src: "assets/documents/scheid_resume.pdf#toolbar=0", width: "480px", height: "480px"}),
              $(document.createElement('p')).css("text-align", "center").append($(document.createElement('a')).attr({target: '_blank', href: 'assets/documents/scheid_resume.pdf'}).text("PDF"))
            ]);
            wind.append([title_bar, window_body]);

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
            note = $(document.createElement('b')).html("Please note that this form does not function on mobile.<br>If you're on mobile, email me at ").append($(document.createElement("a")).attr({href: "mailto: scheid.logan.work@gmail.com"}).html("scheid.logan.work@gmail.com"))

            form = $(document.createElement('form')).addClass("gform").attr({method: "POST", "data-email": "scheid.logan.work@gmail.com", action: "https://script.google.com/macros/s/AKfycbxMYqcQqvDpVNaroOR6kSsXLdnhkOwH9wGkv50j/exec"}).css("padding-top", "2%");
            field_row1 = $(document.createElement('div')).addClass("field-row");
            label1 = $(document.createElement('label')).attr({for: "text17"}).text("Email");
            input1 = $(document.createElement('input')).attr({id: "text17", type: "email", name: "email", required: "true"}).css("width", "175px");
            field_row1.append([label1, input1]);

            field_row2 = $(document.createElement('div')).addClass("field-row");
            label2 = $(document.createElement('label')).attr({for: "text17"}).text("Reason");
            select = $(document.createElement('select')).attr({name: "reason", required: "true"});
            option1 = $(document.createElement('option')).text("Personal");
            option2 = $(document.createElement('option')).text("Work-related");
            option3 = $(document.createElement('option')).text("Question");
            option4 = $(document.createElement('option')).text("Other");
            select.append([option1, option2, option3, option4]);
            field_row2.append([label2, select]);

            field_row3 = $(document.createElement('div')).addClass("field-row-stacked");
            label3 = $(document.createElement('label')).attr({for: "text20"}).text("Message (leave your name)");
            text_area = $(document.createElement('textarea')).attr({id: "text20", rows: "15", cols: "60", name: "message", required: "true"});
            field_row3.append([label3, text_area]);

            submit_button = $(document.createElement('button')).text("Submit").css({left: "30%", position: "relative", "margin-top": "5%"});

            form.append([field_row1, field_row2, field_row3, submit_button]);
            //append to window body
            window_body.append(note, form);
            wind.append([title_bar, window_body]);

            //create program
            program = "contact-me";
            program_text = "Contact_Me.exe";
          }
          break;
        case "steam-icon":
          if($('#steam').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/steam_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Steam98.exe");
            title_bar_text_icon.append([icon, title_text]);

            title_help = $(document.createElement('button')).attr('aria-label', 'Help').attr({onclick: 'openDraggableWindow(this)', id : 'steam-help-icon'});
            title_bar_controls.prepend(title_help);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'steam'}).css("text-align", "center");

            //implement here
            game_container = $(document.createElement('div')).attr("id", "game-container").addClass("window");
            screen = $(document.createElement('div')).attr("id", "game-screen");
            game = $(document.createElement('canvas')).attr("id", "jsdos").append($(document.createElement('span')).attr("id", "game").addClass("no-game"));
            screen.append(game);
            button_full = $(document.createElement('button')).addClass("dosbox-button").attr({disabled: "True", onclick: "ci.fullscreen()"}).text("Make Fullscreen");
            button_eject = $(document.createElement('button')).addClass("dosbox-button").attr({disabled: "True", onclick: "ejectGame()"}).text("Eject Game");
            game_container.append([screen, button_full, button_eject]);

            //append to window body
            window_body.append(game_container);
            status_bar = $(document.createElement('div')).addClass("status-bar").append([
              $(document.createElement('p')).addClass("status-bar-field").text("Press ? for Help"),
              $(document.createElement('p')).attr("id", "game-title").addClass("status-bar-field").text("Pick a game from the Games folder in the Start menu"),
              $(document.createElement('p')).addClass("status-bar-field").text("CPU Usage: 99%"),
            ]);
            wind.append([title_bar, window_body, status_bar]);

            //create program
            program = "steam";
            program_text = "Steam98";
          }
          break;
        case "steam-help-icon":
          if($('#steam-help').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/steam-help_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Steam98.exe");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'steam-help'});

            tree = $(document.createElement('ul')).addClass("tree-view").css("width", "400px");
            item1 = $(document.createElement('li')).append($(document.createElement('strong')).css("color", '#55468e').text('👾 Steam98 👾'));
            steam98_text = "Steam98 is my implementation of js-dos, a javascript library that allows you to run DOS programs in a browser. Simply " + 
            "pick a game from the Games folder in the start menu and start playing. You can only load one game at a time, but you can exit a game whenever " + 
            "you wish. Below are links to all the games with information about them. Contact me if you have any game requests!";
            item2 = $(document.createElement('li')).text("What is Steam98?").append(
              $(document.createElement('ul')).append($(document.createElement('li')).text(steam98_text))
            );
            item3 = $(document.createElement('li')).append($(document.createElement('details')).attr({open: "True"}).append($(document.createElement('summary')).text("Games")));
            //list of all games and their links
            item4 = $(document.createElement('ul')).attr("id", "steam-help-list").append([
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Solitaire").attr({target: '_blank',href: "https://dosgames.com/game/solitaire-suite/"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Ms. Pacman").attr({target: '_blank',href: "https://dosgames.com/game/ms-pacman-pc"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("DOOM").attr({target: '_blank',href: "https://dosgames.com/game/doom"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Duke Nukem 3D").attr({target: '_blank',href: "https://dosgames.com/game/duke-nukem-3d"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Wolfenstein 3D").attr({target: '_blank',href: "https://dosgames.com/game/wolfenstein-3d"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Mario").attr({target: '_blank',href: "https://dosgames.com/game/mario-and-luigi"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Mortal Kombat 3").attr({target: '_blank',href: "https://dosgames.com/game/mortal-kombat-3"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Star Wars: Dark Forces").attr({target: '_blank',href: "https://dosgames.com/game/star-wars-dark-forces/"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Systemshock").attr({target: '_blank',href: "https://dosgames.com/game/system-shock"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Street Fighter 2 Turbo").attr({target: '_blank',href: "https://dosgames.com/game/super-street-fighter-ii-turbo"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Acid Tetris").attr({target: '_blank',href: "https://dosgames.com/game/acid-tetris"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Chess88").attr({target: '_blank',href: "https://dosgames.com/game/chess88/"})),
              $(document.createElement('li')).append(
                $(document.createElement('a')).text("Viking Siege").attr({target: '_blank',href: "https://dosgames.com/game/viking-siege/"}))
            ]);
            //implement here
            //append to window body
            tree.append([
              item1, item2, item3, item4
            ]);
            window_body.append(tree);
            wind.append([title_bar, window_body]);

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
            theme_container = $(document.createElement('div')).css({"display": "flex", "flex-direction": "column"});
            theme_container.append([
              $(document.createElement('p')).text("Select a theme"),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('light')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("🌞")),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('dark')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("🌚")),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('rose-gold')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("🌹")),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('clouds')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("☁️")),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('cybercity')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("🌆")),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('cybernightcity')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("🌃")),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('galaxy')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("🌌")),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('xp')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("🌄")),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('doge')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").append($(document.createElement('img')).attr("src", "images/doge.png").css({"width": "32px", "height": "40px"}))),
              $(document.createElement('button')).attr("font-size", "16").attr({size: "36", onclick: "changeTheme('star-wars')"}).append($(document.createElement('span')).attr("role", "img").css("font-size", "30px").text("⭐")),
            ]);
            //append to window body
            window_body.append(theme_container);
            wind.append([title_bar, window_body]);

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
            aim_header = $(document.createElement('img')).attr("src", "images/aim_header.jpg");
            hr = $(document.createElement('hr'));

            field_row1 = $(document.createElement('div')).addClass("field-row");
            label1 = $(document.createElement('label')).attr("for", "text17").text("Screen Name");
            select1 = $(document.createElement('select')).append([
              $(document.createElement('option')).text("<New User>"),
              $(document.createElement('option')).text("loganator97")
            ]);
            field_row1.append([label1, select1]);

            field_row2 = $(document.createElement('div')).addClass("field-row");
            label2 = $(document.createElement('label')).attr("for", "text17").text("Password");
            input1 = $(document.createElement('input')).attr({id: "text17", type: "text", disabled: "True"});
            field_row2.append([label2, input1]);

            field_row3 = $(document.createElement('div')).addClass("field-row").append([
              $(document.createElement('input')).attr({disabled: "True", type: "checkbox", id: "aim-save-password"}),
              $(document.createElement('label')).attr("for", "aim-save-password").css("margin-right", "16%").text("Save password"),
              $(document.createElement('input')).attr({disabled: "True", type: "checkbox", id: "aim-auto-login"}),
              $(document.createElement('label')).attr("for", "aim-auto-login").text("Auto-login"),
            ]);

            field_row4 = $(document.createElement('div')).addClass("field-row").attr("id", "aim-button-row").append([
              $(document.createElement('div')).css("display", "flex").append([
                $(document.createElement('div')).append([
                  $(document.createElement('img')).attr("src", "images/icons/aim_help.png"),
                  $(document.createElement('p')).text("Help")
                ]),
                $(document.createElement('div')).css("margin-left", "50%").append([
                  $(document.createElement('img')).attr("src", "images/icons/aim_setup.png"),
                  $(document.createElement('p')).text("Setup")
                ]),
              ]),
              $(document.createElement('div')).append([
                $(document.createElement('img')).attr("src", "images/icons/aim_signon.png"),
                $(document.createElement('p')).append($(document.createElement('b')).text("Sign On"))
              ])
            ]);

            field_row5 = $(document.createElement('div')).addClass("field-row").append([
              $(document.createElement('p')).css({"margin-top": "0", "margin-bottom": "0", "margin-left": "30%"}).text("Version 3.0.1464")
            ]);
            //append to window body
            window_body.append([
              aim_header, hr, field_row1, field_row2, field_row3, field_row4, field_row5
            ]);
            wind.append([title_bar, window_body]);

            //create program
            program = "aim";
            program_text = "AOL Instant Messenger";
          }
          break;  
        case "credit-icon":
          if($('#credit').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/credit_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("Credits");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'credit'});

            //implement here
            credit_text = $(document.createElement('p')).attr("id", "credit-text").html("Credits to the creator of 98.css for some of the styling<br>on this site as well cvault finance for the inspiration.<br>Oh, and of course Microsoft.");
            rating_text = $(document.createElement('p')).attr("id", "rating-text").text("Leave a rating!");
            field_row1 = $(document.createElement('div')).addClass("field-row").attr("id", "credit-bar").append([
              $(document.createElement('label')).attr("for", "range22").text("Rating:"),
              $(document.createElement('label')).attr("for", "range23").text("0"),
              $(document.createElement('input')).attr({id: "range23", type: "range", min: "0", max: "10", value: "5"}),
              $(document.createElement('label')).attr("for", "range24").text("10")
            ]);
            submit_button = $(document.createElement('button')).attr({id: "submit-rating", onclick: "submitRating()"}).text("Submit Rating");

            //append to window body
            window_body.append([
              credit_text, rating_text, field_row1, submit_button
            ]);
            wind.append([title_bar, window_body]);

            //create program
            program = "credit";
            program_text = "Credits";
          }       
          break;
        case "tenacious_icon":
          if($('#tenacious').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/wm_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("tenacious.mp4");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'wm-tenacious'});

            //implement here
            video = $(document.createElement('iframe')).css({width: "560", height: "315"}).attr({src: "https://www.youtube.com/embed/_lK4cX5xGiQ", allow: "fullscreen"});
            //append to window body
            window_body.append(video);
            wind.append([title_bar, window_body]);

            //create program
            program = "wm-tenacious";
            program_text = "tenacious.mp4";
          }
          break;
        case "nft_icon":
          if($('#nft').length == 0){
            icon = $(document.createElement('img')).attr({src: 'images/icons/wm_small.png'});
            title_text = $(document.createElement('div')).addClass("title-bar-text").text("nft.mp4");
            title_bar_text_icon.append([icon, title_text]);
            
            title_bar.append(title_bar_text_icon, title_bar_controls);

            window_body = $(document.createElement('div')).addClass("window-body").attr({id: 'wm-nft'});

            //implement here
            video = $(document.createElement('iframe')).css({width: "560", height: "315"}).attr({src: "https://www.youtube.com/embed/yY4WK9XDFKg", allow: "fullscreen"});
            //append to window body
            window_body.append(video);
            wind.append([title_bar, window_body]);

            //create program
            program = "wm-nft";
            program_text = "nft.mp4";
          }
          break;
    }

    wind.draggable();
    $("#desktop-content").append(wind);

    if($('#' + program + '-program-container').length == 0){
      removeProgramClicked();
      $("#start-program-container").append($(document.createElement('div'))
        .attr({ id: program + '-program-container' })
        .addClass("program-container"));
      $('#' + program + '-program-container').append($(document.createElement('span'))
        .addClass("program-clicked program"));
      $('#' + program + '-program-container span').append($(document.createElement('div')));
      //for windows media files
      if(program.includes("wm-")){
        $('#' + program + '-program-container span div').append($(document.createElement('img')).attr({ src: 'images/icons/wm_small.png'}));
      }else{
        $('#' + program + '-program-container span div').append($(document.createElement('img')).attr({ src: 'images/icons/' + program + '_small.png'}));
      }
      $('#' + program + '-program-container span div').append($(document.createElement('p')).text(program_text));
    }
    //refeactor to add more here
}