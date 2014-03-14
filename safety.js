		<script type="text/javascript">
			
			var trace = function(str){ console.log(str); };
			
			
			var p1_level = 0;
			var p2_level;
			
			var updateLevel = false;
			var updateLevelVal = 1;
			
			var enemyArray = new Array();
			
			var player_1 = {};
			var player_2 = {};
			
			var playerLevelSettings = {};
			
			var bossDefeat = 0;
			var bossDefeatWin = 3;
			
			var track_draw = 0;
			var track_win = 0;
			var track_lose = 0;
			var track_play = 0;
			
			function init(event)
			{
				trace(event);
				
				
				playerLevelSettings = 	{
											easy		: 0,
											medium		: 40,
											high		: 80,
											max_super	: 120
										};
				
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
			
				playerLevelSort(player_1);
			}
			
			function purge_player1()
			{
				player_1.attack = 0;
				player_1.win = false;
			}
			
			function init_player2(lv, diff)
			{
				player_2.level 			= lv;
				player_2.attack 		= 0;
				player_2.battle_class 	= diff;
				player_2.win 			= false;				
				player_2.status 		= "";
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
					playerLevelSort(enemyArray[i]);
					
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
				player1_player2_battle(player_e);
				
				updateDisplay(player_e)
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
			
			function playerLevelSort(player_ob)
			{
				if(player_ob.level >= playerLevelSettings.easy && player_ob.level < playerLevelSettings.medium)
				{
					player_ob.battle_class = "APPRENTICE";
					player_ob.fullStrike = 51;
					player_ob.magic = 5;
				}
					
				else if(player_ob.level >= playerLevelSettings.medium && player_ob.level < playerLevelSettings.high)
				{	
					player_ob.battle_class = "KNIGHT";
					player_ob.fullStrike = 71;
					player_ob.magic = 40;
				}
					
				else if(player_ob.level >= playerLevelSettings.high && player_ob.level < playerLevelSettings.max_super)
				{		
					player_ob.battle_class = "MASTER";
					player_ob.fullStrike = 91;
					player_ob.magic = 60;
				}
					
				else
				{
					player_ob.battle_class = "LORD";
					player_ob.fullStrike = 101;
					player_ob.magic = 80;
				}				
			}
			
			function playerProgress(player_w, player_l, enemy)
			{
				var updateLevel = false;
				var updateValue;
				
				if(player_w.level > player_l.level)
				{
					updateLevel = false;
				}
				
				if(player_w.level === player_l.level)
				{
					updateLevel = true;
					updateValue = player_w.level += 1;
				}
				
				if(player_w.level < player_l.level)
				{
					updateLevel = true;
					
					if(enemy)
					{
						updateValue = player_w.level += player_l.level;
					}
					
					else
					{
						updateValue = player_w.level += Math.round(player_l.level * 0.25); //0.5	
					}
				}
				
				if(updateLevel)
				{
					player_w.level = updateValue;
					
					playerLevelSort(player_w);
				}
				
				if(enemy)
				{
					$("#" + player_w._id + " .lv").text(player_w.level);
				}
				
/*
				if(enemy)
				{
					player_l.level = _levelDrop;
					
					playerLevelSort(player_l);
				}
*/
				
				enemy ? updateDisplay(player_w) : updateDisplay(player_l);
			}
			
			
			function player1_player2_battle(player_e)
			{
				var status_1 = "";
				var status_2 = "";
				var finalMagic;
				
				track_play ++;
				
				
				// IF CLASS === "MASTER && MASTER"
				
				if(player_1.battle_class === player_e.battle_class)
				{
					if(player_1.level >= player_e.level)
					{
						// IF PLAYER_1 LEVEL IS GREATER BY 20 THEY GET FULL MAGIC
						
						if(Math.abs(player_1.level - player_e.level) > 20)
						{
							finalMagic = player_1.magic;
						}
						
						// IF PLAYER_1 LEVEL IS ONLY SLIGHTLY GREATER THEY GET LESS MAGIC
						
						else if(Math.abs(player_1.level - player_e.level) > 10)
						{
							finalMagic = Math.floor(player_1.magic * 0.25);
						}
						
						// FOR LESS EXPERIENCE AT THAT LEVEL
						else
						{
							finalMagic = Math.floor(player_1.magic * 0.5);
						}	
					}
					
					else
					{
						finalMagic = Math.floor(player_1.magic * 0.5);
					}
				}
				
				else
				{
					finalMagic = player_1.magic;
				}
				
				
				
				player_1.attack = Math.floor(Math.random() * (player_1.fullStrike - finalMagic) + finalMagic);
				
				player_e.attack = Math.floor(Math.random() * (player_e.fullStrike - player_e.magic) + player_e.magic);
				
				if(player_1.attack === player_e.attack)
				{
					status_1 = status_2 = "DRAW";
					
					track_draw ++;
				}
				
				if(player_1.attack > player_e.attack)
				{
					status_1 = "WIN";
					status_2 = "LOSE";
					
					playerProgress(player_1, player_e, false);
					
					
					if(player_e._id === "boss")
					{
						if(bossDefeat < bossDefeatWin)
						{
							bossDefeat++;
							
							$("#info_p1 .boss_defeat").text(bossDefeat);
						}
						
						else
						{
							player_e.alive = false;
							player_e.active = false;
									
							// $("#" + player_e._id).off("click", clickEvent);
							
							$("#" + player_e._id)[0].removeEventListener("click", clickEvent, false);
							
							$("#" + player_e._id).css("cursor", "default");
							
							$("#" + player_e._id).css("opacity", 0);
							
							alert("COMPLETED " + "win rate == " + Math.round((track_win / track_play) * 100) + "%");
							
/*
							var bar_css;
							
							var bar_scale =  Math.round((track_win / track_play) * 100) * 0.01;
							
							bar_css = 	{
											"-webkit-transform"	: "scaleX(" + bar_scale + ")",
											"transform"			: "scaleX(" + bar_scale + ")"
										};
							
							$("#finalScore #scoreMeter #scoreMeterBar").css(bar_css);
*/	
						}
					}
					
					else
					{
						player_e.alive = false;
						player_e.active = false;
								
						// $("#" + player_e._id).off("click", clickEvent);
						
						$("#" + player_e._id)[0].removeEventListener("click", clickEvent, false);
						
						$("#" + player_e._id).css("cursor", "default");
						
						$("#" + player_e._id).css("opacity", 0);
					}
					
					// $("#" + player_e._id)[0].addEventListener("webkitTransitionEnd", removeFromStage, false);
					// $("#" + player_e._id)[0].addEventListener("transitionend", removeFromStage, false);
					
					

					
					playerLevelSort(player_1);
					
					track_win ++;
				}
				
				else
				{
					status_1 = "LOSE";
					status_2 = "WIN";
					
					
					var levelDrop = Math.round(Math.abs(player_1.level - player_1.level * 0.4));
					
					
					playerProgress(player_e, player_1, true, levelDrop);
					
					playerLevelSort(player_e);
					
					splitDifficulty();
					
					track_lose ++;	
				}
				
				$("#info_p1 .outcome").text(status_1);
				$("#info_p2 .outcome").text(status_2);
				
				track_rating();
				
				track_plays();
			}
			
			function removeFromStage(event)
			{
				$("#" + event.target.id)[0].addEventListener("webkitTransitionEnd", removeFromStage, false);
				$("#" + event.target.id)[0].addEventListener("transitionend", removeFromStage, false);
			
				$("#" + event.target.id).remove();
			}
			
			function track_rating()
			{
				var bar_css;
							
				var bar_scale =  Math.round((track_win / track_play) * 100) * 0.01;
							
				bar_css = 	{
								"-webkit-transform"	: "scaleX(" + bar_scale + ")",
								"transform"			: "scaleX(" + bar_scale + ")"
							};
							
				$("#finalScore #scoreMeter #scoreMeterBar").css(bar_css);				
			}
			
			function track_plays()
			{
				var allDead = true;
				
				var boss_css;
				
				for(var i in enemyArray)
				{
					if(enemyArray[i].alive && enemyArray[i]._id !== "boss")
					{
						allDead = false;
						
						break;
					}
				}
				
				if(allDead)
				{
					boss_css	= 	{
										"-webkit-transform"	: "translateY(0px)",
										"transform"			: "translateY(0px)"
									};
				
					$("#boss").css(boss_css);				
				}
				
				trace("---------------------------------");
				trace("PLAYS == " + track_play);
				trace("DRAWS == " + track_draw);
				trace("WINS == " + track_win);
				trace("LOSE == " + track_lose);
			}
			
			
			
			
			
		</script>