// State
// Keeps track of what character was selected and what character player will fight agaisnt
var gameState = {
  userPokemon: '',
  rivalPokemon: '',
  pokemonDB: [
    {
      name: 'charmander',
      type: 'fire',
      hp: 39,
      attack: 52,
      defense: 43,
      level: 1,
      img: 'http://www.smogon.com/dex/media/sprites/xy/charmander.gif'
    },
    {
      name: 'bulbasaur',
      type: 'grass',
      hp: 45,
      attack: 49,
      defense: 49,
      level: 1,
      img: 'http://www.smogon.com/dex/media/sprites/xy/bulbasaur.gif'
    },
    {
      name: 'squirtle',
      type: 'water',
      hp: 44,
      attack: 48,
      defense: 65,
      level: 1,
      img: 'http://www.smogon.com/dex/media/sprites/xy/squirtle.gif'
    },
  ],
  elements: {
    pokemonsEl: document.querySelector('.select-screen').querySelectorAll('.character'),
    battleScreenEl: document.getElementById('battle-screen'),
    attackBtnsEl: document.getElementById('battle-screen').querySelectorAll('.attack'),
  },
   init: function() {
     //ELEMENTS

     console.log(gameState.elements.attackBtnsEl)

     //THIS IS THE INITAL LOOP
     var i = 0;
     while (i < gameState.elements.pokemonsEl.length) {
       //Add function to all characters on screen select
       gameState.elements.pokemonsEl[i].onclick = function() {
         //current selected pokemon name
         // 1st line below used to access which pokemon was clicked with data- tag next to class in html
         var pokemonName = this.dataset.pokemon
         // ELEMETS Change the character image to what was picked on battle screen
         var player1Img = document.querySelector('.player1').getElementsByTagName('img')
         var player2Img = document.querySelector('.player2').getElementsByTagName('img')
         //console.log('I pressed this pokemon ' + pokemonName)
         // We saved the current pokemon
         gameState.userPokemon = pokemonName
         // Have cpu pick a character
         gameState.cpuPick()
         // CHANGE SCREEN TO BATTLE SCREEN
         // Add class to div so battle screen comes up once character is picked
         gameState.elements.battleScreenEl.classList.toggle('active')
         // Select data from current user pokemon Player1
         // var currentPokemon = pokemonDB.filter(function(pokemon) {
         //   return pokemon.name == gameState.userPokemon
         // })
         gameState.currentPokemon = gameState.pokemonDB.filter(function(pokemon) {
           return pokemon.name == gameState.userPokemon
         })
         //Gets img from database at top to match what character was picked
         // player1Img[0].src = currentPokemon[0].img
         player1Img[0].src = gameState.currentPokemon[0].img
         // Select data from current user pokemon Player2
         // var currentRivalPokemon = pokemonDB.filter(function(pokemon) {
         //   return pokemon.name == gameState.rivalPokemon
         // })
         gameState.currentRivalPokemon = gameState.pokemonDB.filter(function(pokemon) {
           return pokemon.name == gameState.rivalPokemon
         })
         //Gets img from database at top to match what character was picked
         // player2Img[0].src = currentRivalPokemon[0].img
         player2Img[0].src = gameState.currentRivalPokemon[0].img
         //console.log(currentPokemon)
         //console.log(gameState)
         //console.log(player1Img[0])
         // Current user and cpu pokemon initial health
         gameState.currentPokemon[0].health = gameState.calculateInitialHealth(gameState.currentPokemon);
         gameState.currentPokemon[0].originalHealth = gameState.calculateInitialHealth(gameState.currentPokemon);
         gameState.currentRivalPokemon[0].health = gameState.calculateInitialHealth(gameState.currentRivalPokemon);
         gameState.currentRivalPokemon[0].originalHealth = gameState.calculateInitialHealth(gameState.currentRivalPokemon);
         console.log(gameState)

       }
       i++
     }

     var a = 0
     while (a < gameState.elements.attackBtnsEl.length) {
       gameState.elements.attackBtnsEl[a].onclick = function() {
         var attackName = this.dataset.attack
         gameState.currentUserAttack = attackName

         gameState.play(attackName, gameState.cpuAttack())
       }
       a++
     }
   },

  cpuAttack: function() {
    var attacks = ['rock', 'paper', 'scissors']
    return attacks[gameState.randomNumber(0,3)]
  },

  calculateInitialHealth: function(user) {
    return ((0.20 * Math.sqrt(user[0].level)) * user[0].defense) * user[0].hp
    console.log(user[0].level)
  },

  attackMove: function(attack, level, stack, critical, enemy, attacker) {
    console.log(enemy.name + ' health before: ' + enemy.health);
    var attackAmount = attack * level  * (stack + critical);
    enemy.health = enemy.health - attackAmount;
    // Bring health bar down ============
    var userHP = document.querySelector('.player1').querySelector('.stats')
    .querySelector('.health').querySelector('.health-bar').querySelector('.inside')

    var cpuHP = document.querySelector('.player2').querySelector('.stats')
    .querySelector('.health').querySelector('.health-bar').querySelector('.inside')

    if(enemy.owner == 'user') {
      var minusPercent = ((enemy.health * 100) / enemy.originalHealth)
      console.log(userHP)
      userHP.style.width = ((minusPercent < 0) ? 0 : minusPercent) + '%'
    } else {
      var minusPercent = ((enemy.health * 100) / enemy.originalHealth)
      console.log(cpuHP)
      cpuHP.style.width = ((minusPercent < 0) ? 0 : minusPercent) + '%'
    }
    gameState.checkWinner(enemy, attacker)
    console.log(enemy.name + '  after: ' + enemy.health + ' Attack amount: ' + attackAmount)
  },
  checkWinner: function(enemy, attacker) {
    if(enemy.health <= 0){
    console.log('HEY YOU ARE THE WINNER! ' + attacker.name)
    }
  },

  // How was written it was being saved as a global variable.
  // function randomNumber(min, max) {
  //   return Math.floor(Math.random() * (max - min)) + min;
  // }
  // Replaces above code to make it a variable
  randomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  // Have cpu pick a character
  // How it was written it was being saved as a global variable.
  // function cpuPick() {
  //   gameState.rivalPokemon = pokemonsEl[randomNumber(0, 3)]
  //   .dataset.pokemon
  // }
  // Have cpu pick a character randomly
  cpuPick: function () {
    do {
      gameState.rivalPokemon = gameState.elements.pokemonsEl[gameState.randomNumber(0, 3)]
      .dataset.pokemon
      console.log('looping' + gameState.rivalPokemon)
    }
    while (gameState.userPokemon == gameState.rivalPokemon)
  },
  play: function(userAttack, cpuAttack) {
    var currentPokemon = gameState.currentPokemon[0]
    var currentRivalPokemon = gameState.currentRivalPokemon[0]
    //
    currentPokemon.owner = 'user'
    currentRivalPokemon.owner = 'cpu'
    switch(userAttack) {
    case 'rock':
        if(cpuAttack == 'paper'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
            }
          }
        }
        if(cpuAttack == 'scissors'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
            }
          }
        }
        if(cpuAttack == 'rock'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
            }
          }
        }
        break;
    case 'paper':
        if(cpuAttack == 'paper'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
            }
          }
        }
        if(cpuAttack == 'scissors'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
            }
          }
        }
        if(cpuAttack == 'rock'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
            }
          }
        }
        break;
    case 'scissors':
        if(cpuAttack == 'paper'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
            // console.log('Scissors beats paper')
            }
          }
        }
        if(cpuAttack == 'scissors'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
            // console.log('same attack scissors')
            }
          }
        }
        if(cpuAttack == 'rock'){
          if(currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            //User
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)
            if(currentRivalPokemon.health >= 1) {
            //Enemy CPU
            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
            // console.log('Rock beats scissors')
            }
          }
        }
        break;

    }
  }
};
gameState.init()
