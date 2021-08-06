/**
 * 
 * @title BladeMaster.js
 * @description Welcome BladeMaster! BladeMasterJS is a JS class that enhances the CryptoBlades.io UX experience while also offering an edge to battle
 * 
 * @ver 1.1
 * @author: phoenixtools
 * @contributors: Hudson Atwell
 */
 
 var BladeMasterJS = {
    
    scriptsLoaded : false,
    weaponStatsClone : {},
	balances : {},
	marketPrices : {},
	traitMap : {},
	character : {},
	weapon : {},
	enemies: {},
	currentFeeScope : "today",
	intervals : {},
	listeners : {},

	init : function() {
		
		this.loadHeader();
		this.loadPrices();
		this.loadWeb3();
		
		this.intervals.listeners = setInterval(function( bm ) {
			bm.loadListeners();
		}, 500 , this )

	}
	
	,
	
	loadWeb3 : function() {
		
		if (this.scriptsLoaded) {
			return;
		}
		
		var jq = document.createElement('script');
	    jq.type = 'text/javascript';
	    jq.async = true;
	    jq.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.5.0/web3.min.js';
	    var s = document.body.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(jq, s);
	    
	    this.scriptsLoaded = true;
	}
	
	,

	loadHeader : function() {
		
		if (document.querySelector('.BladeMasterJS')) {
			return;
		}
		
		var headerElement= document.createElement('div');
		
		var htmlTemplate = ''
		+ '<div class="BladeMasterJS" style="background-color: darkslategray;color: #fff;text-align: end;padding-right:7px; display:flex;justify-content:space-between;flex-wrap: wrap;font-size: 12px;"><div>'
		+ '		BladeMasterJS '
		
		+ '		<span class="header-separator"> | </span>'
		
		+ '		<b>$BNB</b> <span class="bnb-price" title="Market price of BNB in USD"></span>  <span class="bnb-balance" style="color:lightgreen"></span>'
		
		+ '		<span class="header-separator"> | </span>'
		
		+ '		<b>$SKILL</b> <span class="skill-price" title="Market price of SKILL in USD"></span>'
		
		+ '	</div><div>'
		
		+ '		<b>SKILL</b>:  <span class="skill-balance-skill" style="color:lightblue"></span>  <span class="skill-balance-usd" style="color:lightgreen"></span>  <span class="skill-balance-bnb" style="color:lightgreen"></span>'
		
		+ '		<span class="header-separator"> | </span>'
		
		+ '		<b>BNB</b>:  <span class="bnb-balance-bnb" style="color:lightblue"></span>  <span class="bnb-balance-usd" style="color:lightgreen"></span>  <span class="bnb-balance-skill" style="color:lightgreen"></span>'
		
		+ '		<span class="header-separator"> | </span>'
		
		+ '		<b>FEES</b>:  '
		
		//+ '		<span class="cycle-fee-scope-back" style=""><img src="/img/earning-potential-sword.753769a3.png" class="sword-right" style="width:25px;transform: scaleX(-1);margin-left: 10px;    margin-right: -3px;    margin-left: 2px;"></span>'	
		+ '     <span class="fee-label fee-bnb" id="fee-bnb-contatiner-today" style="color:lightblue;">Today  <span class="fee-bnb-today" style="color:lightblue"></span></span>'
		+ '     <span class="fee-labe fee-bnb" id="fee-bnb-contatiner-week" style="color:lightblue;display:none;">Week <span class="fee-bnb-week" style="color:lightblue"></span></span>'
		+ '     <span class="fee-label fee-bnb" id="fee-bnb-contatiner-month" style="color:lightblue;display:none">Month <span class="fee-bnb-month" style="color:lightblue"></span></span> '
		+ '		<span class="cycle-fee-scope-forward" ><img src="/img/earning-potential-sword.753769a3.png" class="sword-left" style="width:25px;margin-left: 3px;    margin-left: -2px;"></span>'
		
		+ '     <span class="header-separator"> | </span>'
		
		+ '     <a class="bnb-tip"  href="#tip-blademaster-dev"  title="Send a Tip to the BladeMasterJS Developemnt Team!">TIP <span class="recommended-bnb-tip">.01</span> <b>BNB</b></a>'
		+ '</div></div>'
		+ ' '
		+ '<style>.header-separator {margin:7px;}</style>'
		
		headerElement.innerHTML = htmlTemplate;
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(headerElement, firstChild);
		
	}
	
	,
	
	
	loadListeners : function() {
		
		/* make sure element exitst before adding listener */
		if (document.querySelector('.bnb-tip') && !BladeMasterJS.listeners.bnbTip) {
			/* listen for TIP BNB event */
			document.querySelector('.bnb-tip').addEventListener('click', function() {
				BladeMasterJS.listeners.bnbTip = true;
				
				var transactionHash = window.ethereum.request({
				    method: 'eth_sendTransaction',
				    params: [
				      {
				        to: '0x2D6371DB3C7f3B1D44A7613e5Dc9dd49C740eC2A',
				        from: window.ethereum.selectedAddress,
				        value: Web3.utils.toHex(Web3.utils.toWei("0.01")),
				      },
				    ],
				  });
			} , {once :true} )
		}
		
		/* make sure element exitst before adding listener */
		if (document.querySelector('.skill-tip') && !BladeMasterJS.listeners.skillTip) {

			BladeMasterJS.listeners.skillTip = true;
				
			/* listen for TIP SKILL event */
			document.querySelector('.skill-tip').addEventListener('click', function() {
				
			})
			
		}
		
		
		/* make sure element exitst before adding listener */
		if (document.querySelector('.cycle-fee-scope-back') && !BladeMasterJS.listeners.feeScopeBack) {
			
			BladeMasterJS.listeners.feeScopeBack = true;
				
			
			/* listen for TIP SKILL event */
			document.querySelector('.cycle-fee-scope-back').addEventListener('click', function() {
			
				document.querySelectorAll(".fee-bnb").forEach( function(feeContainer) {
					feeContainer.style.display = "none";
				})
						
				switch(BladeMasterJS.currentFeeScope) {
					case "today":
						BladeMasterJS.currentFeeScope = "month";
						break;
					case "week":
						BladeMasterJS.currentFeeScope = "today";
						break;
					case "month":
						BladeMasterJS.currentFeeScope = "week";
						break;	
				}
				
				console.log("BladeMasterJS.currentFeeScope back")
				console.log(BladeMasterJS.currentFeeScope);
				document.querySelector("#fee-bnb-contatiner-" + BladeMasterJS.currentFeeScope ).style.display = "inline-block";
			})
			
		}
		
		/* make sure element exitst before adding listener */
		if (document.querySelector('.cycle-fee-scope-forward')  && !BladeMasterJS.listeners.feeScopeForward) {
			
			
			BladeMasterJS.listeners.feeScopeForward = true;
			
			/* listen for TIP SKILL event */
			document.querySelector('.cycle-fee-scope-forward').addEventListener('click', function() {
				
				document.querySelectorAll(".fee-bnb").forEach( function(feeContainer) {
					feeContainer.style.display = "none";
				})
						
				switch(BladeMasterJS.currentFeeScope) {
					case "today":
						BladeMasterJS.currentFeeScope = "week";
						break;
					case "week":
						BladeMasterJS.currentFeeScope = "month";
						break;
					case "month":
						BladeMasterJS.currentFeeScope = "today";
						break;	
				}
				
				console.log("BladeMasterJS.currentFeeScope forward")
				console.log(BladeMasterJS.currentFeeScope);
				document.querySelector("#fee-bnb-contatiner-" + BladeMasterJS.currentFeeScope ).style.display = "inline-block";
			
			} )
			
		}
		
		
	
		
		/* make sure element exitst before adding listener */
		
		if (document.querySelector('.weapon-icon')) {
			
			/* make sure that manual weapon mouseovers always renews the battlestats */
			document.querySelector('.weapon-icon').addEventListener('mouseenter', function() {
					console.log("mouseenter")
					console.log(BladeMasterJS.intervals.battle)
					
					BladeMasterJS.checkIfBattlePage();
					BladeMasterJS.loadCharacter();
					BladeMasterJS.loadWeapon();
					BladeMasterJS.loadEnemies();
					BladeMasterJS.calculateBattle();
					
					if (BladeMasterJS.intervals.battle) {
						return;
					}
					
					console.log("set BladeMasterJS.intervals.battle");
					BladeMasterJS.intervals.battle = setInterval(function() {
						console.log("running Interval");
						BladeMasterJS.loadCharacter();
						BladeMasterJS.loadWeapon();
						BladeMasterJS.loadEnemies();
						BladeMasterJS.calculateBattle();
					} , 500 );
				
				
			} , {once :true} )
			
			/* make sure that manual weapon mouseovers always renews the battlestats */
			document.querySelector('.weapon-icon').addEventListener('mouseleave', function() {
					console.log("mouseleave")
					clearInterval(BladeMasterJS.intervals.battle)
					BladeMasterJS.intervals.battle = 0;
			} , {once :true} )
			
			
		}
		
		
		
	}
	
	,
	
	loadPrices : function() {
		
		if (this.marketPrices.bnb ) {
			return;
		}
		
		/* get user SKILL balance, does not include staked SKILL */
		this.balances.skill = document.querySelector('.balance').innerText.replace(' SKILL' , "").trim();
		
		/* load BNB and SKILL prices from Coingecko API */
		var coingeckoRequest = new XMLHttpRequest();
			
		var params = {
            vs_currency: "usd",
            ids: "binancecoin,cryptoblades"
        }
        
        var apiURL = new URL("https://api.coingecko.com/api/v3/coins/markets");
        
        for (const key in params ) {
        	apiURL.searchParams.append(key , params[key]);
        }
        
                
		coingeckoRequest.open("GET", apiURL.href );
		coingeckoRequest.send();
		
		coingeckoRequest.onload = () => {
	
			var responseJSON  = JSON.parse(coingeckoRequest.response);

			BladeMasterJS.marketPrices.bnb = responseJSON[0].current_price;
			BladeMasterJS.marketPrices.skill = responseJSON[1].current_price;
			
			/* figure out skill balance */
			BladeMasterJS.balances.usd_skill =  ( parseFloat(BladeMasterJS.balances.skill , 8 ) * parseFloat(BladeMasterJS.marketPrices.skill , 8 ) ).toFixed(2);
			
			BladeMasterJS.balances.bnb_skill =  ( parseFloat(BladeMasterJS.balances.usd_skill , 8 ) / parseFloat(BladeMasterJS.marketPrices.bnb , 8 ) ).toFixed(4);
			
			
			/* set these prices into the header */
			document.querySelector('.bnb-price').innerText = "" + BladeMasterJS.marketPrices.bnb +" "
			document.querySelector('.skill-price').innerText = "" + BladeMasterJS.marketPrices.skill + " "
			document.querySelector('.skill-balance-skill').innerText =  BladeMasterJS.balances.skill + " SKILL  "
			document.querySelector('.skill-balance-usd').innerText = "($" + BladeMasterJS.balances.usd_skill + ") "
			document.querySelector('.skill-balance-bnb').innerText = "(" + BladeMasterJS.balances.bnb_skill + " BNB) "
			
			
			/* load BNB Balance and Calculate Transactions from Custom API */
			var bscscanRequest = new XMLHttpRequest();
				
			var params = {
	            ethAddress: window.ethereum.selectedAddress,
	            clientDateTime: new Date().getTime(),
	            clientTimeZoneOffset: new Date().getTimezoneOffset(),
	        }
	        
	        apiURL = new URL("https://bscscan-api.vercel.app/api/gamestats");
	        
	        for (const key in params ) {
	        	apiURL.searchParams.append(key , params[key]);
	        }
	        
	                
			bscscanRequest.open("GET", apiURL.href );
			bscscanRequest.send();
			
			bscscanRequest.onload = () => {
		
				var responseJSON  = JSON.parse(bscscanRequest.response);
				
				console.log(responseJSON.balances);
				BladeMasterJS.balances.bnb = parseFloat(responseJSON.balances.inETH).toFixed(4);
				
				/* figure out dollar balance */
				BladeMasterJS.balances.usd_bnb =  ( parseFloat(BladeMasterJS.balances.bnb , 8 ) * parseFloat(BladeMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
				
				BladeMasterJS.balances.skill_bnb =  ( parseFloat(BladeMasterJS.balances.usd_bnb , 8 ) / parseFloat(BladeMasterJS.marketPrices.skill , 8 ) ).toFixed(4);
				
				
				/* set these prices into the header */
				document.querySelector('.bnb-balance-bnb').innerText =  BladeMasterJS.balances.bnb + " BNB  "
				document.querySelector('.bnb-balance-usd').innerText = "($" + BladeMasterJS.balances.usd_bnb + ") "
				document.querySelector('.bnb-balance-skill').innerText = "(" + BladeMasterJS.balances.skill_bnb + " SKILL) "
				document.querySelector('.fee-bnb-today').innerText = parseFloat(responseJSON.txFees.today).toFixed(4) + " BNB "
				document.querySelector('.fee-bnb-week').innerText =  parseFloat(responseJSON.txFees.thisWeek).toFixed(4) + " BNB "
				document.querySelector('.fee-bnb-month').innerText =  parseFloat(responseJSON.txFees.thisMonth).toFixed(4) + " BNB "
			};
		
		};
		
		
	
		

	}
	
	,
	
	/**
	 *
	 */
	checkIfBattlePage : function() {
		
		var currentPage = window.location.href.replace(window.location.origin + '/#/' , '');
		
		var isCombatPage = true;
		
		if (currentPage != 'combat') {
			isCombatPage = false;
		}
		
		if(document.querySelectorAll('.encounter-container').length <1 ) {
			isCombatPage = false;
		}
		
		
		
		if (isCombatPage) {
			
			console.log("isCombatPage")
			
			document.querySelectorAll('.victory-chance').forEach(function( box ) {
				box.style.position = "relative"
				box.style.marginBottom = "-44px;"
			});
		}
		
		return isCombatPage;
		
	}
	
	,
	
	getElementCode : function(element) {
		
		BladeMasterJS.traitMap.earth = 0
		BladeMasterJS.traitMap.lightning = 1
		BladeMasterJS.traitMap.water = 2
		BladeMasterJS.traitMap.fire = 3
		BladeMasterJS.traitMap.power = 4
		
		return BladeMasterJS.traitMap[element.toLowerCase().trim()];
	}
	
	,
	
	getAttrElement : function( attr ) {
			switch(element.toUpperCase()) {
			case "DEX":
				return 0;
				break;
			case "CHA":
				return 1;
				break;
			case "INT":
				return 2;
				break;
			case "STR":
				return 3;
				break;
			case "PWR":
				return 4;
				break;
		}
	}
	
	,
	
	/**
	 *
	 */
	loadCharacter : function() {
		
		this.character.name = document.querySelector(".character-data-column .name").innerText;
		
		this.character.element = this.getElementCode(document.querySelector(".character-data-column .trait-icon")._prevClass.replace("-icon trait-icon" , ""));
		
		this.character.power = parseInt(document.querySelector(".character-data-column .subtext-stats").children[3].innerText.replace("," , ""))
		
	}
	
	,
	
	/**
	 *
	 */
	loadWeapon : function() {
		
		this.weapon.name = document.querySelector('.weapon-selection .name').innerText;
		
		this.weapon.element = this.getElementCode(document.querySelector('.weapon-selection .trait').children[0].className.replace("-icon" , ""));
		
		this.getWeaponAttributes(this.weapon.name);
		
	}
	
	,
	
	/**
	 * 
	 */ 
	getWeaponAttributes : function( name ) {
		console.log('getWeaponAttributes')
		/* set defaults */
		this.weapon.stat = []; 
		this.weapon.bonusPower = 0; 
		
		this.weapon.stat[1] = {
			element : 1,
			power : 0
		}
		
		this.weapon.stat[2] = {
			element : 1,
			power : 0
		} 
		
		this.weapon.stat[3] = {
			element : 1,
			power : 0
		} 
		
		/* if no weapon tooltip is detected then bail */
		var toolTipInner = document.querySelector('.tooltip-inner');
		if(!toolTipInner || !toolTipInner.innerText) {
			console.log("return because no tooltip")
			return;
		}
		
		//var correctToolTip = {};
		//document.querySelectorAll('.tooltip-inner').forEach(function(element) {
			//console.log(element.innerText);
		//})

		this.weapon.statsRaw = toolTipInner.innerText;
		
		/* parse raw text by new line */
		this.weapon.statsParsed = this.weapon.statsRaw.split(/\r?\n/);
		console.log(this.weapon.statsParsed);
		
		if (this.weapon.statsParsed.length < 1 ) {
			return;
		}

		var count = 1;
		for ( lineItem of this.weapon.statsParsed ) {
			//console.log(lineItem);
			var traitParts = lineItem.split(":")
			
			if (typeof(traitParts[1]) == "undefined") {
				continue; 
			}
			
			if (!traitParts[1].match(/\d+/)) {
				continue; 
			}
			
			console.log(traitParts[0]);
			
			switch (traitParts[0]) {
				case "★":
				case "★★":
				case "★★★":
				case "★★★★":
				case "★★★★★":
				case "ID":
				case "LB":
				case "4B":
					continue
					break;
				case "INT" :
					this.weapon.stat[count].element = this.getElementCode("water");
					break;
				case "STR":
					this.weapon.stat[count].element = this.getElementCode("fire");
					break;
				case "CHA":
					this.weapon.stat[count].element = this.getElementCode("lightning");
					break;
				case "DEX":
					this.weapon.stat[count].element = this.getElementCode("earth");
					break;
				case "PWR":
					this.weapon.stat[count].element = this.getElementCode("power");
					break;
				case "Bonus power":
					this.weapon.bonusPower = this.weapon.bonusPower +  parseInt(traitParts[1].match(/\d+/).pop().trim());
					console.log(this.weapon.bonusPower);
					continue;
					break;
					
			}
			
			console.log(parseInt(traitParts[1].match(/\d+/).pop().trim()));
			
			BladeMasterJS.weapon.stat[count].power = parseInt(traitParts[1].match(/\d+/).pop().trim());
			
			count++;
			
		}
	

	}
	
	,
	
	loadEnemies : function() {
		
		BladeMasterJS.enemies = BladeMasterJS.enemies ? BladeMasterJS.enemies : []
		
		var enemyContainers = document.querySelectorAll('.encounter-container');

		/* loop through containers and build enemy profiles */
		count = 1;
		enemyContainers.forEach( function(enemy) {
			
			/* add % containers into enemy cards if they do not exist yet */
			if (!enemy.querySelector('.enemy'+count+'Chance')) {
				enemy.querySelector('.victory-chance').innerHTML = enemy.querySelector('.victory-chance').innerHTML + "<div class='enemy"+count+"Chance'></div>";
			}
			
			/* create enemy profile */
			BladeMasterJS.enemies[count] = {}
			
			BladeMasterJS.enemies[count].element = BladeMasterJS.getElementCode(enemy.querySelector('.encounter-element').children[0].className.replace('-icon' , ''));
			//console.log('count ' + count);
			BladeMasterJS.enemies[count].power = parseInt(enemy.querySelector('.encounter-power').innerText.replace(" Power " , "" )); 
			
			count++;
		});
	}
	
	, 
	/**
	 *
	 * 
	 */
	calculateBattle : function() {
		
		
		console.log("calculateBattle")
		console.log(BladeMasterJS.weapon)
		 	
		
	      /* if no weapon tooltip is detected then bail */
		if(!this.weapon.stat[1].power && !this.weapon.bonusPower) {
			console.log('"no such thing as a powerless blade"')
			return;
		}
		

		if (!document.querySelector('.encounter-container')) {
			return;
		}
		
	 	function t(t, a, e) {
	        let i = 1;
	        var r, n;
	        return t == a && (i += .075),
	        n = e,
	        ((r = t) == BladeMasterJS.traitMap.fire && n == BladeMasterJS.traitMap.earth || r == BladeMasterJS.traitMap.water && n == BladeMasterJS.traitMap.fire || r == BladeMasterJS.traitMap.lightning  && n == BladeMasterJS.traitMap.water || r == BladeMasterJS.traitMap.earth && n == BladeMasterJS.traitMap.lightning) && (i += .075),
	        function(t, a) {
	            return t == BladeMasterJS.traitMap.fire && a == BladeMasterJS.traitMap.water || t == BladeMasterJS.traitMap.water && a == BladeMasterJS.traitMap.lightning || t == BladeMasterJS.traitMap.lightning && a == BladeMasterJS.traitMap.earth || t == BladeMasterJS.traitMap.earth && a == BladeMasterJS.traitMap.fire
	        }(t, e) && (i -= .075),
	        i
	    }
	    function a(t, a) {
	        return t = Math.ceil(t),
	        a = Math.floor(a),
	        Math.floor(Math.random() * (a - t + 1)) + t
	    }
	 	
        let e = parseInt(BladeMasterJS.character.element)
          , i = parseInt(BladeMasterJS.weapon.element)
          , r = parseInt(BladeMasterJS.weapon.stat[1].element)
          , n = parseInt(BladeMasterJS.weapon.stat[2].element)
          , o = parseInt(BladeMasterJS.weapon.stat[3].element)
          , s = parseInt(BladeMasterJS.enemies[1].element)
          , p = parseInt(BladeMasterJS.enemies[2].element)
          , c = parseInt(BladeMasterJS.enemies[3].element)
          , d = parseInt(BladeMasterJS.enemies[4].element);
        !function(e, i, r, n, o, s, p, c, d, l, h, T, w, u, g, f, v, k) {
            let m, b, I = function(t, a, e, i, r, n, o) {
                let s = 1;
                a > 0 && e >= 0 && (s += e == t ? .0026750000000000003 * a : e == BladeMasterJS.traitMap.power ? .002575 * a : .0025 * a);
                i > 0 && r >= 0 && (s += r == t ? .0026750000000000003 * i : r == BladeMasterJS.traitMap.power ? .002575 * i : .0025 * i);
                n > 0 && o >= 0 && (s += o == t ? .0026750000000000003 * n : o == BladeMasterJS.traitMap.power ? .002575 * n : .0025 * n);
                return s
            }(n, o, s, p, c, d, l), y = e * I + r, x = Math.ceil(h - .1 * h), M = Math.floor(h + .1 * h), W = Math.ceil(y - .1 * y), P = Math.floor(y + .1 * y), F = Math.ceil(w - .1 * w), E = Math.floor(w + .1 * w), C = Math.ceil(y - .1 * y), L = Math.floor(y + .1 * y), R = Math.ceil(g - .1 * g), B = Math.floor(g + .1 * g), H = Math.ceil(y - .1 * y), N = Math.floor(y + .1 * y), D = Math.ceil(v - .1 * v), A = Math.floor(v + .1 * v), G = Math.ceil(y - .1 * y), J = Math.floor(y + .1 * y), O = t(i, n, T), S = t(i, n, u), U = t(i, n, f), _ = t(i, n, k), j = 0, q = 0, z = 0, K = 0;
            for (let t = 0; t < 500; t++)
                m = a(W, P) * O,
                b = a(x, M),
                m >= b && j++,
                m = a(C, L) * S,
                b = a(F, E),
                m >= b && q++,
                m = a(H, N) * U,
                b = a(R, B),
                m >= b && z++,
                m = a(G, J) * _,
                b = a(D, A),
                m >= b && K++;
                
		
                
            document.querySelector(".enemy1Chance").innerText = (j / 500 * 100).toFixed(2) + " %",
            document.querySelector(".enemy2Chance").innerText = (q / 500 * 100).toFixed(2) + " %",
            document.querySelector(".enemy3Chance").innerText = (z / 500 * 100).toFixed(2) + " %",
            document.querySelector(".enemy4Chance").innerText = (K / 500 * 100).toFixed(2) + " %"
            
        }( BladeMasterJS.character.power, e, BladeMasterJS.weapon.bonusPower, i, BladeMasterJS.weapon.stat[1].power, r, BladeMasterJS.weapon.stat[2].power, n, BladeMasterJS.weapon.stat[3].power, o, BladeMasterJS.enemies[1].power, s, BladeMasterJS.enemies[2].power, p, BladeMasterJS.enemies[3].power, c, BladeMasterJS.enemies[4].power, d)
    
	}

}

setTimeout(function() {
	/* annouce to console that BladeMasterJS is loaded */
	console.log('BladeMasterJS loaded');

	
	/* prevent delay on first run */
	BladeMasterJS.init();
	
	
} , 2000 )


