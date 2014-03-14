var battleEngine = 	{
						track_draw	: 0,
						track_win	: 0,
						track_lose	: 0,
						track_play	: 0,
						
						playerLevelSettings : null,
						
						init : function(e, m, h, s)
						{
							this.playerLevelSettings = {};
							
							this.playerLevelSettings = {
															easy		: 0,
															medium		: 40,
															high		: 80,
															max_super	: 120
														};
							
						},
						
						playerLevelSort : function(player_ob)
						{
							if(player_ob.level >= this.playerLevelSettings.easy && player_ob.level < this.playerLevelSettings.medium)
							{
								player_ob.battle_class = "APPRENTICE";
								player_ob.fullStrike = 51;
								player_ob.magic = 5;
							}
					
							else if(player_ob.level >= this.playerLevelSettings.medium && player_ob.level < this.playerLevelSettings.high)
							{	
								player_ob.battle_class = "KNIGHT";
								player_ob.fullStrike = 71;
								player_ob.magic = 40;
							}
					
							else if(player_ob.level >= this.playerLevelSettings.high && player_ob.level < this.playerLevelSettings.max_super)
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
						},
											
						playerProgress : function(player_win, player_lose, enemy)
						{
							var updateLevel = false;
							var updateValue;
							
							if(player_win.level > player_lose.level)
							{
								updateLevel = false;
							}
							
							if(player_win.level === player_lose.level)
							{
								updateLevel = true;
								updateValue = player_win.level += 1;
							}
							
							if(player_win.level < player_lose.level)
							{
								updateLevel = true;
								
								if(enemy)
								{
									updateValue = player_win.level += player_lose.level;
								}
								
								else
								{
									updateValue = player_win.level += Math.round(player_lose.level * 0.25); //0.5	
								}
							}
							
							if(updateLevel)
							{
								player_win.level = updateValue;
								
								this.playerLevelSort(player_win);
							}							
						},
						
						battle : function(player_ob, enemy_ob, boss)
						{
							var battleData = {};
							
							var finalMagic = 0;
							
							var levelDrop = 0;
							
							this.track_play ++;
							
							// IF CLASS === "MASTER && MASTER"
							
							if(player_ob.battle_class === enemy_ob.battle_class)
							{
								if(player_ob.level >= enemy_ob.level)
								{
									// IF PLAYER_1 LEVEL IS GREATER BY 20 THEY GET FULL MAGIC
									
									if(Math.abs(player_ob.level - enemy_ob.level) > 20)
									{
										finalMagic = player_ob.magic;
									}
									
									// IF PLAYER_1 LEVEL IS ONLY SLIGHTLY GREATER THEY GET LESS MAGIC
									
									else if(Math.abs(player_ob.level - enemy_ob.level) > 10)
									{
										finalMagic = Math.floor(player_ob.magic * 0.25);
									}
									
									// FOR LESS EXPERIENCE AT THAT LEVEL
									else
									{
										finalMagic = Math.floor(player_ob.magic * 0.5);
									}	
								}
								
								else
								{
									finalMagic = Math.floor(player_ob.magic * 0.5);
								}
							}
							
							else
							{
								finalMagic = player_1.magic;
							}
							
							battleData.player_attack = Math.floor(Math.random() * (player_ob.fullStrike - finalMagic) + finalMagic);
							battleData.enemy_attack = Math.floor(Math.random() * (enemy_ob.fullStrike - enemy_ob.magic) + enemy_ob.magic);
							
							//////// ---------- DRAW
							
							
							if(battleData.player_attack === battleData.enemy_attack)
							{
								battleData.status_player = battleData.status_enemy = "DRAW";
								
								this.track_draw ++;
							}
							
							//////// ---------- WIN
							
							if(battleData.player_attack > battleData.enemy_attack)
							{
								battleData.status_player = "WIN";
								battleData.status_enemy = "LOSE";
								
								this.playerProgress(player_ob, enemy_ob, false);
								
								if(boss)
								{
									
								}
								
								else
								{
									enemy_ob.alive = false;
									enemy_ob.active = false;
								}
								
								this.playerLevelSort(player_ob);
								
								this.track_win ++;
							}
							
							//////// ---------- LOSE
							
							else
							{
								battleData.status_player = "LOSE";
								battleData.status_enemy = "WIN";
								
								levelDrop = Math.round(Math.abs(player_ob.level - player_ob.level * 0.4));
								
								this.playerProgress(enemy_ob, player_ob, true, levelDrop);
								
								this.playerLevelSort(enemy_ob);
								
								this.track_lose ++;					
							}
							
							
							return battleData;
						},
						
						enemyAllDeadCheck : function(checkArray)
						{
							var enemyAllDead = true;
							
							for(var i in checkArray)
							{
								if(checkArray[i].alive)
								{
									enemyAllDead = false;
									
									break;
								}
							}
							
							return enemyAllDead;
						}
					};