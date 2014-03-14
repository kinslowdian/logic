			var trace = function(str){ console.log(str); };
			
			
			var enemyArray = new Array();
			
			var player_1 = {};
			
			// var playerLevelSettings = {};
			
			var bossDefeat = 0;
			var bossDefeatWin = 3;
			
			function init(event)
			{
				trace(event);
				
				battleEngine.init(0, 40, 80, 120);
				
				
/*
				playerLevelSettings = 	{
											easy		: 0,
											medium		: 40,
											high		: 80,
											max_super	: 120
										};
*/
				
				init_player1()
				
				populate();
			}
			
			function init_player1()
			{
				player_1.level 			= 0;
				player_1.attack 		= 0;
				player_1.battle_class 	= "";
				player_1.win 			= false;
				player_1.status 		= "";				
			
				battleEngine.playerLevelSort(player_1);
			}
			
			function purge_player1()
			{
				player_1.attack = 0;
				player_1.win = false;
			}
			
			function populate()
			{
				var l = 0;
				
				for(var i = 0; i < 40; i++)
				{
					var string_id = "box" + i;
					//var string_lv = Math.floor(Math.random() * (playerLevelSettings.high - playerLevelSettings.easy) + playerLevelSettings.easy);
					
					var string_lv = Math.floor((i * 2) * 0.5);
					
					var enemyHTML = '<div id="' + string_id + '" class="box" data-level="' + string_lv + '"><div class="sprite"><p class="lv">00</p></div><div class="box-inner"><div class="box-meter"></div></div></div>';
				
					$("body").append(enemyHTML);
				}
			
				setup();
			}
			
			function setup()
			{
				$(".box").each(function(i)
				{
					var _id = $(this).attr("id");
					
					// $(this).on("click", clickEvent);
					
					$(this)[0].addEventListener("click", clickEvent, false);
					
					$(this).css("cursor", "pointer");
					
					var E = {};
					
					E._id = _id;
					E.level = parseInt($("#" + E._id).attr("data-level"));
					E.alive = true;
					E.active = true;
					
					$("#" + E._id + " .lv").text(E.level);
					
					enemyArray.push(E);
				});
				
				var B = {};
				
				B._id = "boss";
				B.level = parseInt($("#" + B._id).attr("data-level"));
				B.alive = true;
				B.active = true;
				
				// $("#" + B._id).on("click", clickEvent);
				
				$("#" + B._id)[0].addEventListener("click", clickEvent, false);
				
				$("#" + B._id).css("cursor", "pointer");
				
				$("#" + B._id + " .lv").text(B.level);
					
				enemyArray.push(B);				
				
				splitDifficulty();
				
				$("#superPill")[0].addEventListener("click", superPillEat, false);
			}
			
			function superPillEat(event)
			{
				player_1.level += 100;
				
				updateDisplay(enemyArray[0]);
			}
			
			
			function splitDifficulty()
			{
				for(var i in enemyArray)
				{
					battleEngine.playerLevelSort(enemyArray[i]);
					
					var meter_css;
					var meter_scale;
					
					if(enemyArray[i].alive)
					{
						if(enemyArray[i].battle_class === "APPRENTICE")
						{
							// $("#" + enemyArray[i]._id + " .box-inner").css("opacity", 0.25);
							
							meter_scale = 0.25;
						}
						
						else if(enemyArray[i].battle_class === "KNIGHT")
						{
							// $("#" + enemyArray[i]._id + " .box-inner").css("opacity", 0.5);
							
							meter_scale = 0.5;
						}
						
						else if(enemyArray[i].battle_class === "MASTER")
						{
							// $("#" + enemyArray[i]._id + " .box-inner").css("opacity", 0.75);
							
							meter_scale = 0.75;
						}
						
						else if(enemyArray[i].battle_class === "LORD")
						{
							// $("#" + enemyArray[i]._id + " .box-inner").css("opacity", 1);
							
							meter_scale = 1;
						}
						
						else
						{
							
						}
						
						meter_css = {
										"-webkit-transform"	: "scaleX(" + meter_scale + ")",
										"transform"			: "scaleX(" + meter_scale + ")"
									};
						
						$("#" + enemyArray[i]._id + " .box-inner .box-meter").css(meter_css);
						
						// allDead = false;
					}
					
/*
					else
					{
						if(enemyArray[i].active)
						{
							enemyArray[i].active = false;
							
							$("#" + enemyArray[i]._id).off("click", clickEvent);
							$("#" + enemyArray[i]._id).css("cursor", "default");	
						}						
					}
*/
				}
			}
			
			function clickEvent(event)
			{
				for(var i in enemyArray)
				{
					if(event.target.id === enemyArray[i]._id)
					{
						sortEnemy(enemyArray[i]);
						
						break;
					}
				}
			}
			
			
			function sortEnemy(player_e)
			{
				var result = battleEngine.battle(player_1, player_e, false);
				
				trace(result);
				trace(battleEngine);
				
				// updateDisplay(player_e)
			}
			
			
			function updateDisplay(player_e)
			{
				$("#info_p1 .level").text(player_1.level);
				$("#info_p2 .level").text(player_e.level);
				
				$("#info_p1 .class").text(player_1.battle_class);
				$("#info_p2 .class").text(player_e.battle_class);
				
				$("#info_p1 .num").text(player_1.attack);
				$("#info_p2 .num").text(player_e.attack);
			
			}